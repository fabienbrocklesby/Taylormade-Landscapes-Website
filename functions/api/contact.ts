import type { EventContext, PagesFunction } from '@cloudflare/workers-types';

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_RECIPIENT?: string;
  CONTACT_FROM_ADDRESS?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  serviceType: string;
  description: string;
  budgetRange?: string;
  preferredTiming?: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export const onRequestPost: PagesFunction<Env> = async ({
  request,
  env,
}: EventContext<Env, string, unknown>) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  try {
    const formData = await request.formData();
    const data: ContactPayload = {
      name: formData.get('name')?.toString().trim() ?? '',
      email: formData.get('email')?.toString().trim() ?? '',
      phone: formData.get('phone')?.toString().trim() ?? '',
      suburb: formData.get('suburb')?.toString().trim() ?? '',
      serviceType: formData.get('serviceType')?.toString().trim() ?? '',
      description: formData.get('description')?.toString().trim() ?? '',
      budgetRange: formData.get('budgetRange')?.toString().trim() || undefined,
      preferredTiming: formData.get('preferredTiming')?.toString().trim() || undefined,
    };

    const errors: Record<string, string> = {};
    if (!data.name) errors.name = 'Name is required';
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Valid email is required';
    if (!data.phone) errors.phone = 'Phone is required';
    if (!data.suburb) errors.suburb = 'Suburb is required';
    if (!data.serviceType) errors.serviceType = 'Select a service type';
    if (!data.description) errors.description = 'Please describe the project';

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ ok: false, errors }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    await sendContactEmail(data, env);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error('Contact form error', error);
    return new Response(
      JSON.stringify({ ok: false, message: 'Something went wrong. Please try again later.' }),
      {
        status: 500,
        headers: jsonHeaders,
      },
    );
  }
};

async function sendContactEmail(data: ContactPayload, env: Env) {
  if (!env.RESEND_API_KEY || !env.CONTACT_RECIPIENT) {
    console.warn('Missing email environment variables; skipping outbound email.');
    return;
  }

  const subject = `New enquiry from ${data.name}`;
  const content = `New website contact enquiry:\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nSuburb: ${data.suburb}\nService type: ${data.serviceType}\nBudget range: ${data.budgetRange || 'Not specified'}\nPreferred timing: ${data.preferredTiming || 'Not specified'}\n\nProject details:\n${data.description}`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_ADDRESS || 'TaylorMade Landscapes <notifications@taylormadelandscapes.nz>',
      to: [env.CONTACT_RECIPIENT],
      subject,
      text: content,
    }),
  });
}
