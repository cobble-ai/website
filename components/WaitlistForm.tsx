"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { COUNTRIES } from "@/lib/countries";

type Step = 1 | 2 | 3;
type SaveStatus = "idle" | "saving" | "error";

interface FormState {
  email: string;
  handle: string;
  country: string;
  archive: string[];
  brollSources: string[];
  editTime: string;
  paidFor: string[];
  freeEditOptin: boolean;
  annoyance: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  "min-h-11 w-full rounded-full border border-cream/25 bg-cream/5 px-5 py-3 text-cream outline-none transition-colors duration-150 focus:border-cream/60 disabled:opacity-60";

const CTA_CLASS =
  "min-h-11 rounded-full bg-gradient-to-r from-ember-from to-ember-to px-6 py-3 font-medium text-ink transition-opacity duration-150 hover:opacity-90 disabled:opacity-60";

const ARCHIVE_OPTIONS = [
  "The full raw takes",
  "Outtakes and second takes you didn't use",
  "Other footage you shot but didn't end up using",
  "Raw files from videos older than a few months",
  "Just the exported video",
];
const ARCHIVE_EXCLUSIVE = "Just the exported video";

const BROLL_OPTIONS = [
  "I don't really use b-roll",
  "Free stock (Pexels, Pixabay)",
  "Paid stock",
  "Screen recordings and screenshots",
  "Stuff I filmed myself",
  "Images and clips I find online",
];
const BROLL_EXCLUSIVE = "I don't really use b-roll";

const EDIT_TIME_OPTIONS = [
  "Under 30 minutes",
  "30–60 minutes",
  "1–2 hours",
  "2–4 hours",
  "4+ hours",
  "I haven't posted a video yet",
];
const NOT_POSTED_OPTION = "I haven't posted a video yet";

const PAID_FOR_OPTIONS = [
  "Nothing yet",
  "CapCut Pro",
  "Submagic",
  "Opus Clip",
  "Descript",
  "Adobe (Premiere / Rush)",
  "A human editor",
  "Something else",
];
const PAID_FOR_EXCLUSIVE = "Nothing yet";

function track(event: string, data?: Record<string, unknown>) {
  console.log("[analytics]", event, data ?? {});
}

function toggleExclusive(current: string[], option: string, exclusive: string): string[] {
  if (current.includes(option)) {
    return current.filter((item) => item !== option);
  }
  if (option === exclusive) {
    return [exclusive];
  }
  return [...current.filter((item) => item !== exclusive), option];
}

function toggleSingle(current: string, option: string): string {
  return current === option ? "" : option;
}

function stripHandle(raw: string): string {
  const trimmed = raw.trim();
  return trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
}

async function postStep(
  fields: Record<string, unknown>,
  source: string,
  step: Step,
): Promise<void> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...fields,
      source,
      submitted_at: new Date().toISOString(),
      step_reached: step,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }
}

function OptionButton({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`min-h-11 w-full rounded-2xl border px-4 py-3 text-left text-sm leading-snug transition-colors duration-150 ${
        selected
          ? "border-transparent bg-ember-from text-ink"
          : "border-cream/20 bg-cream/5 text-cream hover:border-cream/40"
      }`}
    >
      {label}
    </button>
  );
}

