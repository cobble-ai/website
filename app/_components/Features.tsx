import Image from "next/image";

// Heights (%) for the little waveform. The 8s in the middle are the dead air.
const WAVE = [
  52, 82, 66, 72, 77, 59, 85, 44, 89, 28, 90, 8, 8, 8, 8, 8, 8, 8, 53, 87, 38,
  90, 34, 88, 50, 83, 64, 73, 76, 61,
];

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[64px_1fr] items-center gap-3">
      <span className="font-mono text-[11px] text-muted">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-[#e2e0da]">
        <span
          className="block h-full rounded-full bg-amber"
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  );
}

function Take({ label, best }: { label: string; best?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] border bg-white px-2.5 py-1.5 ${
        best ? "border-ink" : "border-line opacity-55"
      }`}
    >
      <span className="font-mono text-[11px] text-muted">{label}</span>
      {best && (
        <span className="ml-auto grid h-[18px] w-[18px] place-items-center rounded-full bg-ink">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5.2 4.2 7.3 8 2.8"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

function Card({
  title,
  text,
  className = "",
  children,
}: {
  title: string;
  text: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`flex min-w-0 flex-col gap-[18px] rounded-[26px] border border-line bg-white p-5 ${className}`}
    >
      {/* Illustrations, not real product screens. */}
      <div
        aria-hidden
        className="flex h-[140px] flex-col justify-center gap-2.5 overflow-hidden rounded-2xl bg-card p-4"
      >
        {children}
      </div>
      <div>
        <h3 className="font-display text-[1.35rem] leading-[1.1] font-extrabold tracking-[-0.03em]">
          {title}
        </h3>
        <p className="mt-1.5 text-base text-muted">{text}</p>
      </div>
    </article>
  );
}

export default function Features() {
  return (
    <section id="features" className="mt-24 w-full max-w-[960px] scroll-mt-8">
      <h2 className="font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
        What Cobble does.
      </h2>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className="sm:col-span-2"
          title="Cobble Learns Your Style"
          text="Your pacing, your captions, your cuts. Every edit starts from how you work."
        >
          <Meter label="pacing" value={78} />
          <Meter label="captions" value={92} />
          <Meter label="cuts" value={64} />
        </Card>

        <Card
          title="Cobble Cuts Dead Air"
          text="Pauses and filler are gone in one pass."
        >
          <div className="flex h-16 items-center gap-[3px]">
            {WAVE.map((height, index) => (
              <span
                key={index}
                className={`flex-1 rounded-[2px] ${
                  height === 8 ? "bg-amber/50" : "bg-ink/80"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-muted">pause, cut</span>
        </Card>

        <Card
          title="Cobble Selects Your Best Takes"
          text="It picks the strongest take of each line, so you skip the scrubbing."
        >
          <Take label="take 1" />
          <Take label="take 2" best />
          <Take label="take 3" />
        </Card>

        <Card
          title="Cobble Adds Your B-roll"
          text="Clips you already shot go in right where they fit."
        >
          <div className="flex gap-1.5 pl-[34%]">
            <Image
              src="/hero/clip-2.jpg"
              alt=""
              width={58}
              height={36}
              className="h-9 w-[58px] rounded-[7px] object-cover"
            />
            <Image
              src="/hero/clip-5.jpg"
              alt=""
              width={58}
              height={36}
              className="h-9 w-[58px] rounded-[7px] object-cover"
            />
          </div>
          <div className="flex h-7 items-center rounded-[7px] bg-ink px-2.5 font-mono text-[11px] text-[#bdb8ae]">
            your a-roll
          </div>
        </Card>

        <Card
          title="Cobble Helps You Win"
          text="Less time editing means more time posting and finding what works."
        >
          <div className="flex gap-2">
            {[1, 1, 1, 0, 1, 1, 0].map((on, index) => (
              <span
                key={index}
                className={`h-[22px] w-[22px] rounded-full ${
                  on ? "bg-amber" : "bg-[#e2e0da]"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-muted">
            post more often
          </span>
        </Card>
      </div>
    </section>
  );
}
