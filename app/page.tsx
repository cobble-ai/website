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
            <p className="mt-6 max-w-[34rem] text-[clamp(1.08rem,1.6vw,1.25rem)] leading-relaxed text-muted">
              Cobble learns how you cut, pace and caption, then assembles your
              next edit the way you would. The boring parts take minutes, not
              hours.
            </p>
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
