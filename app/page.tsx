import Features from "./_components/Features";
import Founders from "./_components/Founders";
import FAQ from "./_components/FAQ";
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

        <div id="waitlist" style={{ ["--i" as string]: 5 } as React.CSSProperties} className="rv relative w-full max-w-[640px] max-sm:max-w-full scroll-mt-8">
          {/* Green arrow pointing down at the "Join cobble now" button */}
          <svg
            aria-hidden="true"
            width="46"
            height="62"
            viewBox="0 0 46 62"
            fill="none"
            className="pointer-events-none absolute -top-14 right-[18%] max-sm:right-[12%] max-sm:-top-12 rotate-[10deg]"
          >
            <path
              d="M22 2 C 24 22, 18 36, 22 52"
              stroke="#22a04b"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M11 42 L22 56 L33 42"
              stroke="#22a04b"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <WaitlistForm />
        </div>

        <p style={{ ["--i" as string]: 6 } as React.CSSProperties} className="rv mt-4 text-center text-[0.9rem] leading-normal text-[#f6d5bd]">
          Don't worry, I won't spam your iPhone.{" "}
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
          <div aria-hidden className="why-glow" />
          <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-14">
            <h2 className="font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
              Most solo creators <span className="text-lifted whitespace-nowrap">waste hours</span>{" "}
              editing reels.
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Cobble learns how you cut, pace and caption, then assembles your
                next edit the way you would. The boring parts take minutes, not
                hours.
              </p>
              <p>
                And because it edits like you, you skip the AI slop: no generic
                cuts, no template look, just reels that still feel like yours.
              </p>
            </div>
          </div>
        </section>

        <Features />
        <Founders />
        <FAQ />

        <section
          id="get-early-access"
          className="rv flex w-full max-w-[960px] scroll-mt-8 flex-col items-center border-t border-line pt-[clamp(88px,13vw,160px)] pb-[clamp(96px,13vw,160px)] text-center"
        >
          <h2 className="font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
            Get early access.
          </h2>
          <p className="rv mt-4 max-w-md text-lg text-muted">
            Join the waitlist and we&apos;ll email you when Cobble is ready.
          </p>
          <div className="mt-8 w-full max-w-md">
            <WaitlistForm />
          </div>
        </section>
      </main>

      <footer className="rv relative z-10 border-t border-line">
        <div className="mx-auto flex w-full max-w-[960px] flex-wrap justify-between gap-3 px-5 py-6 text-sm text-muted">
          <span>Cobble</span>
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-ink"
          >
            Privacy policy
          </Link>
          <span>Built in public by Sid and Peter</span>
        </div>
      </footer>
    </div>
  );
}
