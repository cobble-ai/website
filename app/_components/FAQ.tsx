// FAQ as native <details> accordions: no JS needed, keyboard and screen-reader
// friendly. Rows are full-width hairline dividers with a plus that turns into
// a cross when open.
const QUESTIONS = [
  {
    q: "What is Cobble?",
    a: "Cobble is an AI editor that edits your videos and saves your time the smart way.",
  },
  {
    q: "How does it work?",
    a: "Cobble learns your style. You give it clips and it edits as per your prompt. You get full control over it.",
  },
  {
    q: "Is it going to replace me?",
    a: "No. Cobble is made to maximize creativity, not replace it.",
  },
  {
    q: "Which devices does it work on?",
    a: "So far, v1 is working on iPhones, and Mac is coming soon!",
  },
  {
    q: "Does it cost anything?",
    a: "It's free during early access. Join the waitlist and we'll tell you about pricing before anything changes.",
  },
];

const STEPS = ["Add your clips", "Write a prompt", "Get your edit"];

function Plus() {
  return (
    <span
      aria-hidden
      className="grid h-[22px] w-[22px] shrink-0 place-items-center text-ink transition-[transform,color] duration-300 group-open:rotate-45 group-open:text-amber group-hover:text-amber"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.5v13M1.5 8h13"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

function StepVisual() {
  return (
    <div aria-hidden className="flex flex-wrap items-center gap-2.5 pt-1 pb-7 pl-1">
      {STEPS.map((label, index) => (
        <span key={label} className="contents">
          <span className="flex items-center gap-2.5 rounded-full border-2 border-[#2a0d11] bg-card py-2 pr-4 pl-2 text-[0.95rem] font-bold text-[#2a0d11] shadow-[0_3px_0_0_#2a0d11]">
            <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-[#2a0d11] bg-bone text-sm">
              {index + 1}
            </span>
            {label}
          </span>
          {index < STEPS.length - 1 && (
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="shrink-0 text-[#2a0d11]">
              <path
                d="M1 7h18M14 1l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

export default function FAQ() {
  return (
    <section
      id="faq"
      className="w-full max-w-[960px] scroll-mt-8 border-t border-line pt-[clamp(88px,12vw,144px)] pb-[clamp(40px,5vw,72px)]"
    >
      <div className="text-center">
        <p className="rv mb-3.5 text-base font-medium text-muted">FAQs</p>
        <h2 className="font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
          Questions, answered.
        </h2>
      </div>

      <div className="mx-auto mt-14 max-w-[720px] border-b border-line">
        {QUESTIONS.map((item) => (
          <details key={item.q} className="rv group border-t border-line" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-1 py-6 font-display text-[1.12rem] leading-[1.3] font-semibold tracking-[-0.015em] text-ink focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus />
            </summary>
            <div className="px-1 pb-7 pr-12">
              <p className="max-w-[38rem] text-[1.06rem] text-muted">{item.a}</p>
            </div>
          </details>
        ))}

        <details className="rv group border-t border-line" style={{ ["--i" as string]: 1 } as React.CSSProperties}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-1 py-6 font-display text-[1.12rem] leading-[1.3] font-semibold tracking-[-0.015em] text-ink focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink [&::-webkit-details-marker]:hidden">
            How does it work, step by step?
            <Plus />
          </summary>
          <div className="px-1 pr-12">
            <p className="max-w-[38rem] pb-4 text-[1.06rem] text-muted">
              Three steps, and you stay in control the whole way.
            </p>
            <StepVisual />
          </div>
        </details>
      </div>
    </section>
  );
}
