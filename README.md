# XS Hair & Beauty — Website

Live site: **https://xshairbeauty.nz**

Website for XS Hair & Beauty salon (25 Chartwell Avenue, Glenfield, Auckland). A React + Vite +
Tailwind frontend, an Express + MongoDB backend, and a JWT-secured admin dashboard for managing
the site's content.

## How it works

- Customers browse services, products, reviews and offers, then **book through Fresha** (the
  salon's booking system) or **enquire via the contact form / WhatsApp / phone**.
- **Fresha is the source of truth** for services, prices and durations. The site mirrors all 66
  Fresha services, and reviews shown are real Fresha / Google reviews.
- Enquiries are saved to MongoDB and appear in the admin dashboard. Automatic emails are
  deliberately off (Railway's Hobby plan blocks SMTP); the flow is enquiry → WhatsApp hand-off.

## Stack and hosting

| Part | Tech | Hosted on |
|---|---|---|
| Frontend (`frontend/`) | React, Vite, Tailwind CSS, React Router, axios | Cloudflare Workers static assets, built from `main` |
| Backend (`backend/`) | Node 20+, Express 5, Mongoose | Railway |
| Database | MongoDB | Railway |
| Domain / DNS / HTTPS | `xshairbeauty.nz` | Cloudflare |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | GitHub |

Pushing to `main` redeploys automatically: Cloudflare rebuilds the frontend on every push, and
Railway redeploys the backend only when `backend/**` or the root `package.json` change.

## Structure

```
demosaloon/
├── frontend/         React + Vite + Tailwind (public site + /admin dashboard)
│   ├── public/       _headers, robots.txt, sitemap.xml, images, videos, brand logos
│   ├── wrangler.jsonc  Cloudflare config (SPA fallback so /contact works when opened directly)
│   └── src/          pages, components, config/salon.js (phone, booking link, ratings)
├── backend/          Express REST API + Mongoose models
│   ├── src/          routes, controllers, middleware, models, utils
│   ├── src/seed/     seed + content import/export scripts
│   └── tests/        Jest + Supertest
├── static-preview/   Original static HTML mockup (reference only)
└── package.json      Root file so Railway can build the backend
```

## Features

- **Public pages**: Home, Hair Services, Beauty Services, Products, Reviews, Contact, Terms.
- **Service cards**: duration, "Most popular" badge (Nanoplastia, Keratin Straightening,
  Brazilian Keratin), expandable descriptions, Book → Fresha.
- **Products**: shown with "Price on enquiry"; bridal and party packages are "on request".
- **Look and feel**: ivory / rose-gold theme, looping background video, translucent
  "liquid glass" sticky header.
- **Chat assistant**: a small chat button answers common questions (hours, location, booking,
  bridal/party, products). Its answers live in `frontend/src/components/ChatWidget.jsx`; keep them
  in line with the site (booking is via Fresha, bridal/party are on request).
- **Admin dashboard** (`/admin`): login, overview, enquiry inbox with status (including a
  **Delete all** button that asks you to type `DELETE`), and add/edit/delete for Services,
  Products, Gallery, Offers, Reviews, Transformations and Site Media.
- **Security**: helmet, CORS allow-list, rate limits (login and enquiries 10 per 15 min),
  input validation and sanitising, honeypot field on the enquiry form, security headers on the
  frontend (`frontend/public/_headers`).
- **SEO**: every page has its own title and description (`frontend/src/components/PageMeta.jsx`),
  plus `robots.txt` (blocks `/admin`) and `sitemap.xml`. The site is verified in Google Search
  Console and Bing Webmaster Tools.

## Local development

Prerequisites: Node 20+ and a MongoDB instance (local `mongod` or a connection string).

```bash
# Backend
cd backend
cp .env.example .env      # edit values as needed
npm install
npm run seed              # sample content + one admin user
npm run dev               # http://localhost:5000

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

The seeded admin login is whatever you set as `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in
`backend/.env` before running `npm run seed`. Never keep the default password in production.

Run tests (backend: Jest + Supertest with an in-memory MongoDB; frontend: Vitest + Testing
Library). CI runs both on every push:

```bash
cd backend && npm test
cd frontend && npm test
```

## Environment variables

Backend (`backend/.env.example` lists all of them): `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`,
`NODE_ENV`, `CLIENT_ORIGIN` (comma-separated allowed origins: localhost, `xshairbeauty.nz`,
`www.xshairbeauty.nz`), plus optional email settings (`RESEND_API_KEY` + `EMAIL_FROM_ADDRESS`,
or SMTP `EMAIL_*`). With no email settings, emails are simply skipped.

Frontend (`frontend/.env.example`): `VITE_API_URL` (backend API base, ending in `/api`) and the
`VITE_SALON_*` contact details.

## Managing content in production

Content is edited in the admin dashboard or synced from a local database:

1. Edit content locally, then run `node backend/src/seed/export-content.js`. This writes
   `content.json` and copies uploaded images to `frontend/public/uploads`.
2. Commit and push.
3. In the Railway console for the backend, run `node src/seed/import-content.js --apply`. This
   is idempotent and replaces services, products, offers, gallery, reviews and site content only.
   It never touches enquiries or admin accounts.

Other maintenance scripts in `backend/src/seed/`:

- `reset-admin-password.js` — set a new admin password (hidden prompt, 10+ characters).
- `sync-fresha-services.js` — rebuild services from `fresha-services.json`.
- `replace-reviews.js`, `replace-products.js` — load the real reviews and products.

On Railway the console needs node on the PATH first:
`export $(tr '\0' '\n' < /proc/1/environ | grep '^PATH=') && node src/seed/<script>.js`

## Deployment

**Frontend (Cloudflare):** connect the GitHub repo, set the root directory to `frontend`, build
command `npm run build`, and deploy with the included `wrangler.jsonc`. Add `VITE_API_URL` as a
build variable. Cloudflare "Always Use HTTPS" is on, and a redirect rule sends `www` to the bare
domain.

**Old Vercel copy:** the site was first deployed on Vercel (`xs-hair-beauty.vercel.app`). That
project still exists, so `frontend/vercel.json` permanently redirects every path to
`https://xshairbeauty.nz`. This avoids a duplicate copy of the site in search results. Cloudflare
ignores this file. The Vercel project can be deleted in Vercel (Project, Settings, Delete) once you
no longer need the old address; if you do, `vercel.json` can go too.

**Backend (Railway):** deploy from the same repo with the root directory `backend`, add the
environment variables above, and set Watch Paths to `/backend/**` and `/package.json` so only
backend changes redeploy it.

**Search engines:** the domain is verified in Google Search Console (DNS TXT record) and Bing
Webmaster Tools (DNS CNAME record). Keep both records in Cloudflare DNS or verification is lost.
The sitemap at `https://xshairbeauty.nz/sitemap.xml` is submitted to both, and indexing was
requested in Google for all 7 pages (Nov 2026). When you add a new public page, add it to
`frontend/public/sitemap.xml` and to the `PAGES` list in `PageMeta.jsx`, then use "Request
indexing" in Search Console for the new URL.

## Still open

- Real before/after photos (placeholders are shown on the Reviews page)
- Real product prices (currently "Price on enquiry")
- Google Business Profile website set to `https://xshairbeauty.nz` (owner to do)
