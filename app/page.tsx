import CobbleField from "@/components/CobbleField";
import WaitlistForm from "@/components/WaitlistForm";

const reassurances = [
  "Mostly done before you touch a timeline",
  "Built from your clips, not a stock catalog",
  "Fix any cut in seconds. You stay in control",
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-1 flex-col">
      <CobbleField />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="flex w-full max-w-2xl flex-col items-center text-center">
          <h1 className="font-display text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            Edit videos with{" "}
            <span className="bg-gradient-to-r from-ember-from to-ember-to bg-clip-text text-transparent">
              natural language.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            Editing takes up most of your time making videos. Conventional
            editors are too slow, AI editors are too clunky. Cobble is here to
            fix that.
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
