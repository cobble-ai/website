"use client";

import { useEffect, useRef, useState } from "react";
import { MARK_PATHS, MARK_VIEWBOX, STONES } from "@/lib/intro-geometry";
import "./IntroAnimation.css";

// Intro overlay: small stones tumble together into the Cobble mark, the
// caption swaps to the wordmark, then the curtain lifts. Timings match the
// landing-page design. Clicking skips it. It is skipped entirely for reduced
// motion and for repeat visits in the same session.
const POP_AT = 2000;
const LEAVE_AT = 2750;
const REVEAL_AT = 2950;
const GONE_AT = 3450;

type Phase = "idle" | "play" | "pop" | "leave" | "gone";

const TILE = "#48171d";
const STONE = "#cbb6a7";

// Per-stone random motion, computed once on mount so it is stable for the run.
function makeStoneMotion() {
  return STONES.map(([x, y, r]) => {
    const a = Math.random() * Math.PI * 2;
    const d = 35 + Math.random() * 40;
    return {
      x,
      y,
      r,
      fx: Math.cos(a) * d,
      fy: Math.sin(a) * d,
      rot: Math.round(-540 + Math.random() * 1080),
      delay: Math.random() * 0.75,
    };
  });
}

export default function IntroAnimation() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [motion, setMotion] = useState<ReturnType<typeof makeStoneMotion> | null>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const cancelAll = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("gone");
      return;
    }
    setMotion(makeStoneMotion());
    setPhase("play");

    later(() => setPhase("pop"), POP_AT);
    later(() => setPhase("leave"), LEAVE_AT);
    later(() => finish(), GONE_AT);
    return cancelAll;
  }, []);

  // Hide the overlay and remember that it has played this session. Only
  // called once the animation is done, so a dev-mode double mount (React
  // Strict Mode) cannot swallow the intro before it appears.
  const finish = () => {
    setPhase("gone");
    document.documentElement.classList.remove("intro-pending");
  };

  // Lock scrolling while the curtain is up.
  useEffect(() => {
    const locked = phase === "play" || phase === "pop" || phase === "leave";
    document.documentElement.style.overflow = locked ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [phase]);

  // The cream curtain is drawn from the first render (phase "idle" included),
  // so the page never shows through before the intro starts.
  if (phase === "gone") return null;

  // Clicking jumps straight to the exit. Cancelling the scheduled run first is
  // what stops the old timers replaying the pop/stones after the skip.
  const skip = () => {
    cancelAll();
    setPhase("leave");
    later(() => finish(), GONE_AT - LEAVE_AT);
  };

  const leaving = phase === "leave";
  const popped = phase === "pop" || phase === "leave";

  return (
    <div
      aria-hidden="true"
      onClick={leaving ? undefined : skip}
      className={`intro-curtain fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden ${
        leaving ? "intro-leave" : ""
      }`}
    >
      <div className="intro-lg relative">
        <div className={`intro-tile absolute inset-0 rounded-[25%/25.5%] ${popped ? "" : "intro-tile-in"}`} style={{ background: TILE }} />
        <div className="absolute inset-0">
          {motion?.map((s, i) => (
            <span
              key={i}
              className="intro-stone absolute block border-[1.5px]"
              style={{
                left: `${((s.x - s.r) / 192) * 100}%`,
                top: `${((s.y - s.r) / 188) * 100}%`,
                width: `${((2 * s.r) / 192) * 100}%`,
                height: `${((2 * s.r) / 188) * 100}%`,
                background: STONE,
                borderColor: TILE,
                borderRadius: "50%",
                ["--fx" as string]: `${s.fx.toFixed(1)}vmax`,
                ["--fy" as string]: `${s.fy.toFixed(1)}vmax`,
                ["--rt" as string]: `${s.rot}deg`,
                animationDelay: `${s.delay.toFixed(2)}s`,
                opacity: popped ? 0 : undefined,
              }}
            />
          ))}
        </div>
        <svg
          className={`intro-mark absolute inset-0 h-full w-full ${popped ? "intro-mark-in" : ""}`}
          viewBox={MARK_VIEWBOX}
          aria-hidden="true"
        >
          {MARK_PATHS.map((d, i) => (
            <path key={i} d={d} fill={STONE} />
          ))}
        </svg>
        <div className="intro-text absolute text-center">
          <span className={`intro-cap block font-bold text-[#2a0d11] ${popped ? "intro-cap-out" : ""}`}>
            cobbling together
          </span>
          <span className={`intro-word block font-display font-extrabold tracking-[-0.05em] text-[#48171d] lowercase ${popped ? "intro-word-in" : ""}`}>
            cobble
          </span>
        </div>
      </div>
    </div>
  );
}
