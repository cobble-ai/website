import Image from "next/image";
import FeatureVideo from "./FeatureVideo";

// Heights (%) for the waveform. The 8s in the middle are the dead air, which
// the animation squeezes out on a loop.
const WAVE = [
  52, 82, 66, 72, 77, 59, 85, 44, 89, 28, 90, 8, 8, 8, 8, 8, 8, 8, 53, 87, 38,
  90, 34, 88, 50, 83, 64, 73, 76, 61,
];

function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[64px_1fr] items-center gap-3">
      <span className="font-mono text-[11px] text-[#cfc6bd]">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-[#3a3a3a]">
        <span className="block h-full rounded-full bg-[#f6d5bd]" style={{ width: `${value}%` }} />
      </span>
    </div>
  );
}

function Waveform() {
  return (
    <div className="flex h-[96px] items-center justify-center">
      {WAVE.map((h, i) => (
        <span
          key={i}
          className={`wave-bar mx-[1.5px] block w-[5px] shrink-0 rounded-full ${h === 8 ? "wave-dead bg-[#a3303f]" : "bg-ink"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

// B-roll: clips drop onto the b-roll track as the playhead reaches each spot
// over your a-roll. Pure CSS loop (see .broll-* in globals.css).
const SLOTS = [
  { left: "4%", src: "/hero/broll-1.jpg", n: 1 },
  { left: "37%", src: "/hero/broll-2.jpg", n: 2 },
  { left: "70%", src: "/hero/broll-3.jpg", n: 3 },
];
const AROLL = [40, 70, 55, 85, 30, 65, 90, 45, 75, 35, 60, 80, 50, 70, 40, 85, 55, 65, 30, 75, 60, 45, 80, 50, 70, 35, 65, 55];

function BrollTimeline() {
  return (
    <div className="relative w-full px-1">
      {/* Ruler */}
      <div className="mb-2.5 flex justify-between font-mono text-[10px] text-[#8a8580]">
        <span>0:00</span>
        <span>0:05</span>
        <span>0:10</span>
        <span>0:15</span>
      </div>
      <div className="relative">
        {/* B-roll track */}
        <div className="relative h-[78px] rounded-[12px] bg-[#262626]">
          {SLOTS.map((s) => (
            <div key={s.n} className="absolute top-[7px] bottom-[7px] w-[26%]" style={{ left: s.left }}>
              <div className="absolute inset-0 rounded-[7px] border-[1.5px] border-dashed border-[#4a4a4a]" />
              <Image
                src={s.src}
                alt=""
                fill
                sizes="96px"
                className={`broll-clip broll-clip-${s.n} rounded-[7px] object-cover shadow-[0_6px_14px_-4px_rgba(0,0,0,0.7)] ring-2 ring-[#f6d5bd]/80`}
              />
            </div>
          ))}
        </div>
        {/* A-roll track */}
        <div className="mt-2 flex h-[48px] items-center gap-[3px] overflow-hidden rounded-[12px] bg-[#2b2224] px-3">
          <span className="mr-1.5 shrink-0 font-mono text-[10px] text-[#bdb8ae]">a-roll</span>
          {[...AROLL, ...AROLL].map((h, i) => (
            <span key={i} className="block w-[3px] shrink-0 rounded-full bg-[#f6d5bd]/80" style={{ height: `${h * 0.32}px` }} />
          ))}
        </div>
        {/* Playhead */}
        <div className="broll-ph pointer-events-none absolute -top-1.5 -bottom-1.5 w-0">
          <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-[3px] bg-[#e0546a]" />
          <span className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#e0546a]" />
        </div>
      </div>
    </div>
  );
}

function Card({
  label,
  title,
  text,
  className = "",
  dark = false,
  index = 0,
  children,
}: {
  label: string;
  title: string;
  text: string;
  className?: string;
  dark?: boolean | string;
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`rv fc flex min-w-0 flex-col gap-[18px] rounded-[26px] border border-line bg-[#fdeee2] p-5 ${className}`}
      style={{ ["--i" as string]: index, ["--rr" as string]: index % 2 ? "2deg" : "-2deg" } as React.CSSProperties}
    >
      <div
        aria-hidden
        className={`relative flex h-[280px] flex-col justify-center gap-2.5 overflow-hidden rounded-2xl p-4 ${
          dark ? "bg-[#1d1d1d]" : "bg-card"
        }`}
        style={typeof dark === "string" ? { background: dark } : undefined}
      >
        {children}
      </div>
      <div>
        <p className="font-mono text-[11px] tracking-wide text-lifted uppercase">{label}</p>
        <h3 className="mt-1.5 font-display text-[1.35rem] leading-[1.1] font-extrabold tracking-[-0.03em]">
          {title}
        </h3>
        <p className="rv mt-1.5 text-base text-muted">{text}</p>
      </div>
    </article>
  );
}

export default function Features() {
  return (
    <section id="features" className="rv w-full max-w-[960px] scroll-mt-8 pt-[clamp(72px,8vw,112px)] pb-[clamp(32px,4vw,56px)]">
      <h2 className="mb-7 font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
        What Cobble does.
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          dark="#18171a"
          className="sm:col-span-2"
          index={0}
          label="Your style"
          title="Edits that look like yours."
          text="Show it reels you’ve made or love. It learns their pacing, cuts and captions, then edits your next one that way."
        >
          <FeatureVideo src="/demos/learns-style.mp4">
            <Meter label="pacing" value={78} />
            <Meter label="captions" value={92} />
            <Meter label="cuts" value={64} />
          </FeatureVideo>
        </Card>

        <Card
          dark="#0f0e11"
          index={1}
          label="Best takes"
          title="Your best take, picked for you."
          text="Said a line five times? It keeps the strongest one, so you skip the scrubbing."
        >
          <FeatureVideo src="/demos/best-takes.mp4">
            <div className="absolute inset-0">
              <Image src="/hero/takes-best.jpg" alt="" fill sizes="(min-width: 1024px) 300px, 100vw" className="object-cover" />
            </div>
          </FeatureVideo>
        </Card>

        <Card
          dark="#191919"
          className="lg:col-span-2"
          index={2}
          label="Dead air"
          title="Pauses gone in one pass."
          text="Type “cut dead air.” It cuts the silences but keeps the dramatic pauses you meant."
        >
          <FeatureVideo src="/demos/dead-air.mp4">
            <Waveform />
          </FeatureVideo>
        </Card>

        <Card
          dark="#191919"
          className="sm:col-span-2 lg:col-span-1"
          index={3}
          label="B-roll"
          title="B-roll right where it fits."
          text="Clips you already shot land on the timeline, right over the line they belong to."
        >
          <BrollTimeline />
        </Card>
      </div>
    </section>
  );
}
