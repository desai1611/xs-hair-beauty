# XS Hair & Beauty — Full Stack Website

A production-ready website for XS Hair & Beauty (Glenfield, Auckland): a React + Vite + Tailwind
frontend, an Express + MongoDB backend with a JWT-secured admin dashboard, email notifications on
booking submissions, and a Products page for the salon's retail hair-care range.

## Structure

```
demosaloon/
├── frontend/         React + Vite + Tailwind CSS (public site + admin dashboard)
├── backend/          Node.js + Express + MongoDB (Mongoose) REST API
├── static-preview/   Original static HTML mockup (kept for reference — not part of the live app)
└── .github/workflows/ci.yml   Runs backend + frontend tests and the frontend build on every push/PR
```

## What's included

- **Public site**: Home, Hair Services, Beauty Services, Advanced Beauty, Products, Reviews, Contact
  — all content-driven from the database (services, products, reviews, gallery, offers).
- **Booking form**: saves to MongoDB and emails the salon via Nodemailer.
- **Admin dashboard** (`/admin`): JWT-secured login, overview stats, booking inbox with status
  tracking, and CRUD screens for Services, Products, Gallery, Offers, and Reviews.
- **Tests**: 7 backend tests (Jest + Supertest + an in-memory MongoDB), 8 frontend tests (Vitest +
  Testing Library).
- **CI**: GitHub Actions runs both test suites and the frontend build on every push/PR to `main`.

## Local development

Prerequisites: Node 20+, a MongoDB instance (local `mongod` or an Atlas connection string).

```bash
# Backend
cd backend
cp .env.example .env      # edit values as needed — local MongoDB works out of the box
npm install
npm run seed               # populates services/products/reviews/gallery/offers + one admin user
npm run dev                 # http://localhost:5000

# Frontend (separate terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Seeded admin login: whatever you set as `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in
`backend/.env` before running `npm run seed` (defaults to `admin@xshairandbeauty.co.nz` /
`change-this-password` — **change this password on first login and before going live**).

Run tests:

```bash
cd backend && npm test
cd frontend && npm test
```

---

## Deployment runbook

Everything below is written so you (or the client) can follow it step by step. These are external
accounts and a domain purchase, so they need to be done by a human with billing access — I can't
create accounts or spend money on your behalf, but the codebase is ready to plug straight in.

### 1. MongoDB Atlas (database — free tier)

1. Create a free account at mongodb.com/atlas and create a new **M0 (free)** cluster.
2. Database Access → add a database user (username/password, not your Atlas login).
3. Network Access → add IP `0.0.0.0/0` (allow from anywhere) — simplest for Railway's dynamic IPs.
4. Clusters → Connect → "Drivers" → copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/xs-hair-beauty?retryWrites=true&w=majority`
5. Keep this string handy for step 2's `MONGO_URI`.

### 2. Backend on Railway

1. Push this repo to GitHub (see "Getting this onto GitHub" below if you haven't yet).
2. railway.app → New Project → Deploy from GitHub repo → select this repo.
3. Set the service's **root directory** to `backend`.
4. Add environment variables (Settings → Variables) — copy every key from `backend/.env.example`:
   - `MONGO_URI` — from step 1
   - `JWT_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
   - `CLIENT_ORIGIN` — your Vercel frontend URL once you have it (step 3); update after deploying the frontend
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `SALON_NOTIFICATION_EMAIL` — see step 5
   - `SEED_ADMIN_*` — only needed when you run the seed script
5. Railway auto-detects the `start` script (`npm start` → `node server.js`) — deploy.
6. Once live, note the public URL (e.g. `https://xs-hair-beauty-api.up.railway.app`).
7. Run the seed script once against production: easiest is to temporarily set your local
   `backend/.env` `MONGO_URI` to the Atlas string and run `npm run seed` from your machine.

### 3. Frontend on Vercel

1. vercel.com → New Project → import the same GitHub repo.
2. Set the project's **root directory** to `frontend` (Vercel reads `frontend/vercel.json` for
   the SPA rewrite rule already included in this repo).
3. Environment variables (copy from `frontend/.env.example`):
   - `VITE_API_URL` → `https://<your-railway-url>/api`
   - `VITE_SALON_PHONE_DISPLAY`, `VITE_SALON_PHONE_TEL`, `VITE_SALON_WHATSAPP`, `VITE_SALON_ADDRESS`, `VITE_SALON_FACEBOOK`
4. Deploy. Then go back to Railway and set `CLIENT_ORIGIN` to this Vercel URL so CORS allows it.

### 4. Domain name

1. Buy the domain from any registrar (e.g. Namecheap, GoDaddy, or via Vercel's own domain
   purchase flow) — this is a real purchase only you/the client can make.
2. In the Vercel project → Settings → Domains → add the domain, then add the DNS records Vercel
   shows you at your registrar (usually an `A` record to Vercel's IP or a `CNAME`).
3. Optional: give the API its own subdomain (e.g. `api.xshairandbeauty.co.nz`) pointed at Railway
   via a `CNAME`, configured in Railway's domain settings. Otherwise the Railway-issued URL works fine.

### 5. Email notifications (Gmail example)

1. On the Gmail account the salon wants notifications sent to/from: enable 2-Step Verification
   (Google Account → Security).
2. Google Account → Security → App Passwords → generate one for "Mail".
3. In Railway's backend environment variables:
   - `EMAIL_HOST=smtp.gmail.com`, `EMAIL_PORT=465`, `EMAIL_SECURE=true`
   - `EMAIL_USER=<the gmail address>`, `EMAIL_PASS=<the 16-character app password>`
   - `SALON_NOTIFICATION_EMAIL=<where booking alerts should land>`
4. Submit a test booking on the live site and confirm the email arrives — the admin dashboard's
   Bookings panel also shows "✅ email sent" / "⚠️ email not sent" per enquiry so you can verify.

### 6. CI/CD

- **CI** is already active: `.github/workflows/ci.yml` runs both test suites and the frontend
  build on every push and pull request to `main`.
- **CD**: once the Vercel and Railway projects are connected to the GitHub repo (steps 2–3), both
  redeploy automatically on every push to `main` — no extra setup needed.

### Getting this onto GitHub

```bash
cd D:\demosaloon
git init
git add .
git commit -m "Initial commit: XS Hair & Beauty full-stack site"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

---

## Before going live — content checklist

The seed data uses placeholder values from the requirements brief. Confirm/replace these with the
client before launch (most can be edited straight from the admin dashboard):

- [ ] Real phone number and WhatsApp number (currently placeholder `0022 342 3964`)
- [ ] Real business email (currently placeholder `hello@xshairandbeauty.co.nz`)
- [ ] Confirmed opening hours (currently placeholder Mon–Sat 9–6)
- [ ] Confirmed address for the Google Maps embed (currently `23 Chartwell Avenue, Glenfield, Auckland 0629`)
- [ ] Real service list + final pricing (Admin → Services)
- [ ] Real product list + pricing (Admin → Products)
- [ ] Real photos for services, gallery, before/afters, and products (Admin panels accept image
      URLs; wire up a host like Cloudinary/S3 for production image uploads, or use the built-in
      `/api/uploads` endpoint for small-scale local file storage)
- [ ] Real customer reviews (Admin → Reviews)
- [ ] Current offers/promotions (Admin → Offers)
- [ ] Change the seeded admin password
- [ ] Instagram link, if the client wants it added alongside Facebook
