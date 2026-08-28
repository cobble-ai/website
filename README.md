# Cobble waitlist

Single-page waitlist site for Cobble, built with Next.js (App Router) and Tailwind CSS. Deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Waitlist backend

The form is a 3-step qualification flow ([`components/WaitlistForm.tsx`](components/WaitlistForm.tsx)). Step 1 (email, handle, country) saves as soon as it's valid, so an abandoned session still leaves a usable lead. Steps 2 and 3 call the same endpoint again and update that same row.

Each step posts a flat, partial object to [`app/api/waitlist/route.ts`](app/api/waitlist/route.ts), which:

1. Validates the email and checks a hidden honeypot field.
2. Upserts it into a `waitlist` table in Supabase, keyed on `email`, using the service role key (server-only; the table has RLS enabled with no public policies, so it can't be written to from the browser). Upsert means each call only touches the columns it sends, so three separate calls build up one row instead of overwriting each other.
3. On step 3 (Apply), sends one of two confirmation email variants via Resend, once (guarded by `confirmation_sent_at`). The branch reads `has_posted` (set in step 2, from whether "I haven't posted a video yet" was picked in the edit-time question) off the row it just upserted; the free-edit callout paragraph additionally requires `free_edit_optin` from the same step-3 request. If the email send fails, the signup is still kept. Supabase is the source of truth.

Funnel instrumentation (`page_view`, `step_1_complete`, `step_2_complete`, `form_submit`) is `console.log`-only for now (prefixed `[analytics]`) — there's no analytics library wired up yet.

### One-time setup

1. **Supabase**: create a project, then run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor to create/update the `waitlist` table. Grab the project URL and the **service role key** (Project Settings > API), not the anon key.
2. **Resend**: create an API key, and verify a sending domain (Domains tab) so you can send from an address on it, e.g. `Peter from Cobble <hello@yourdomain.com>`. Without a verified domain, Resend will only let you send to your own account email.
3. Copy `.env.example` to `.env.local` and fill in the five values. `RESEND_REPLY_TO_EMAIL` should be a real inbox someone actually reads, since the confirmation email asks people to reply.
4. In Vercel, add the same five environment variables (Project Settings > Environment Variables) before deploying.

### Environment variables

| Variable | Where it's used |
|---|---|
| `SUPABASE_URL` | `lib/supabaseAdmin.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabaseAdmin.ts` |
| `RESEND_API_KEY` | `lib/resend.ts` |
| `RESEND_FROM_EMAIL` | `app/api/waitlist/route.ts` |
| `RESEND_REPLY_TO_EMAIL` | `app/api/waitlist/route.ts` |

None of these are prefixed with `NEXT_PUBLIC_`. They're only ever read server-side inside the route handler, never shipped to the browser.

## Deploy

Push to `main` and import the repo in Vercel, or run `vercel` from this directory. Framework preset should be **Next.js**. Do not set a custom Output Directory (Vercel handles `.next` automatically). The included `vercel.json` enforces this.
