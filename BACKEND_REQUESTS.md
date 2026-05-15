# Requests for the backend (BroZhy)

Mei here. Frontend is on the `frontend` branch. To finish wiring the product/shop/checkout flows, I need the backend to add the following. Order is by priority.

---

## 1. Add `tier` enum to `Product` (blocking Shop page filters)

Frontend categorizes shuttles into three tiers — they're our top-nav and home-page entry points, and the primary Shop filter.

```prisma
// schema.prisma
enum Tier {
  TOURNAMENT
  CLUB
  PRACTICE
}

model Product {
  // ...existing fields...
  tier  Tier  // make required; default whichever makes sense
}
```

Migration name suggestion: `add_product_tier`.

After the migration, please update `seed.ts` so each product has a tier, and re-run `npm run db:seed`.

---

## 2. Add `salePrice` to `Product` (blocking sale UI)

The ProductCard has a discount-price treatment baked in. We need an optional field.

```prisma
model Product {
  // ...existing fields...
  salePrice  Int?   // nullable, integer cents like `price`
}
```

When `salePrice != null && salePrice < price`, the frontend renders the original struck through and the sale price in the brand accent color.

---

## 3. CORS — allow the Next.js dev origin

Frontend runs on `http://localhost:3000` in dev. The default in `app.ts` reads `env.CORS_ORIGIN`. Please make sure `.env.example` includes:

```
CORS_ORIGIN=http://localhost:3000
```

(Multiple origins comma-separated is already supported, that's fine.)

---

## 4. Guest checkout (nice-to-have, not blocking)

The current `POST /api/orders/checkout` requires auth. The product brief calls for **no forced account creation** at checkout — that's a core differentiator. Two options:

**Option A** (preferred): make `requireAuth` optional on this route. If no token, accept an `email` field in the body and create a guest order linked by email.

**Option B**: I'll force users to register inline at checkout (still one page visually). Less ideal but workable.

Let me know which way you want to go.

---

## 5. Slug consistency in seed (small)

Right now seed uses long slugs like `yonex-aerosensa-30`. The frontend's mock used short SKU IDs like `as-50`. Either is fine — please just confirm the **canonical slug format** so I match it in my mock fallbacks. Long brand-prefixed slugs are probably better for SEO; if so I'll standardize on that.

---

## 6. Product fields the frontend reads (FYI, no action needed)

Just so you know what the product page renders, in case you want to backfill richer data later:

| Backend field | Frontend display |
|---|---|
| `name` | H1 |
| `brand.name` | Eyebrow (uppercased) |
| `price`, `salePrice` | Price block |
| `description` | Marketing paragraph |
| `featherType` | Spec table — "Feather" row |
| `speed` | Spec table — "Speed" row |
| `tier` | Breadcrumb + Shop filter |
| `imageUrl` | Hero image (falls back to gray placeholder) |
| `stock` | Hidden when > 5, shows "Only N left" when 1-5, "Out of stock" when 0 |

Things the frontend does **not** show by design: reviews, related products, ratings — so don't worry about populating those.

---

## How to ping me

Reply on the GitHub PR or just commit to `backend` and I'll pull. When schema changes, mention it in the commit message so I know to update the frontend types.
