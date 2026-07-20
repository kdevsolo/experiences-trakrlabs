# Interactive Experiences Platform

Create beautiful, interactive, shareable digital experiences — digital cards, apology letters, Spotify cassettes, countdowns, and more.

## Features

- **Offerings dashboard** — browse all experience types and start customizing instantly
- **Anonymous editing** — customize without login; config persists in session storage
- **Google auth (Supabase)** — required to save drafts and publish
- **Draft autosave** — authenticated drafts stored in Supabase Postgres
- **IP-restricted preview** — unpaid published links only work from the creator's IP
- **₹10 share unlock** — Dodo Payments unlocks public shareable links
- **Analytics** — view counts for published experiences
- **Spotify integration** — connect Spotify for cassette experiences

## Tech stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS 4 + shadcn-style UI
- Framer Motion
- Supabase (Auth, Postgres, Storage)
- Dodo Payments

## Getting started

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Create a Supabase project and configure Google OAuth in Authentication → Providers.

3. Run migrations and seed:

```bash
# Using Supabase CLI
supabase db push
psql $DATABASE_URL -f supabase/seed.sql
```

4. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Dodo Payments

Create a ₹10 product in the Dodo dashboard and set `DODO_SHARE_UNLOCK_PRODUCT_ID`. Configure the webhook to POST to `/api/webhooks/dodo`.

If Dodo credentials are not configured, the app runs in **dev unlock mode** and automatically unlocks sharing for local testing.

## Project structure

- `app/` — routes (offerings, editor, dashboard, public viewer)
- `components/experiences/` — experience type plugins (editor + viewer)
- `lib/templates/registry.ts` — template registry
- `lib/actions/` — Server Actions
- `supabase/migrations/` — database schema

## Experience types

Digital cards, Spotify cassettes, apology letters, love letters, birthday pages, memory timelines, countdowns, invitations, gift reveals, and confession pages.

## Notes

- Mobile IP addresses may change; unpaid IP-restricted links can break on cellular networks.
- Public sharing requires Google login + ₹10 payment per experience.
