import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getResend } from "@/lib/resend";
import {
  COBBLE_WORDMARK_PNG_BASE64,
  COBBLE_WORDMARK_WIDTH_2X,
  COBBLE_WORDMARK_HEIGHT_2X,
} from "@/lib/wordmark";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistBody = {
  email?: unknown;
  company?: unknown;
  handle?: unknown;
  country?: unknown;
  archive?: unknown;
  broll_sources?: unknown;
  edit_time?: unknown;
  has_posted?: unknown;
  paid_for?: unknown;
  free_edit_optin?: unknown;
  annoyance?: unknown;
  source?: unknown;
  submitted_at?: unknown;
  step_reached?: unknown;
};

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === "string");
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

// Body copy is verbatim per spec, including its em dashes.
function confirmationEmail(hasPosted: boolean, freeEditOptin: boolean) {
  const subject = hasPosted
    ? "You're on the list — one question"
    : "You're on the list";

  const p = (text: string) => `<p style="margin:0 0 16px 0;">${text}</p>`;

  const freeEditBlock =
    hasPosted && freeEditOptin
      ? p("You said you'd be open to one of the first free edits. That's the shortlist this reply matters most for.")
      : "";

  const bodyHtml = hasPosted
    ? [
        p("Hey, Peter here. One of the two people building Cobble."),
        p("You're on the list. That doesn't do much on its own, so here's the part that does:"),
        p(`Reply and tell me which of your recent videos was the worst one to edit, and what specifically made it bad. Not the general "editing takes ages" version — the actual video and the actual part that dragged.`),
        p("I read all of them. We're picking a small number of creators to run real edits for first, and this is what I go on."),
        freeEditBlock,
        p("On timing: Cobble isn't ready, and I'm not going to pretend it's a few weeks away. What I am doing is posting the whole build publicly — every version of the output, including the bad ones — at @peter_ishere. That's the fastest way to find out whether this is going to be any good before you ever get access."),
        p("I'll email you when there's something real to use. Roughly once a month otherwise, one paragraph, nothing else."),
        p("Peter"),
      ].join("\n")
    : [
        p("Hey, Peter here — one of the two people building Cobble."),
        p("You're on the list. Straight up though: Cobble is being built for creators already posting regularly and losing hours to editing, so you're early for us rather than the other way round."),
        p("No ask from me. If you want the interesting part in the meantime, I'm posting the whole build publicly at @peter_ishere — every version of the output, including the bad ones."),
        p("I'll email when there's something real to use."),
        p("Peter"),
      ].join("\n");

  // Table layout with inline styles only: no webfonts, no SVG, no grain
  // (none of that renders reliably in email clients). The wordmark is a
  // PNG at 2x so it stays lowercase "cobble" with tight tracking even
  // where @font-face is stripped (Gmail always strips it). Amber appears
  // exactly once, as the rule under the wordmark. Everything else is
  // left-aligned maroon-on-bone body copy, never long copy on a maroon
  // ground.
  const wordmarkWidth = Math.round(COBBLE_WORDMARK_WIDTH_2X / 2);
  const wordmarkHeight = Math.round(COBBLE_WORDMARK_HEIGHT_2X / 2);

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background:#EAE0CC;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EAE0CC;">
      <tr>
        <td align="left" style="padding:0;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="left" style="width:600px;max-width:100%;">
            <tr>
              <td style="padding:32px 24px 0 24px;" align="left">
                <img
                  src="data:image/png;base64,${COBBLE_WORDMARK_PNG_BASE64}"
                  width="${wordmarkWidth}"
                  height="${wordmarkHeight}"
                  alt="cobble"
                  style="display:block;border:0;outline:none;"
                />
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 0 24px;">
                <div style="height:2px;line-height:2px;font-size:2px;background-color:#E8823A;">&nbsp;</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 40px 24px;text-align:left;color:#4C1620;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html };
}

export async function POST(request: Request) {
  let body: WaitlistBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots that fill hidden fields get a fake success, no persistence.
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return NextResponse.json({ status: "ok" });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const stepReached =
    typeof body.step_reached === "number" ? body.step_reached : undefined;

  // Every call is a flat, partial record keyed on email. Only columns present
  // here get written — upsert's ON CONFLICT DO UPDATE only touches the
  // columns given in this call, so steps 1, 2, and 3 layer onto one row
  // instead of overwriting each other's fields.
  const record: Record<string, unknown> = { email };
  const handle = asString(body.handle);
  if (handle !== undefined) record.handle = handle;
  const country = asString(body.country);
  if (country !== undefined) record.country = country;
  const archive = asStringArray(body.archive);
  if (archive !== undefined) record.archive = archive;
  const brollSources = asStringArray(body.broll_sources);
  if (brollSources !== undefined) record.broll_sources = brollSources;
  const editTime = asString(body.edit_time);
  if (editTime !== undefined) record.edit_time = editTime;
  if (typeof body.has_posted === "boolean") {
    record.has_posted = body.has_posted;
  }
  const paidFor = asStringArray(body.paid_for);
  if (paidFor !== undefined) record.paid_for = paidFor;
  const freeEditOptin = typeof body.free_edit_optin === "boolean" ? body.free_edit_optin : undefined;
  if (freeEditOptin !== undefined) record.free_edit_optin = freeEditOptin;
  const annoyance = asString(body.annoyance);
  if (annoyance !== undefined) record.annoyance = annoyance;
  const source = asString(body.source);
  if (source !== undefined) record.source = source;
  const submittedAt = asString(body.submitted_at);
  if (submittedAt !== undefined) record.submitted_at = submittedAt;
  if (stepReached !== undefined) record.step_reached = stepReached;

  try {
    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("waitlist")
      .upsert(record, { onConflict: "email" });

    if (error) {
      console.error("[waitlist] supabase upsert failed:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    // Step 3 (Apply) is the only point where we have both has_posted (step 2)
    // and free_edit_optin (step 3), which the confirmation email branches on.
    // confirmation_sent_at guards against sending it twice for the same email.
    if (stepReached === 3) {
      const { data: row } = await supabase
        .from("waitlist")
        .select("has_posted, confirmation_sent_at")
        .eq("email", email)
        .maybeSingle();

      if (row && !row.confirmation_sent_at) {
        try {
          const resend = getResend();
          const from = process.env.RESEND_FROM_EMAIL;
          const replyTo = process.env.RESEND_REPLY_TO_EMAIL;
          if (!from) {
            throw new Error("Missing RESEND_FROM_EMAIL environment variable.");
          }
          if (!replyTo) {
            throw new Error("Missing RESEND_REPLY_TO_EMAIL environment variable.");
          }

          const hasPosted = row.has_posted !== false;
          const { subject, html } = confirmationEmail(hasPosted, freeEditOptin ?? false);

          await resend.emails.send({ from, to: email, replyTo, subject, html });

          await supabase
            .from("waitlist")
            .update({ confirmation_sent_at: new Date().toISOString() })
            .eq("email", email);
        } catch (err) {
          // The signup itself already succeeded (it's in Supabase); a failed
          // confirmation email shouldn't fail the request or block the user.
          console.error("[waitlist] resend send failed:", err);
        }
      }
    }
  } catch (err) {
    console.error("[waitlist] supabase client error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}
