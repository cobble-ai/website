import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getResend } from "@/lib/resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type WaitlistBody = {
  email?: unknown;
  company?: unknown;
  handle?: unknown;
  country?: unknown;
  archive?: unknown;
  broll_sources?: unknown;
  edit_time?: unknown;
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

function confirmationEmailHtml() {
  return `
    <div style="background:#4C1620;padding:40px 24px;font-family:Georgia,'Times New Roman',serif;">
      <div style="max-width:480px;margin:0 auto;text-align:center;color:#EAE0CC;">
        <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.6;margin:0 0 24px;">
          Cobble
        </p>
        <h1 style="font-size:28px;font-weight:400;line-height:1.2;margin:0 0 16px;">
          You&rsquo;re on the list.
        </h1>
        <p style="font-size:15px;line-height:1.6;opacity:0.75;margin:0;font-family:Arial,Helvetica,sans-serif;">
          One thing that&rsquo;ll move you up it: reply to this email with a
          link to the last video you posted.
        </p>
      </div>
    </div>
  `;
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
  const paidFor = asStringArray(body.paid_for);
  if (paidFor !== undefined) record.paid_for = paidFor;
  if (typeof body.free_edit_optin === "boolean") {
    record.free_edit_optin = body.free_edit_optin;
  }
  const annoyance = asString(body.annoyance);
  if (annoyance !== undefined) record.annoyance = annoyance;
  const source = asString(body.source);
  if (source !== undefined) record.source = source;
  const submittedAt = asString(body.submitted_at);
  if (submittedAt !== undefined) record.submitted_at = submittedAt;
  if (stepReached !== undefined) record.step_reached = stepReached;

  let alreadyExisted = false;

  try {
    const supabase = getSupabaseAdmin();

    const { data: existing } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    alreadyExisted = Boolean(existing);

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
  } catch (err) {
    console.error("[waitlist] supabase client error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  // Step 1 is the first contact for a genuinely new email, so it's the one
  // point where we send the confirmation email, and only once ever per email.
  if (stepReached === 1 && !alreadyExisted) {
    try {
      const resend = getResend();
      const from = process.env.RESEND_FROM_EMAIL;
      if (!from) {
        throw new Error("Missing RESEND_FROM_EMAIL environment variable.");
      }

      await resend.emails.send({
        from,
        to: email,
        subject: "You're on the Cobble waitlist",
        html: confirmationEmailHtml(),
      });
    } catch (err) {
      // The signup itself already succeeded (it's in Supabase); a failed
      // confirmation email shouldn't fail the request or block the user.
      console.error("[waitlist] resend send failed:", err);
    }
  }

  return NextResponse.json({ status: "ok" });
}
