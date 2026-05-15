# BattyHub Backend

E-commerce API for selling badminton shuttlecocks. Built to be consumed by a Next.js frontend.

## Stack

- Node.js 22 + TypeScript + Express
- PostgreSQL + Prisma
- JWT auth + bcrypt
- Zod validation
- Stripe Checkout
- Pino logging

## Setup

### 1. Install dependencies

```powershell
npm install
```

### 2. Provision a PostgreSQL database

Pick one:

**A. Local Docker (recommended for dev):**
```powershell
docker run --name battyhub-pg -e POSTGRES_USER=battyhub -e POSTGRES_PASSWORD=battyhub -e POSTGRES_DB=battyhub -p 5432:5432 -d postgres:16
```

**B. Hosted (Neon / Supabase / Railway):** create a free Postgres database, copy the connection string.

### 3. Configure environment

```powershell
Copy-Item .env.example .env
```

Edit `.env`:
- `DATABASE_URL` — your Postgres connection string
- `JWT_SECRET` — a long random string (e.g. `openssl rand -hex 32`)
- `STRIPE_SECRET_KEY` — leave as default if not testing payments yet

### 4. Run migrations + seed

```powershell
npm run prisma:migrate -- --name init
npm run db:seed
```

Seed creates: an admin user (`admin@battyhub.local` / `admin123`) and two sample products.

### 5. Start the dev server

```powershell
npm run dev
```

Server runs on `http://localhost:4000`. Health check: `GET /api/health`.

## API endpoints

### Auth
- `POST /api/auth/register` — `{ email, password, name? }`
- `POST /api/auth/login` — `{ email, password }`
- `GET  /api/auth/me` — requires `Authorization: Bearer <token>`

### Products
- `GET    /api/products` — query: `?brand=yonex&active=true`
- `GET    /api/products/:slug`
- `POST   /api/products` — admin only
- `PATCH  /api/products/:id` — admin only
- `DELETE /api/products/:id` — admin only (soft delete)

### Orders
- `GET  /api/orders` — current user's orders
- `GET  /api/orders/:id`
- `POST /api/orders/checkout` — creates order + Stripe Checkout session; returns `checkoutUrl`

## Calling from Next.js

```ts
const res = await fetch("http://localhost:4000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { token, user } = await res.json();
```

Set `NEXT_PUBLIC_API_URL=http://localhost:4000` in the frontend `.env.local` so it isn't hardcoded.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start with hot reload (tsx) |
| `npm run build` | Compile TS → `dist/` |
| `npm start` | Run compiled output |
| `npm test` | Run vitest |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run prisma:migrate` | Create + apply a new migration |
| `npm run db:seed` | Seed sample data |

## TODOs (next milestones)

- [ ] Stripe webhook handler (`POST /api/webhooks/stripe`) to mark orders PAID
- [ ] Image upload (Cloudinary or S3)
- [ ] Transactional email (Resend) for order confirmation
- [ ] Reviews endpoints
- [ ] Coupon / discount codes
- [ ] Rate limiting per-user (currently global)
- [ ] Sentry error tracking
- [ ] CI: GitHub Actions for lint + test on PRs
