# TaylorMade Landscapes marketing site

Modern Astro + Tailwind CSS (via the official Astro integration) brochure site for TaylorMade Landscapes (Nelson / Tasman, New Zealand). Ships with Cloudflare Pages hosting and a Pages Function that emails contact form enquiries via Zepto Mail (or any email provider you wire up).

## Prerequisites

- Node.js 18+ (Cloudflare Pages currently runs Node 18 LTS)
- npm 9+

## Install dependencies

```sh
npm install
```

## Local development

The Tailwind integration runs automatically inside Vite, so you only need a single dev server:

```sh
npm run dev
```

## Build for production

```sh
npm run build
```

Astro handles Tailwind/DaisyUI compilation for you and emits static files to `dist/` for Cloudflare Pages.

## Scroll animations

The site now uses [AOS](https://michalsnik.github.io/aos/) for lightweight, accessible scroll-triggered reveals. The initializer lives in `src/scripts/aos-init.ts` and automatically disables animations for users who prefer reduced motion. Add or tweak animations by applying `data-aos` attributes to markup (e.g. `data-aos="fade-up" data-aos-delay="150"`). Global defaults such as duration and easing can be updated in the initializer if you want a different feel site-wide.

## Preview production build locally

```sh
npm run preview
```

## Environment variables (Cloudflare Pages + local dev)

Set these in the Cloudflare Pages project → **Settings → Environment variables** (available in both production and preview environments):

| Variable | Description |
| --- | --- |
| `ZEPTO_API_KEY` | Zoho EncZa API token from Zepto Mail. Required for the Cloudflare Function to send emails. |
| `ZEPTO_FROM_ADDRESS` | Email address verified in Zepto Mail to use as the sender, e.g. `noreply@fabienbrocklesby.com`. Defaults to the noreply address above if omitted. |
| `ZEPTO_TO_ADDRESS` | Destination address for enquiries, e.g. `test@fabienbrocklesby.com`. Defaults to the test inbox if omitted. |

### Local Pages Functions testing

1. Create a `.dev.vars` file in the project root (ignored by Git) with the same key/value pairs:

   ```
   ZEPTO_API_KEY="your-zepto-token"
   ZEPTO_FROM_ADDRESS="noreply@fabienbrocklesby.com"
   ZEPTO_TO_ADDRESS="test@fabienbrocklesby.com"
   ```

2. Build the site once so Wrangler has assets to serve:

   ```sh
   npm run build
   ```

3. Run the Cloudflare emulation (this serves static files + `/functions` endpoints using the env vars above):

   ```sh
   npx wrangler pages dev ./dist --local
   ```

   While Wrangler is running, submit the contact form at `http://127.0.0.1:8788` to test Zepto delivery with your local credentials. Use `Ctrl+C` to stop the server.

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
- Attempts to send an email via the Zepto Mail API when `ZEPTO_API_KEY` is configured.
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
