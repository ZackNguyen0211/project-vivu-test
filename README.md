This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project API settings.
3. Set `SUPABASE_SERVICE_ROLE_KEY` only for trusted server-side webhook/admin jobs. Never expose it with a `NEXT_PUBLIC_` prefix.
4. In the Supabase SQL Editor, run `supabase/migrations/202611200001_create_vivu_schema.sql`.
5. Run `supabase/seed.sql` to load demo operators, locations, routes, stops, coaches, trips, bookings, payments, vouchers, testimonials, and payouts.

The app reads public Supabase tables when the public environment variables are configured. Without them it keeps the built-in display fallback for local UI development.

## Demo accounts

After running `supabase/migrations/202611200003_seed_demo_accounts.sql`, use:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@vivucoach.vn` | `ViVuCoach@2026` |
| Shop / Operator | `shop@vivucoach.vn` | `ViVuCoach@2026` |
| User | `user@vivucoach.vn` | `ViVuCoach@2026` |

Change these demo passwords immediately before any public deployment.

## Authentication migrations

After creating the demo accounts, run:

1. `supabase/migrations/202611200004_add_user_signup_trigger.sql`

This creates normal `USER` profiles for new email registrations.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


```
project-ViVu
├─ AGENTS.md
├─ Document for ViVuCoach.md
├─ eslint.config.mjs
├─ next.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ (customer)
│  │  │  ├─ bookings
│  │  │  │  └─ [code]
│  │  │  │     └─ page.tsx
│  │  │  ├─ checkout
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  ├─ me
│  │  │  │  └─ bookings
│  │  │  │     └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ partner
│  │  │  │  └─ register
│  │  │  │     └─ page.tsx
│  │  │  ├─ search
│  │  │  │  └─ page.tsx
│  │  │  └─ trips
│  │  │     └─ [tripId]
│  │  │        └─ seats
│  │  │           └─ page.tsx
│  │  ├─ 403
│  │  │  └─ page.tsx
│  │  ├─ admin
│  │  │  ├─ dashboard
│  │  │  │  └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ reconciliation
│  │  │     └─ page.tsx
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  └─ callback
│  │  │  │     └─ route.ts
│  │  │  └─ bookings
│  │  │     └─ create
│  │  │        └─ route.ts
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ operator
│  │     ├─ layout.tsx
│  │     ├─ seat-manifest
│  │     │  └─ page.tsx
│  │     └─ trips
│  │        └─ page.tsx
│  ├─ components
│  │  ├─ checkout
│  │  │  └─ CheckoutPaymentClient.tsx
│  │  ├─ home
│  │  │  ├─ HeroSearchSection.tsx
│  │  │  ├─ PopularRoutesSection.tsx
│  │  │  ├─ TestimonialsAndCta.tsx
│  │  │  ├─ ValuePropsSection.tsx
│  │  │  ├─ VerifiedOperatorsSection.tsx
│  │  │  └─ VoucherSection.tsx
│  │  ├─ layout
│  │  │  ├─ BookingStepHeader.tsx
│  │  │  ├─ BookingStepProgress.tsx
│  │  │  ├─ CustomerFooter.tsx
│  │  │  ├─ CustomerHeader.tsx
│  │  │  ├─ PortalShell.tsx
│  │  │  └─ TmsDashboardShell.tsx
│  │  ├─ operator
│  │  │  ├─ OperatorTripsClient.tsx
│  │  │  └─ SeatManifestClient.tsx
│  │  ├─ partner
│  │  │  └─ PartnerRegistrationClient.tsx
│  │  ├─ search
│  │  │  └─ SearchScheduleClient.tsx
│  │  ├─ seats
│  │  │  └─ SeatSelectionClient.tsx
│  │  └─ ticket
│  │     └─ ElectronicTicketClient.tsx
│  ├─ lib
│  │  ├─ payment
│  │  │  └─ sepay.ts
│  │  └─ supabase
│  │     ├─ admin.ts
│  │     ├─ client.ts
│  │     ├─ config.ts
│  │     └─ server.ts
│  ├─ proxy.ts
│  ├─ services
│  │  ├─ admin.service.ts
│  │  ├─ booking.service.ts
│  │  ├─ home.service.ts
│  │  └─ operator.service.ts
│  └─ types
│     ├─ booking.ts
│     ├─ home.ts
│     ├─ portal.ts
│     └─ tms.ts
├─ supabase
│  ├─ migrations
│  │  ├─ 202611200001_create_vivu_schema.sql
│  │  ├─ 202611200002_fix_booking_rls.sql
│  │  ├─ 202611200003_seed_demo_accounts.sql
│  │  ├─ 202611200004_add_user_signup_trigger.sql
│  │  ├─ 202611200005_assign_manual_demo_roles.sql
│  │  ├─ 202611200006_create_partner_applications.sql
│  │  └─ 202611200007_complete_booking_seat_locking.sql
│  └─ seed.sql
└─ tsconfig.json

```