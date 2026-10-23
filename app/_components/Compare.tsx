// "Why Cobble?" Two cards: other AI editors (faded, crossed out) vs Cobble
// (cartoon outline, hard shadow, like the stickers and CTA). No competitor names.
const ROWS = [
  {
    them: "Edits the same way for everyone",
    us: "Edits in your way",
  },
  {
    them: "Makes you learn its way of working",
    us: "Understands your way of working",
  },
  {
    them: "Built to churn out generic content",
    us: "Built to maximize your creativity",
  },
];

function Cross() {
  return (
    <span aria-hidden className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e2c3ae] text-[#8a6a62]">
      <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <span aria-hidden className="mt-[2px] grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[#2a0d11] bg-bone text-[#2a0d11]">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 8.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function Compare() {
  return (
    <div className="mt-[clamp(80px,10vw,136px)]">
      <h3 className="rv text-center font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
        Why <span className="hl">Cobble?</span>
      </h3>

      <div className="relative mx-auto mt-[clamp(32px,4vw,48px)] grid max-w-[880px] gap-6 md:grid-cols-2 md:items-stretch md:gap-14">
        {/* Other AI editors: faded, tilted back, crossed out. */}
        <div
          className="rv -rotate-2 rounded-[26px] border border-line bg-[#f2d3bf]/70 p-6 md:scale-[0.96] md:p-8"
          style={{ ["--i" as string]: 1 } as React.CSSProperties}
        >
          <p className="flex h-[1.6rem] items-center font-mono text-[12px] tracking-wide text-muted uppercase">Other AI editors</p>
          <ul className="mt-6 space-y-5">
            {ROWS.map((row) => (
              <li key={row.them} className="flex min-h-[2.8rem] gap-3 text-[1.02rem] leading-snug text-muted/80">
                <Cross />
                <span className="line-through decoration-[#b08a80]/60 decoration-1">{row.them}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* vs badge, sits between the cards. */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 z-10 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 rotate-6 place-items-center rounded-full border-2 border-[#2a0d11] bg-lifted font-display text-sm font-extrabold text-bone shadow-[0_3px_0_0_#2a0d11]"
        >
          vs
        </span>

        {/* Cobble: the hero card. */}
        <div
          className="rv rotate-1 rounded-[26px] border-2 border-[#2a0d11] bg-amber p-6 shadow-[0_7px_0_0_#2a0d11] transition-[rotate] duration-300 hover:rotate-0 md:p-8"
          style={{ ["--i" as string]: 2 } as React.CSSProperties}
        >
          <p className="font-display text-[1.6rem] leading-none font-extrabold tracking-[-0.045em] text-[#2a0d11] lowercase">
            cobble
          </p>
          <ul className="mt-6 space-y-5">
            {ROWS.map((row) => (
              <li key={row.us} className="flex min-h-[2.8rem] gap-3 text-[1.08rem] leading-snug font-semibold text-[#2a0d11]">
                <Check />
                <span>{row.us}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
