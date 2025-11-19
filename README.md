# TaylorMade Landscapes marketing site

Modern Astro + Tailwind CSS v4 brochure site for TaylorMade Landscapes (Nelson / Tasman, New Zealand). Ships with Cloudflare Pages hosting and a Pages Function that emails contact form enquiries via Resend (or your preferred provider).

## Prerequisites

- Node.js 18+ (Cloudflare Pages currently runs Node 18 LTS)
- npm 9+

## Install dependencies

```sh
npm install
```

## Local development

Tailwind CSS v4 uses the CSS-first workflow. Run the CLI watcher in one terminal and Astro dev server in another:

```sh
# Terminal 1 – Tailwind CSS watch mode
npm run dev:css
```

```sh
# Terminal 2 – Astro dev server
npm run dev
```

The CSS watcher compiles `src/styles/global.css` into `src/styles/output.css`, which is imported by the base layout.

## Build for production

```sh
npm run build
```

This script runs the Tailwind CLI to refresh `src/styles/output.css` and then executes `astro build`, emitting static files to `dist/` for Cloudflare Pages.

## Scroll animations

The site now uses [AOS](https://michalsnik.github.io/aos/) for lightweight, accessible scroll-triggered reveals. The initializer lives in `src/scripts/aos-init.ts` and automatically disables animations for users who prefer reduced motion. Add or tweak animations by applying `data-aos` attributes to markup (e.g. `data-aos="fade-up" data-aos-delay="150"`). Global defaults such as duration and easing can be updated in the initializer if you want a different feel site-wide.

## Preview production build locally

```sh
npm run preview
```

## Environment variables (Cloudflare Pages)

Set these in the Cloudflare Pages project → **Settings → Environment variables** (available in both production and preview environments):

| Variable | Description |
| --- | --- |
| `RESEND_API_KEY` | API key for Resend (or any compatible email API). Optional during local dev; if missing, the worker logs a warning and skips email sending. |
| `CONTACT_RECIPIENT` | Destination email address (e.g. `hello@taylormadelandscapes.nz`). |
| `CONTACT_FROM_ADDRESS` | Verified sender for Resend, e.g. `TaylorMade Landscapes <notifications@taylormadelandscapes.nz>`. Optional – defaults to a placeholder. |

## Deploying to Cloudflare Pages

1. Push this repository to GitHub (or another Git provider Cloudflare supports).
2. In Cloudflare Pages, create a new project and connect the repo.
3. Configure build settings:
   - **Framework preset:** *None*
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 18 (or the latest LTS supported by Pages).
4. Add the environment variables listed above.
5. Deploy. The `/functions` directory (specifically `functions/api/contact.ts`) automatically becomes a Pages Function powering `/api/contact`.

## Contact form backend

- Accepts `POST /api/contact` with standard form fields.
- Validates required fields and returns JSON `{ ok: true }` on success.
- Attempts to send an email via the Resend API if credentials are present.
- Returns meaningful HTTP status codes (400 validation errors, 405 method block, 500 on unexpected issues).

## Project structure

```
.
├── astro.config.mjs
├── functions/
│   └── api/
│       └── contact.ts
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
```

Replace images in `public/images` with real photography before launch, and update contact details as needed.
