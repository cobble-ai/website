import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Cobble",
  description: "What the Cobble waitlist stores, and what we email you about.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-8">
      <Link
        href="/"
        className="font-display text-[1.35rem] leading-none font-extrabold tracking-[-0.04em] text-maroon lowercase"
      >
        cobble
      </Link>
      <h1 className="mt-12 font-display text-4xl leading-none font-extrabold tracking-[-0.03em]">
        Privacy
      </h1>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-ink">
        <p>Cobble is not launched yet. This covers the waitlist on this site.</p>
        <p>
          If you join, we store the email you submit. If you continue through
          the form, we also store the handle, country, and answers you give. We
          use that to email you about Cobble, and to decide who to let in
          first.
        </p>
        <p>We don&apos;t sell the list. We don&apos;t email you about anything else.</p>
        <p>To come off it, reply to any email from us and say so.</p>
      </div>
    </main>
  );
}
