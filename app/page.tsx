import Features from "./_components/Features";
import Founders from "./_components/Founders";
import HeroVisual from "@/components/HeroVisual";
import SmoothAnchors from "./_components/SmoothAnchors";
import WaitlistForm from "@/components/WaitlistForm";
import Link from "next/link";

const linkClass =
  "rounded-sm text-sm text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function Home() {
  return (
    <div className="relative overflow-x-clip bg-paper text-ink">
      <SmoothAnchors />
      <div aria-hidden className="page-glow" />

      <header className="relative z-10 w-full">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:py-5 short:py-3">
          <Link
            href="/"
            className="font-display text-[1.35rem] leading-none font-extrabold tracking-[-0.04em] text-maroon lowercase"
          >
            cobble
          </Link>
          <a
            href="#waitlist"
            className="ml-auto inline-flex h-10 shrink-0 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:order-3"
          >
            Get early access
          </a>
          <nav className="flex w-full flex-wrap items-center gap-x-5 gap-y-2 sm:order-2 sm:ml-2 sm:w-auto sm:flex-1">
            <a href="#features" className={linkClass}>
              Features
            </a>
            <a href="#why" className={linkClass}>
              Why we&apos;re building it
            </a>
            <a href="#founders" className={linkClass}>
              About the founders
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-5 pt-4 pb-24 sm:pt-4 short:pt-0">
        <h1 className="text-center font-display text-[clamp(1.65rem,5.6vw,4.15rem)] leading-[1.02] font-extrabold tracking-[-0.035em] short:text-[min(6vw,9vh)] short:leading-[1]">
          <span className="block whitespace-nowrap">Edit your videos</span>
          <span className="block whitespace-nowrap">in minutes.</span>
        </h1>

        <p className="mt-4 max-w-[36rem] text-center text-base leading-snug text-muted sm:mt-5 sm:text-lg short:mt-2 short:text-base">
          <span className="sm:block">
            Cobble learns your style and edits the way you would.
          </span>{" "}
          <span className="sm:block">No more wasting time on editing.</span>
        </p>

        <div id="waitlist" className="mt-6 w-full max-w-md scroll-mt-8 short:mt-3 short:-mb-4">
          <WaitlistForm />
        </div>

        <p className="mt-3 text-center text-[13px] leading-relaxed text-muted short:mt-1">
          For iPhone. We only email you about Cobble.{" "}
          <Link
            href="/privacy"
            className="text-ink underline decoration-muted/60 underline-offset-2 hover:decoration-ink"
          >
            Privacy
          </Link>
        </p>

        <div className="mt-8 w-full lg:mt-6 short:mt-4">
          <HeroVisual />
        </div>

        <section id="why" className="mt-28 w-full max-w-[960px] scroll-mt-8">
          <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-14">
            <h2 className="font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
              Most solo creators <span className="text-lifted">waste hours</span>{" "}
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
      </main>

      <footer className="relative z-10 border-t border-line">
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
