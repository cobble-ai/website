// Backfill: sends the confirmation email to every waitlist row that hasn't
// gotten one yet (confirmation_sent_at is null), regardless of which step
// they reached. Useful both for catching up existing signups and as a
// diagnostic — it prints the exact Resend/Supabase error for every failure
// instead of swallowing it.
//
// Usage:
//   npx tsx scripts/send-confirmations.ts            # sends for real
//   npx tsx scripts/send-confirmations.ts --dry-run   # lists who it would email, sends nothing
//
// Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY,
// RESEND_FROM_EMAIL, RESEND_REPLY_TO_EMAIL in .env.local (same values as
// Vercel's Production environment).

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { confirmationEmail } from "../app/api/waitlist/route";

const DRY_RUN = process.argv.includes("--dry-run");

// Resend's default rate limit is 2 requests/second; this keeps well under
// that for a list this size without needing batch-send plumbing.
const DELAY_BETWEEN_SENDS_MS = 600;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL;

  const missing = [
    ["SUPABASE_URL", supabaseUrl],
    ["SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey],
    ["RESEND_API_KEY", resendApiKey],
    ["RESEND_FROM_EMAIL", from],
    ["RESEND_REPLY_TO_EMAIL", replyTo],
  ].filter(([, value]) => !value);

  if (missing.length > 0) {
    console.error(
      `Missing env vars: ${missing.map(([name]) => name).join(", ")}. ` +
        "Copy .env.example to .env.local and fill in the real (production) values first.",
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { persistSession: false },
  });
  const resend = new Resend(resendApiKey!);

  const { data: rows, error } = await supabase
    .from("waitlist")
    .select("email, has_posted, free_edit_optin, confirmation_sent_at")
    .is("confirmation_sent_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to read the waitlist table:", error);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("Nothing to send: every row already has confirmation_sent_at set.");
    return;
  }

  console.log(
    `${rows.length} row(s) without a confirmation email${DRY_RUN ? " (dry run, sending nothing)" : ""}:`,
  );

  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const email = row.email as string;
    const hasPosted = row.has_posted !== false;
    const freeEditOptin = row.free_edit_optin === true;
    const variant = hasPosted ? "A (posted)" : "B (not posted)";

    if (DRY_RUN) {
      console.log(`  - ${email} -> variant ${variant}`);
      continue;
    }

    const { subject, html } = confirmationEmail(hasPosted, freeEditOptin);

    const { error: sendError } = await resend.emails.send({
      from: from!,
      to: email,
      replyTo: replyTo!,
      subject,
      html,
    });

    if (sendError) {
      failed += 1;
      console.error(`  FAILED  ${email}: ${sendError.name} - ${sendError.message}`);
    } else {
      const { error: updateError } = await supabase
        .from("waitlist")
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq("email", email);

      if (updateError) {
        failed += 1;
        console.error(
          `  SENT but failed to mark ${email} as sent (will re-send next run): ${updateError.message}`,
        );
      } else {
        sent += 1;
        console.log(`  sent    ${email} (variant ${variant})`);
      }
    }

    await sleep(DELAY_BETWEEN_SENDS_MS);
  }

  if (!DRY_RUN) {
    console.log(`\nDone: ${sent} sent, ${failed} failed.`);
    if (failed > 0) {
      console.log(
        "If every send failed with something like 'You can only send testing emails to your own email address', " +
          "your Resend sending domain isn't verified yet (Resend dashboard > Domains).",
      );
    }
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
