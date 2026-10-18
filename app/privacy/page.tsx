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

      <div className="mt-12 space-y-4 text-base leading-relaxed text-ink">
        <h2 className="font-display text-2xl leading-tight font-extrabold tracking-[-0.03em]">Cobble Privacy Policy</h2>
        <p className="text-sm text-muted">Last updated: 2026-10-18</p>
        <p>
          Cobble is a video editor for your phone. This page explains, in plain words, what stays on your phone and
          what leaves it.
        </p>

        <h2 className="pt-4 font-display text-xl leading-tight font-extrabold tracking-[-0.03em]">What stays on your phone</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Your videos.</li>
          <li>Your camera roll.</li>
          <li>Your projects and edits.</li>
        </ul>
        <p>Cobble does not upload your videos or your camera roll. They never leave your phone.</p>

        <h2 className="pt-4 font-display text-xl leading-tight font-extrabold tracking-[-0.03em]">What goes to an AI service</h2>
        <p>To help you edit, Cobble sends a small amount of material to an AI service:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Small frames.</strong> Low-resolution still images taken from your footage, so the AI can see what
            is in it.
          </li>
          <li>
            <strong>Transcripts.</strong> The words spoken in your clips, as text.
          </li>
          <li>
            <strong>Edit requests.</strong> What you ask Cobble to do, such as &quot;cut this down to 30 seconds.&quot;
          </li>
        </ul>
        <p>We send only what is needed to answer your request. The full video file is never sent.</p>

        <h2 className="pt-4 font-display text-xl leading-tight font-extrabold tracking-[-0.03em]">What our server keeps</h2>
        <p>
          Our server keeps only usage counts, such as how many requests you have made. It does not keep your frames,
          transcripts, edit requests, videos or camera roll.
        </p>

        <h2 className="pt-4 font-display text-xl leading-tight font-extrabold tracking-[-0.03em]">Contact</h2>
        <p>
          Questions about privacy? Write to{" "}
          <a href="mailto:peter@cobble.video" className="underline underline-offset-2">
            peter@cobble.video
          </a>
          .
        </p>
      </div>
    </main>
  );
}
