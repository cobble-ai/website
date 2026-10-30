import Image from "next/image";

const HANDLES = [
  { label: "@peter__ishere", href: "https://www.instagram.com/peter__ishere/" },
  { label: "@buildwsid", href: "https://www.instagram.com/buildwsid/" },
  { label: "@_trycobble", href: "https://www.instagram.com/_trycobble/" },
];

// The arc between the two founders. Photos sit on its ends.
const ARC = "M70 168 Q220 -10 370 168";

function Photo({ src, className }: { src: string; className: string }) {
  return (
    <div className={`absolute h-[clamp(84px,10vw,112px)] w-[clamp(84px,10vw,112px)] -translate-x-1/2 -translate-y-1/2 ${className}`}>
      <span aria-hidden className="founder-ring absolute -inset-2 rounded-full border-2 border-dashed border-[#a3303f]/50" />
      <Image
        src={src}
        alt=""
        width={120}
        height={120}
        className="relative h-full w-full rounded-full border-4 border-white object-cover shadow-[0_10px_24px_-10px_rgba(42,13,17,0.55)]"
      />
    </div>
  );
}

// Two photos 11,000 km apart, joined by a dashed flight path with a dot
// travelling between them. Illustration only.
function Distance() {
  return (
    <div role="img" aria-label="Photos of Sid and Peter, 11,000 kilometers apart" className="relative mx-auto mt-10 aspect-[440/220] w-full max-w-[440px]">
      <svg aria-hidden viewBox="0 0 440 220" className="absolute inset-0 h-full w-full overflow-visible">
        <path d={ARC} fill="none" stroke="#2a0d11" strokeOpacity="0.12" strokeWidth="10" strokeLinecap="round" />
        <path className="founder-dash" d={ARC} fill="none" stroke="#2a0d11" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 12" />
        <g className="founder-dot">
          <circle r="11" fill="#a3303f" opacity="0.25">
            <animateMotion dur="3.6s" repeatCount="indefinite" path={ARC} keyPoints="0;1;1" keyTimes="0;0.85;1" calcMode="linear" />
          </circle>
          <circle r="5.5" fill="#a3303f" stroke="#fdeee2" strokeWidth="2">
            <animateMotion dur="3.6s" repeatCount="indefinite" path={ARC} keyPoints="0;1;1" keyTimes="0;0.85;1" calcMode="linear" />
          </circle>
        </g>
      </svg>

      <Photo src="/hero/founder-1.jpg" className="top-[76%] left-[16%]" />
      <Photo src="/hero/founder-2.jpg" className="top-[76%] left-[84%]" />

      {/* Distance sticker at the top of the arc. */}
      <span className="absolute top-[22%] left-1/2 -translate-x-1/2 rotate-[-4deg] rounded-full border-2 border-[#2a0d11] bg-amber px-4 py-1.5 font-display text-[clamp(0.95rem,1.6vw,1.1rem)] font-extrabold whitespace-nowrap text-[#2a0d11] shadow-[0_4px_0_0_#2a0d11]">
        11,000 km apart
      </span>
    </div>
  );
}

export default function Founders() {
  return (
    <section
      id="founders"
      className="rv relative w-full max-w-[960px] scroll-mt-8 border-t border-line pt-[clamp(88px,12vw,144px)] pb-[clamp(80px,11vw,128px)]"
    >
      {/* Soft drifting glows behind the section. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
        <span className="founder-blob founder-blob-1" />
        <span className="founder-blob founder-blob-2" />
        <span className="founder-blob founder-blob-3" />
      </div>

      <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
        <div>
          <h2 className="font-display text-[clamp(2.2rem,5.6vw,3.9rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            About the <span className="hl">founders</span>
          </h2>
          <Distance />
        </div>

        <div className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            We&apos;re <strong className="font-extrabold text-ink">Sid</strong> and{" "}
            <strong className="font-extrabold text-ink">Peter</strong>. Despite being
            based 11,000 kilometers away from each other, we&apos;re building Cobble
            together and putting our hearts into it.
          </p>
          <p>
            As 15 year olds, we&apos;ve been creating content on different social
            media platforms for a couple of years now, and we&apos;re excited to
            build a solution for creators!
          </p>
          <p>
            Follow us and{" "}
            <a href="#waitlist" className="font-semibold text-ink underline decoration-lifted decoration-2 underline-offset-4 hover:decoration-ink">
              sign up for Cobble
            </a>{" "}
            :)
          </p>
          <p className="rv flex flex-wrap gap-2.5 pt-1">
            {HANDLES.map((handle) => (
              <a
                key={handle.href}
                href={handle.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-ink bg-[#fdeee2]/60 px-[15px] py-[9px] text-[0.96rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                {handle.label}
              </a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
