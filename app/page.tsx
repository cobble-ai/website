import CobbleField from "@/components/CobbleField";
import WaitlistForm from "@/components/WaitlistForm";

const reassurances = [
  "Your footage, not stock everyone else has",
  "Every cut is overridable",
  "Licensed for monetized accounts",
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <CobbleField />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <span className="mb-8 rounded-full border border-cream/20 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-cream/60">
            Private beta · for creators posting 2+ a week
          </span>

          <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            Stop starting from a{" "}
            <span className="bg-gradient-to-r from-ember-from to-ember-to bg-clip-text text-transparent">
              blank timeline.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Cobble hands back a near-finished edit of your raw take — b-roll,
            music, pacing and hook variants already placed. You fix the parts
            it got wrong in about 90 seconds, instead of building the whole
            thing from scratch.
          </p>

          <div className="mt-10 w-full">
            <WaitlistForm />
          </div>

          <ul className="mt-8 flex flex-col items-center gap-2 text-sm text-cream/50 sm:flex-row sm:gap-6">
            {reassurances.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-cream/40"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-8 text-center text-xs text-cream/40">
        No spam. One email when your seat opens.
      </footer>
    </div>
  );
}
