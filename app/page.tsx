import HeroVisual from "@/components/HeroVisual";
import WaitlistForm from "@/components/WaitlistForm";
import Link from "next/link";

const linkClass =
  "rounded-sm text-sm text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function Home() {
  return (
    <div className="overflow-x-clip bg-paper text-ink">
      <header className="w-full">
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
          <nav className="flex w-full items-center gap-x-5 gap-y-2 sm:order-2 sm:ml-2 sm:w-auto sm:flex-1">
            <a href="#why" className={linkClass}>
              Why we&apos;re building it
            </a>
            <a href="#build-log" className={linkClass}>
              Build log
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center px-5 pt-4 pb-24 sm:pt-4 short:pt-0">
        <h1 className="text-center font-display text-[clamp(1.65rem,5.6vw,4.15rem)] leading-[1.02] font-extrabold tracking-[-0.035em] short:text-[min(6vw,9vh)] short:leading-[1]">
          <span className="block whitespace-nowrap">Edit your reels</span>
          <span className="block whitespace-nowrap">by just asking.</span>
        </h1>

        <p className="mt-4 max-w-[36rem] text-center text-base leading-snug text-muted sm:mt-5 sm:text-lg short:mt-2 short:text-base">
          <span className="sm:block">Import your clips. Say what you want.</span>{" "}
          <span className="sm:block">Fix anything by hand.</span>
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

        <section
          id="why"
          className="mx-auto mt-28 w-full max-w-xl scroll-mt-8 text-center"
        >
          <h2 className="font-display text-3xl leading-none font-extrabold tracking-[-0.03em]">
            Why we&apos;re building it
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Short-form gets edited on an iPhone, usually in CapCut, and the
            timeline takes the hours. Cobble is a native editor for that job.
            You import your own clips, then ask for the cut, the captions, the
            b-roll, or the pace, and you can fix any of it by hand. No stock.
            Nothing generated.
          </p>
        </section>

        <section
          id="build-log"
          className="mx-auto mt-16 w-full max-w-xl scroll-mt-8 text-center"
        >
          <h2 className="font-display text-3xl leading-none font-extrabold tracking-[-0.03em]">
            Build log
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Still pre-launch. Versions go up in public as they&apos;re built, at
            @peter_ishere, @_trycobble, and @buildwsid.
          </p>
        </section>
      </main>
    </div>
  );
}
