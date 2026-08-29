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

      <div className="relative z-10 flex flex-1 flex-col px-6 pt-10 pb-14 sm:px-10 sm:pt-14 md:px-16">
        <p className="font-display text-xl leading-none tracking-[-0.02em] lowercase">
          cobble
        </p>

        <div className="mt-1 h-[2px] w-16 bg-ember-from" />

        <div className="flex flex-1 flex-col justify-center">
          <div className="flex w-full max-w-2xl flex-col">
            <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.01em] sm:text-6xl md:text-7xl">
              Edit videos with{" "}
              <span className="text-ember-from">natural language.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/70 sm:text-lg">
              Editing takes up most of your time making videos. Conventional
              editors are too slow, AI editors are too clunky. Cobble is here
              to fix that.
            </p>

            <div className="mt-8 w-full max-w-md">
              <WaitlistForm />
            </div>

            <ul className="mt-8 flex flex-col gap-2 text-sm text-cream/50">
              {reassurances.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-6 text-xs text-cream/40 sm:px-10 md:px-16">
        No spam. One email when your seat opens.
      </footer>
    </div>
  );
}