// Collapses/expands to its content's natural height via the CSS
// grid-rows trick, so it animates smoothly without measuring anything in JS.
function ExpandPanel({
  expanded,
  children,
}: {
  expanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-700 ease-in-out"
      style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

export default function WaitlistForm() {
  const [step, setStep] = useState<Step>(1);
  const [expanded, setExpanded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  // Doesn't affect rendering, so it lives in a ref rather than state.
  const sourceRef = useRef("direct");

  const [form, setForm] = useState<FormState>({
    email: "",
    handle: "",
    country: "",
    archive: [],
    brollSources: [],
    editTime: "",
    paidFor: [],
    freeEditOptin: false,
    annoyance: "",
  });

  const emailId = useId();
  const handleId = useId();
  const countryId = useId();
  const honeypotId = useId();
  const annoyanceId = useId();
  const errorId = useId();

  useEffect(() => {
    track("page_view");
    const src = new URLSearchParams(window.location.search).get("src");
    if (src) sourceRef.current = src;
  }, []);

  const expand = () => {
    if (expanded) return;
    setExpanded(true);
  };

  const handleStep1Submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!expanded) {
      expand();
      return;
    }

    const honeypot = (
      event.currentTarget.elements.namedItem("company") as HTMLInputElement | null
    )?.value;
    if (honeypot) {
      // Silently drop likely bot submissions: no network call, no real progress.
      setSubmitted(true);
      return;
    }

    const email = form.email.trim();
    if (!EMAIL_PATTERN.test(email)) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    const country = form.country.trim();
    if (!country) {
      setStatus("error");
      setErrorMessage("Select your country.");
      return;
    }

    const handle = stripHandle(form.handle);

    setStatus("saving");
    setErrorMessage("");

    try {
      await postStep({ email, handle, country }, sourceRef.current, 1);
      setForm((prev) => ({ ...prev, email, handle, country }));
      track("step_1_complete", { step: 1 });
      setStatus("idle");
      setStep(2);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const handleStep2Continue = async () => {
    setStatus("saving");

    try {
      await postStep(
        {
          email: form.email,
          archive: form.archive,
          broll_sources: form.brollSources,
          edit_time: form.editTime,
          has_posted: form.editTime !== NOT_POSTED_OPTION,
        },
        sourceRef.current,
        2,
      );
    } catch (err) {
      // Step 2 is skippable and low-friction by design: don't trap someone
      // who already gave us an email behind a network error on optional
      // enrichment data. Log it and move on.
      console.error("[waitlist] step 2 save failed:", err);
    }

    track("step_2_complete", { step: 2 });
    setStatus("idle");
    setStep(3);
  };

  const handleApply = async () => {
    setStatus("saving");
    setErrorMessage("");

    try {
      await postStep(
        {
          email: form.email,
          paid_for: form.paidFor,
          free_edit_optin: form.freeEditOptin,
          annoyance: form.annoyance.trim(),
        },
        sourceRef.current,
        3,
      );
      track("form_submit", { step: 3 });
      setStatus("idle");
      setSubmitted(true);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="mx-auto flex w-full max-w-md flex-col gap-1 rounded-3xl border border-cream/20 bg-cream/5 px-6 py-5 text-center"
      >
        <p className="font-medium text-cream">You&apos;re on the list.</p>
        <p className="text-sm text-cream/60">
          One thing that&apos;ll move you up it: reply to the confirmation
          email with a link to the last video you posted.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 text-left">
      {(expanded || step > 1) && (
        <p className="text-xs uppercase tracking-[0.18em] text-cream/50">
          Step {step} of 3
        </p>
      )}

      {step === 1 && (
        <form onSubmit={handleStep1Submit} noValidate className="flex flex-col gap-4">
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={emailId}
              className={expanded ? "text-xs uppercase tracking-[0.14em] text-cream/50" : "sr-only"}
            >
              Email <span aria-hidden className="text-ember-to">*</span>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                required
                placeholder="you@domain.com"
                value={form.email}
                onChange={(event) => {
                  expand();
                  setForm((prev) => ({ ...prev, email: event.target.value }));
                }}
                onFocus={expand}
                onClick={expand}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? errorId : undefined}
                disabled={status === "saving"}
                className={`${INPUT_CLASS} placeholder:text-cream/40 flex-1`}
              />
              {!expanded && (
                <button
                  type="button"
                  onClick={expand}
                  className={`${CTA_CLASS} shrink-0 sm:w-auto`}
                >
                  Join the waitlist
                </button>
              )}
            </div>
          </div>

          <ExpandPanel expanded={expanded}>
            <div className="flex flex-col gap-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={handleId}
                  className="text-xs uppercase tracking-[0.14em] text-cream/50"
                >
                  Instagram or TikTok handle
                </label>
                <input
                  id={handleId}
                  name="handle"
                  type="text"
                  autoComplete="off"
                  enterKeyHint="next"
                  value={form.handle}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, handle: event.target.value }))
                  }
                  disabled={status === "saving"}
                  className={INPUT_CLASS}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={countryId}
                  className="text-xs uppercase tracking-[0.14em] text-cream/50"
                >
                  Country <span aria-hidden className="text-ember-to">*</span>
                </label>
                <select
                  id={countryId}
                  name="country"
                  required
                  value={form.country}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, country: event.target.value }))
                  }
                  disabled={status === "saving"}
                  className={INPUT_CLASS}
                >
                  <option value="" disabled hidden>
                    Select country
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country} className="text-ink">
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <p
                id={errorId}
                aria-live="polite"
                className="min-h-[1.25rem] px-2 text-sm text-ember-to"
              >
                {status === "error" ? errorMessage : ""}
              </p>

              <button
                type="submit"
                disabled={status === "saving"}
                className={`${CTA_CLASS} w-full`}
              >
                {status === "saving" ? "Saving…" : "Next"}
              </button>
            </div>
          </ExpandPanel>
        </form>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm text-cream">
              Think about the last video you posted. Which of these could you
              still find on a drive or in your camera roll?
            </legend>
            {ARCHIVE_OPTIONS.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={form.archive.includes(option)}
                onToggle={() =>
                  setForm((prev) => ({
                    ...prev,
                    archive: toggleExclusive(prev.archive, option, ARCHIVE_EXCLUSIVE),
                  }))
                }
              />
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm text-cream">
              Where do your b-roll clips come from right now?
            </legend>
            {BROLL_OPTIONS.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={form.brollSources.includes(option)}
                onToggle={() =>
                  setForm((prev) => ({
                    ...prev,
                    brollSources: toggleExclusive(prev.brollSources, option, BROLL_EXCLUSIVE),
                  }))
                }
              />
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm text-cream">
              How long did your last video take to edit, start to finish?
            </legend>
            {EDIT_TIME_OPTIONS.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={form.editTime === option}
                onToggle={() =>
                  setForm((prev) => ({
                    ...prev,
                    editTime: toggleSingle(prev.editTime, option),
                  }))
                }
              />
            ))}
          </fieldset>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-11 px-2 text-sm text-cream/60 transition-colors duration-150 hover:text-cream"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleStep2Continue}
              disabled={status === "saving"}
              className={`${CTA_CLASS} flex-1`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm text-cream">
              What have you actually paid for to make editing easier?
            </legend>
            {PAID_FOR_OPTIONS.map((option) => (
              <OptionButton
                key={option}
                label={option}
                selected={form.paidFor.includes(option)}
                onToggle={() =>
                  setForm((prev) => ({
                    ...prev,
                    paidFor: toggleExclusive(prev.paidFor, option, PAID_FOR_EXCLUSIVE),
                  }))
                }
              />
            ))}
          </fieldset>

          <label className="flex min-h-11 items-center gap-3 text-sm text-cream">
            <input
              type="checkbox"
              checked={form.freeEditOptin}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, freeEditOptin: event.target.checked }))
              }
              className="h-5 w-5 shrink-0 rounded accent-ember-from"
            />
            I&apos;d like to be amongst the first to receive early access
            when it&apos;s ready
          </label>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={annoyanceId} className="text-sm text-cream">
              What was the single most annoying thing about editing your last
              video?{" "}
              <span className="text-cream/50">(optional)</span>
            </label>
            <textarea
              id={annoyanceId}
              rows={3}
              value={form.annoyance}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, annoyance: event.target.value }))
              }
              className="w-full rounded-2xl border border-cream/25 bg-cream/5 px-4 py-3 text-cream outline-none transition-colors duration-150 focus:border-cream/60"
            />
          </div>

          <p
            aria-live="polite"
            className="min-h-[1.25rem] text-sm text-ember-to"
          >
            {status === "error" ? errorMessage : ""}
          </p>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={status === "saving"}
              className="min-h-11 px-2 text-sm text-cream/60 transition-colors duration-150 hover:text-cream disabled:opacity-60"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={status === "saving"}
              className={`${CTA_CLASS} flex-1`}
            >
              {status === "saving" ? "Saving…" : "Apply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
