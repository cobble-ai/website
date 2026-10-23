import Features from "./_components/Features";
import Founders from "./_components/Founders";
import FAQ from "./_components/FAQ";
import Compare from "./_components/Compare";
import IntroAnimation from "@/components/IntroAnimation";
import HeroVisual from "@/components/HeroVisual";
import SmoothAnchors from "./_components/SmoothAnchors";
import SiteNav from "./_components/SiteNav";
import Doodles from "./_components/Doodles";
import Reveal from "./_components/Reveal";
import WaitlistForm from "@/components/WaitlistForm";
import Link from "next/link";

const linkClass =
  "rounded-sm text-sm text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-paper text-ink">
      <IntroAnimation />
      <SmoothAnchors />
      <div aria-hidden className="page-glow" />
      <div aria-hidden className="page-glow-bottom" />

      <SiteNav />
      <Doodles />
      <Reveal />


      <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-7 sm:px-5 pt-[clamp(180px,22vw,260px)] pb-24 short:pt-[180px]">
        <h1 className="rvh m-0 mx-auto w-full -translate-x-[2%] text-center font-display text-[clamp(2.3rem,9vw,5.9rem)] max-sm:text-[2.3rem] leading-[0.95] font-extrabold tracking-[-0.04em]">
          <span className="block w-full whitespace-nowrap text-center">
            <span className="hl w" style={{ ["--i" as string]: 0 } as React.CSSProperties}>Edit</span> <span className="hl w" style={{ ["--i" as string]: 1 } as React.CSSProperties}>your</span> <span className="hl w" style={{ ["--i" as string]: 2 } as React.CSSProperties}>videos</span>
          </span>
          <span className="block w-full whitespace-nowrap text-center">
            <span className="hl w" style={{ ["--i" as string]: 3 } as React.CSSProperties}>in</span> <span className="hl w" style={{ ["--i" as string]: 4 } as React.CSSProperties}>minutes.</span>
          </span>
        </h1>

        <p style={{ ["--i" as string]: 4 } as React.CSSProperties} className="rv mx-auto mt-[22px] mb-[30px] max-w-[30rem] text-center text-[clamp(1.08rem,2vw,1.25rem)] max-sm:text-[0.98rem] max-sm:mt-4 max-sm:mb-6 font-medium text-[#f6e8d8] [text-shadow:0_1px_12px_rgba(30,8,12,0.5)]">
          <span className="sm:block">
            I learn your style and edit the way you would.
          </span>
        </p>

        <div id="waitlist" style={{ ["--i" as string]: 5 } as React.CSSProperties} className="rv w-full max-w-[640px] max-sm:max-w-full scroll-mt-8">
          <WaitlistForm />
        </div>

        <p style={{ ["--i" as string]: 6 } as React.CSSProperties} className="rv mt-4 text-center text-[0.9rem] leading-normal text-[#f6d5bd]">
          Free during early access. No spam, ever.{" "}
          <Link
            href="/privacy"
            className="text-[#f6d5bd] underline decoration-[#f6d5bd] underline-offset-2 hover:decoration-[#f6d5bd]/70"
          >
            Privacy
          </Link>
        </p>

        <div className="mt-[180px] max-sm:mt-12 w-full">
          <HeroVisual />
        </div>

        <section id="why" className="rv relative w-full max-w-[960px] scroll-mt-8 pt-[clamp(72px,9vw,112px)] pb-[clamp(16px,2vw,28px)]">
          <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
            <h2 className="font-display text-[clamp(2.2rem,5.6vw,4rem)] leading-[0.98] font-extrabold tracking-[-0.04em]">
              Most solo creators <span className="text-lifted whitespace-nowrap">waste hours</span>
              <br className="max-sm:hidden" /> editing reels.
            </h2>
            {/* Sticker-style answer to the headline: same outline + hard shadow as the CTAs.
                Hover (or tap/focus on phones) shows the time-saving claim. */}
            <div tabIndex={0} className="group relative mt-[clamp(32px,4vw,48px)] rounded-full outline-none">
              <p className="inline-flex -rotate-2 cursor-default items-center gap-3 rounded-full border-2 border-[#2a0d11] bg-amber py-3 pr-7 pl-4 font-display text-[clamp(1.2rem,2.4vw,1.7rem)] leading-none font-extrabold tracking-[-0.03em] text-[#2a0d11] shadow-[0_5px_0_0_#2a0d11] transition-[rotate] duration-300 group-hover:rotate-0 group-focus:rotate-0">
                <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-[#2a0d11] bg-lifted text-bone">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1.5l1.6 4.2 4.4.3-3.4 2.8 1.1 4.3L8 10.7l-3.7 2.4 1.1-4.3L2 6l4.4-.3L8 1.5z" fill="currentColor" />
                  </svg>
                </span>
                Cobble’s here to fix that.
              </p>
              <span
                role="tooltip"
                className="pointer-events-none absolute top-full left-1/2 z-20 mt-5 w-[min(300px,80vw)] -translate-x-1/2 translate-y-2 rounded-2xl bg-[#2a0d11] px-5 py-3.5 text-center text-[0.98rem] leading-snug font-semibold text-bone opacity-0 shadow-[0_14px_30px_-12px_rgba(42,13,17,0.7)] transition-[opacity,translate] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
              >
                <span aria-hidden className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-[#2a0d11]" />
                Cobble handles the boring work, so you can focus on the creative part.
              </span>
            </div>
          </div>
          <Compare />
        </section>

        <Features />
        <Founders />
        <FAQ />

        <section
          id="get-early-access"
          className="rv relative flex w-full max-w-[960px] scroll-mt-8 flex-col items-center pt-[clamp(160px,20vw,300px)] pb-[clamp(72px,9vw,112px)] text-center"
        >
          <h2 className="font-display text-[clamp(2.3rem,6vw,4.2rem)] leading-[0.95] font-extrabold tracking-[-0.04em]">
            <span className="hl">Get early access.</span>
          </h2>
          <p className="rv mt-5 max-w-md text-lg text-[#f6d5bd]">
            Free during early access. We&apos;ll email you when Cobble is ready.
          </p>
          <div className="mt-8 w-full max-w-[560px]">
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="rv relative z-10 border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[960px] flex-wrap justify-between gap-3 px-5 py-6 text-sm text-[#f6d5bd]/80">
          <span>Cobble</span>
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-bone"
          >
            Privacy policy
          </Link>
          <span>Built in public by Sid and Peter</span>
        </div>
      </footer>
    </div>
  );
}
