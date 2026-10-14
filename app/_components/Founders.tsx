import Image from "next/image";

const HANDLES = [
  { label: "@peter__ishere", href: "https://www.instagram.com/peter__ishere/" },
  { label: "@buildwsid", href: "https://www.instagram.com/buildwsid/" },
  { label: "@_trycobble", href: "https://www.instagram.com/_trycobble/" },
];

export default function Founders() {
  return (
    <section
      id="founders"
      className="mt-24 w-full max-w-[960px] scroll-mt-8 border-t border-line pt-16"
    >
      <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:gap-14">
        <div>
          <h2 className="font-display text-[clamp(2rem,5.2vw,3.5rem)] leading-[0.98] font-extrabold tracking-[-0.035em]">
            About the founders
          </h2>
          <div
            role="img"
            aria-label="Photos of Sid and Peter"
            className="mt-7 flex"
          >
            <Image
              src="/hero/founder-1.jpg"
              alt=""
              width={116}
              height={116}
              className="h-[116px] w-[116px] rounded-full border-4 border-white object-cover shadow-[0_6px_18px_-8px_rgba(20,20,20,0.35)]"
            />
            <Image
              src="/hero/founder-2.jpg"
              alt=""
              width={116}
              height={116}
              className="-ml-5 h-[116px] w-[116px] rounded-full border-4 border-white object-cover shadow-[0_6px_18px_-8px_rgba(20,20,20,0.35)]"
            />
          </div>
        </div>

        <div className="space-y-4 text-lg leading-relaxed text-muted">
          <p>
            We&apos;re Sid and Peter, two 15 year old creators who struggled
            really badly with editing when it came to making content.
          </p>
          <p>
            Sometimes we spent 6 hours editing a video, just for it to end up
            not performing.
          </p>
          <p>
            That&apos;s why we decided to fix this problem, so{" "}
            <strong className="font-extrabold text-ink">no</strong> creator has
            to face it again. Follow our journey on:
          </p>
          <p className="flex flex-wrap gap-2.5 pt-1">
            {HANDLES.map((handle) => (
              <a
                key={handle.href}
                href={handle.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-[1.5px] border-ink px-[15px] py-[9px] text-[0.96rem] font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
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
