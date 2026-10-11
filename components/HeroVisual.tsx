"use client";

import { useLayoutEffect, useRef, useState } from "react";

const PROMPT = "cut the pauses, add my b-roll";
const BREAK_AT = "cut the pauses,".length;
const LOOP_MS = 6000;
const CHECK_AT = [500, 1000, 1500];
const TYPE_START = 2000;
const TYPE_END = 3600;
const PLAY_AT = 3600;

const CLIPS: { duration: string; selected: boolean; tone: string }[] = [
  { duration: "0:04", selected: true, tone: "#D5D2CB" },
  { duration: "0:12", selected: false, tone: "#C5C9C3" },
  { duration: "0:07", selected: true, tone: "#DDD6C8" },
  { duration: "0:21", selected: false, tone: "#C9C3B8" },
  { duration: "0:09", selected: true, tone: "#D8D8D2" },
  { duration: "0:15", selected: false, tone: "#C3BDB4" },
];

const SELECTED_INDEXES = CLIPS.flatMap((clip, index) =>
  clip.selected ? [index] : [],
);

function resetVideo(node: HTMLVideoElement) {
  node.pause();
  try {
    node.currentTime = 0;
  } catch {
    /* not seekable yet */
  }
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path
        d="M2 5.2 4.2 7.3 8 2.8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2.5 7h9M8 3.5 11.5 7 8 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 40px arrows. Horizontal on desktop, vertical when stacked.
function Arrow() {
  return (
    <>
      <svg
        width="40"
        height="12"
        viewBox="0 0 40 12"
        fill="none"
        className="hidden shrink-0 text-ink lg:block"
        aria-hidden
      >
        <path
          d="M0 6h38M32 1.5 38 6l-6 4.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        width="12"
        height="40"
        viewBox="0 0 12 40"
        fill="none"
        className="shrink-0 text-ink lg:hidden"
        aria-hidden
      >
        <path
          d="M6 0v38M1.5 32 6 38l4.5-6"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

export default function HeroVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Default state is the finished state, so it is correct on first paint,
  // with JS disabled, and under reduced motion.
  const [shown, setShown] = useState(SELECTED_INDEXES.length);
  const [chars, setChars] = useState(PROMPT.length);
  // A tile only falls back to its [CLIP] label if its image fails to load.
  const [failed, setFailed] = useState<boolean[]>(() =>
    Array(CLIPS.length).fill(false),
  );
  const markFailed = (index: number) =>
    setFailed((current) => {
      if (current[index]) return current;
      const next = current.slice();
      next[index] = true;
      return next;
    });
  const [videoReady, setVideoReady] = useState(false);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let stopped = false;

    const showFinal = () => {
      setShown(SELECTED_INDEXES.length);
      setChars(PROMPT.length);
      const node = videoRef.current;
      if (!node) return;
      node.muted = true;
      node.loop = true;
      void node.play().catch(() => {});
    };

    // Replays the finished state: it holds for a moment on load, then the
    // checks, prompt and reel run again each loop and settle back here.
    const startLoop = () => {
      const node = videoRef.current;
      if (node) {
        node.muted = true;
        node.loop = true;
      }

      // Begin the clock already at the finished state.
      const started = performance.now() - PLAY_AT;
      let phasePlaying = false;

      const frame = (now: number) => {
        if (stopped) return;
        const elapsed = (now - started) % LOOP_MS;
        const nextShown = CHECK_AT.filter((time) => elapsed >= time).length;
        let nextChars = 0;
        if (elapsed >= TYPE_END) nextChars = PROMPT.length;
        else if (elapsed >= TYPE_START) {
          nextChars = Math.min(
            PROMPT.length,
            Math.floor(
              ((elapsed - TYPE_START) / (TYPE_END - TYPE_START)) * PROMPT.length,
            ),
          );
        }

        setShown((current) => (current === nextShown ? current : nextShown));
        setChars((current) => (current === nextChars ? current : nextChars));

        const video = videoRef.current;
        if (video && video.readyState >= 2 && video.error == null) {
          const shouldPlay = elapsed >= PLAY_AT;
          if (shouldPlay && !phasePlaying) {
            try {
              video.currentTime = 0;
            } catch {
              /* not seekable yet */
            }
            void video.play().catch(() => {});
            phasePlaying = true;
          } else if (!shouldPlay && phasePlaying) {
            resetVideo(video);
            phasePlaying = false;
          }
        } else if (elapsed < PLAY_AT) {
          phasePlaying = false;
        }

        raf = window.requestAnimationFrame(frame);
      };

      raf = window.requestAnimationFrame(frame);
    };

    const apply = () => {
      window.cancelAnimationFrame(raf);
      if (media.matches) showFinal();
      else startLoop();
    };

    apply();
    media.addEventListener("change", apply);

    return () => {
      stopped = true;
      window.cancelAnimationFrame(raf);
      media.removeEventListener("change", apply);
    };
  }, []);

  const revealed = new Set(SELECTED_INDEXES.slice(0, shown));
  const typed = PROMPT.slice(0, chars);
  const lineOne = typed.slice(0, BREAK_AT);
  const lineTwo = typed.slice(BREAK_AT + 1);
  const caret = (
    <span className="cobble-caret ml-px inline-block h-[1em] w-[2px] translate-y-[3px] bg-ink" />
  );

  return (
    <div className="w-full" id="hero-visual">
      <p className="sr-only">
        Three clips selected from your camera roll. The ask: {PROMPT}. The
        finished reel plays on an iPhone.
      </p>

      {/*
        One shared height (--h) drives the camera-roll card and the phone, so
        they are always equal and share a centre line with the prompt card.
        Spacing: card padding 16px, prompt padding 20px, bezel 10px; the gap
        either side of each 40px arrow is 8px, smaller than all three.
      */}
      <div
        aria-hidden
        className="hero-row mx-auto flex w-full flex-col items-center gap-2 lg:w-fit lg:flex-row lg:items-center lg:gap-0"
      >
        {/* A. Camera roll */}
        <div className="w-full max-w-[360px] rounded-2xl border border-line bg-card p-4 lg:h-[var(--h)] lg:w-[calc(var(--h)*1.5-13px)] lg:max-w-none lg:shrink-0">
          <div className="grid grid-cols-3 grid-rows-2 gap-1.5 lg:h-full">
            {CLIPS.map((clip, index) => {
              const isOn = revealed.has(index);
              return (
                <div
                  key={clip.duration + index}
                  className="relative aspect-square overflow-hidden rounded-md lg:aspect-auto"
                  style={{ backgroundColor: clip.tone }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- a missing file stays a labeled tile */}
                  <img
                    src={`/hero/clip-${index + 1}.jpg`}
                    alt=""
                    draggable={false}
                    className={`absolute inset-0 h-full w-full object-cover ${
                      failed[index] ? "opacity-0" : "opacity-100"
                    }`}
                    ref={(node) => {
                      // Catches an error that fired before hydration.
                      if (node && node.complete && node.naturalWidth === 0) {
                        markFailed(index);
                      }
                    }}
                    onError={() => markFailed(index)}
                  />
                  {failed[index] && (
                    <span className="pointer-events-none absolute inset-0 grid place-items-center font-mono text-[10px] tracking-wide text-[#3A3A3A]">
                      [CLIP]
                    </span>
                  )}
                  {isOn && (
                    <span className="cobble-check absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink">
                      <CheckIcon />
                    </span>
                  )}
                  <span className="absolute right-1.5 bottom-1.5 rounded-[3px] bg-black/75 px-1.5 py-[3px] font-mono text-[11px] leading-none font-medium text-white tabular-nums">
                    {clip.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center lg:px-2">
          <Arrow />
        </div>

        {/* B. Prompt */}
        <div className="relative w-full max-w-[300px] shrink-0 rounded-2xl border border-[#D6D6D2] bg-card p-[18px] lg:w-[300px]">
          <p className="text-left font-display text-[22px] leading-[1.25] font-semibold tracking-[-0.01em] text-ink">
            <span className="block min-h-[1.25em]">
              {lineOne}
              {chars <= BREAK_AT && caret}
            </span>
            <span className="block min-h-[1.25em]">
              {lineTwo}
              {chars > BREAK_AT && chars < PROMPT.length && caret}
            </span>
          </p>
          <span className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-ink text-white">
            <SendIcon />
          </span>
        </div>

        <div className="flex shrink-0 items-center justify-center lg:px-2">
          <Arrow />
        </div>

        {/* C. Phone */}
        <div className="aspect-[9/16] w-[min(70vw,300px)] shrink-0 rounded-[1.75rem] bg-ink p-2.5 lg:h-[var(--h)] lg:w-auto">
          <div className="relative h-full w-full overflow-hidden rounded-[1.2rem] bg-[#2A2A28]">
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src="/hero/reel.mp4"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoReady(false)}
            />
            {!videoReady && (
              <span className="pointer-events-none absolute inset-x-3 top-[42%] text-center font-mono text-[11px] tracking-wide text-[#C8C8C2]">
                [FINISHED REEL]
              </span>
            )}
            <p className="pointer-events-none absolute inset-x-3 bottom-[14%] text-center">
              <span className="inline-block bg-ink px-2 py-1 font-display text-[1.1rem] font-extrabold leading-none tracking-[-0.03em] text-white">
                no dead air
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
