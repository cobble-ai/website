"use client";

import { useId, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submitWaitlist(email: string): Promise<void> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }
}

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputId = useId();
  const errorId = useId();
  const honeypotId = useId();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const honeypot = (
      form.elements.namedItem("company") as HTMLInputElement | null
    )?.value;
    if (honeypot) {
      // Silently drop likely bot submissions without revealing the trap.
      setStatus("success");
      return;
    }

    const trimmed = email.trim();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      await submitWaitlist(trimmed);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="mx-auto flex w-full max-w-md flex-col items-center gap-1 rounded-full border border-cream/20 bg-cream/5 px-6 py-4 text-center"
      >
        <p className="font-medium text-cream">You&apos;re on the list.</p>
        <p className="text-sm text-cream/60">
          We&apos;ll email <span className="text-cream/80">{email}</span> when
          your seat opens.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-md flex-col gap-3"
    >
      <div aria-hidden style={{ width: 0, height: 0, overflow: "hidden" }}>
        <label htmlFor={honeypotId}>Company</label>
        <input
          id={honeypotId}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@domain.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? errorId : undefined}
          disabled={status === "submitting"}
          className="w-full flex-1 rounded-full border border-cream/25 bg-cream/5 px-5 py-3 text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-cream/60 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-6 py-3 font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      <p
        id={errorId}
        aria-live="polite"
        className="min-h-[1.25rem] px-2 text-sm text-ember-to"
      >
        {status === "error" ? errorMessage : ""}
      </p>
    </form>
  );
}
