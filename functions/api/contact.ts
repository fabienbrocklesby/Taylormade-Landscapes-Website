import type { EventContext } from '@cloudflare/workers-types';

interface Env {
  ZEPTO_API_KEY?: string;
  ZEPTO_FROM_ADDRESS?: string;
  ZEPTO_TO_ADDRESS?: string;
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

export const onRequestPost = async ({
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
  if (!env.ZEPTO_API_KEY) {
    console.warn('Missing ZEPTO_API_KEY; skipping outbound email.');
    return;
  }

  const toAddress = env.ZEPTO_TO_ADDRESS || 'enquiry@taylormadelandscapes.co.nz';
  const fromAddress = env.ZEPTO_FROM_ADDRESS || 'noreply@fabienbrocklesby.com';
  const subject = `New enquiry from ${data.name}`;
  const htmlBody = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <h2 style="margin-bottom: 0.5rem;">New website enquiry</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Suburb:</strong> ${data.suburb}</p>
      <p><strong>Service type:</strong> ${data.serviceType}</p>
      <p><strong>Budget range:</strong> ${data.budgetRange || 'Not specified'}</p>
      <p><strong>Preferred timing:</strong> ${data.preferredTiming || 'Not specified'}</p>
      <p><strong>Project details:</strong></p>
      <p>${data.description.replace(/\n/g, '<br />')}</p>
    </div>
  `;

  const textBody = `New website contact enquiry

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Suburb: ${data.suburb}
Service type: ${data.serviceType}
Budget range: ${data.budgetRange || 'Not specified'}
Preferred timing: ${data.preferredTiming || 'Not specified'}

Project details:
${data.description}`;

  const response = await fetch('https://api.zeptomail.com.au/v1.1/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Zoho-enczapikey ${env.ZEPTO_API_KEY}`,
    },
    body: JSON.stringify({
      from: { address: fromAddress },
      to: [
        {
          email_address: {
            address: toAddress,
            name: 'TaylorMade Landscapes Contact',
          },
        },
      ],
      subject,
      htmlbody: htmlBody,
      textbody: textBody,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Zepto Mail error', response.status, errorBody);
    throw new Error('Failed to send contact email');
  }
}
