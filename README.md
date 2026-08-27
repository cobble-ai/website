# Cobble waitlist

Single-page waitlist site for Cobble, built with Next.js (App Router) and Tailwind CSS. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Waitlist backend

Submitting the form calls [`app/api/waitlist/route.ts`](app/api/waitlist/route.ts), which:

1. Validates the email and checks a hidden honeypot field.
2. Inserts the email into a `waitlist` table in Supabase using the service role key (server-only — the table has RLS enabled with no public policies, so it can't be written to from the browser).
3. Sends a confirmation email via Resend. If the email send fails, the signup is still kept — Supabase is the source of truth.

### One-time setup

1. **Supabase** — create a project, then run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor to create the `waitlist` table. Grab the project URL and the **service role key** (Project Settings > API) — not the anon key.
2. **Resend** — create an API key, and verify a sending domain (Domains tab) so you can send from an address on it, e.g. `Cobble <hello@yourdomain.com>`. Without a verified domain, Resend will only let you send to your own account email.
3. Copy `.env.example` to `.env.local` and fill in the four values.
4. In Vercel, add the same four environment variables (Project Settings > Environment Variables) before deploying.

### Environment variables

| Variable | Where it's used |
|---|---|
| `SUPABASE_URL` | `lib/supabaseAdmin.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabaseAdmin.ts` |
| `RESEND_API_KEY` | `lib/resend.ts` |
| `RESEND_FROM_EMAIL` | `app/api/waitlist/route.ts` |

None of these are prefixed with `NEXT_PUBLIC_` — they're only ever read server-side inside the route handler, never shipped to the browser.

## Deploy

Push to `main` and import the repo in Vercel, or run `vercel` from this directory. Framework preset is auto-detected as Next.js.
