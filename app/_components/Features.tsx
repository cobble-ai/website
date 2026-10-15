import Image from "next/image";

// Heights (%) for the waveform. The 8s in the middle are the dead air.
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

function Card({
  title,
  text,
  className = "",
  dark = false,
  index = 0,
  children,
}: {
  title: string;
  text: string;
  className?: string;
  dark?: boolean;
  index?: number;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`rv fc flex min-w-0 flex-col gap-[18px] rounded-[26px] border border-line bg-[#fdeee2] p-5 ${className}`}
      style={{ ["--i" as string]: index, ["--rr" as string]: index % 2 ? "2deg" : "-2deg" } as React.CSSProperties}
    >
      {/* Illustrations, not real product screens. */}
      <div
        aria-hidden
        className={`relative flex h-[140px] flex-col justify-center gap-2.5 overflow-hidden rounded-2xl p-4 ${
          dark ? "bg-[#1d1d1d]" : "bg-card"
        }`}
      >
        {children}
      </div>
      <div>
        <h3 className="font-display text-[1.35rem] leading-[1.1] font-extrabold tracking-[-0.03em]">
          {title}
        </h3>
        <p className="rv mt-1.5 text-base text-muted">{text}</p>
      </div>
    </article>
  );
}

function Photo({ src }: { src: string }) {
  return (
    <div className="absolute inset-0">
      <Image src={src} alt="" fill sizes="(min-width: 1024px) 300px, 100vw" className="object-cover" />
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="rv w-full max-w-[960px] scroll-mt-8 pt-[clamp(120px,15vw,200px)] pb-[clamp(32px,4vw,56px)]">
      <h2 className="mb-7 font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
        What Cobble does.
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          className="sm:col-span-2"
          dark
          title="Cobble Learns Your Style" index={0}
          text="Your pacing, your captions, your cuts. Every edit starts from how you work."
        >
          <Meter label="pacing" value={78} />
          <Meter label="captions" value={92} />
          <Meter label="cuts" value={64} />
        </Card>

        <Card title="Cobble Cuts Dead Air" index={1} text="Pauses and filler are gone in one pass.">
          <Photo src="/hero/IMG_1397.jpg" />
        </Card>

        <Card title="Cobble Selects Your Best Takes" index={2} text="It picks the strongest take of each line, so you skip the scrubbing.">
          <Photo src="/hero/takes-best.jpg" />
        </Card>

        <Card title="Cobble Adds Your B-roll" index={3} text="Clips you already shot go in right where they fit.">
          <div className="flex justify-center gap-1.5">
            {["/hero/broll-1.jpg", "/hero/broll-2.jpg", "/hero/broll-3.jpg"].map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={60}
                height={60}
                className="h-[60px] w-[60px] rounded-[10px] object-cover"
              />
            ))}
          </div>
          <div className="flex h-7 items-center rounded-[7px] bg-ink px-2.5 font-mono text-[11px] text-[#bdb8ae]">
            your a-roll
          </div>
        </Card>

        <Card title="Cobble Helps You Win" index={4} text="Less time editing means more time posting and finding what works.">
          <Photo src="/hero/helps-win.jpg" />
        </Card>
      </div>
    </section>
  );
}
