# Project Context Summary

This document is a persistent, reusable context summary for the repository.

---

# Architecture Summary

- Monolithic Next.js App Router application.
- Server Actions for mutations and data writes.
- Route Handlers for API endpoints.
- Drizzle ORM + Turso (libSQL) for database.
- better-auth for authentication and sessions.
- Uploadthing for file uploads.

---

# Main Flows

## Product Flow
- UI pages call `getProducts()` in app/actions/products.ts.
- Data is fetched from Drizzle with relations.
- UI renders cards and product details.

## Cart Flow
- Cart state lives in lib/cartContext.tsx.
- Persisted in localStorage using `ghaly_cart_items`.
- Accessed via hooks/useCart.ts.

## Checkout Flow
- Form state and validation via hooks/useCheckout.ts + lib/checkoutValidation.ts.
- Locations via lib/egyptianLocations.ts.
- Order creation via app/actions/orders.ts.

## Admin Flow
- Admin routes protected in app/admin/layout.tsx (role check).
- Product CRUD via app/admin/products/actions.ts.
- Orders list and status updates via app/admin/orders/actions.ts.

---

# Important Files

- lib/schema.ts: DB schema and relations.
- lib/db.ts: Drizzle DB connection.
- lib/auth.ts: better-auth configuration.
- lib/auth-client.ts: client auth helpers.
- app/actions/products.ts: product query.
- app/actions/orders.ts: order creation.
- app/admin/products/actions.ts: product CRUD.
- app/admin/orders/actions.ts: order status updates.
- app/api/search/products/route.ts: search endpoint.
- app/api/uploadthing/core.ts: upload middleware.

---

# Security Considerations

- Admin server actions lack role checks internally.
- Order creation trusts client-provided totals and prices.
- Uploads require session validation, which is already enforced.

---

# Data Model Summary

- products, product_images, product_sizes, product_variants
- orders, order_items
- user, session, account, verification (better-auth)

---

# UI Structure

- app/page.tsx: home and featured products.
- app/shop/page.tsx: product listing and search.
- app/product/[id]/page.tsx + ProductDetails.tsx: product detail.
- app/cart/page.tsx: cart UI.
- app/checkout/page.tsx: checkout form.
- app/admin/*: admin dashboard, products, orders.

---

# Common Patterns

- Tailwind utility classes for UI styling.
- Context API for cart and toast state.
- Server Actions for writes, Server Components for reads.
- Typed schema-driven data via Drizzle.
