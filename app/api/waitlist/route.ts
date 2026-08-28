import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getResend } from "@/lib/resend";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
          We&rsquo;ll email you the moment your seat opens. No spam before then.
        </p>
      </div>
    </div>
  `;
}

export async function POST(request: Request) {
  let body: { email?: unknown; company?: unknown };

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

  let isNewSignup = true;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("waitlist").insert({ email });

    if (error) {
      // 23505 = unique_violation. Already on the list; treat as idempotent
      // success rather than leaking whether an email is registered.
      if (error.code === "23505") {
        isNewSignup = false;
      } else {
        console.error("[waitlist] supabase insert failed:", error);
        return NextResponse.json(
          { error: "Something went wrong. Please try again." },
          { status: 500 },
        );
      }
    }
  } catch (err) {
    console.error("[waitlist] supabase client error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }

  if (isNewSignup) {
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
