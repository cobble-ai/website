"use client";

import { useEffect } from "react";

// Slow, eased scrolling for in-page links (#features, #why, ...). The
// browser's own scroll-behavior: smooth is fast and not adjustable, so this
// glides over about 1.1 to 2 seconds. It stops if the visitor scrolls, and
// jumps instead of gliding when "reduce motion" is on.
export default function SmoothAnchors() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;

    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const glide = (target: number) => {
      stop();
      const start = window.scrollY;
      const dist = target - start;
      if (reduce.matches || Math.abs(dist) < 2) {
        window.scrollTo(0, target);
        return;
      }
      const duration = Math.min(2000, Math.max(1100, Math.abs(dist) * 1.1));
      const ease = (x: number) =>
        x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      let t0: number | null = null;
      const frame = (now: number) => {
        if (t0 === null) t0 = now;
        const p = Math.min(1, (now - t0) / duration);
        window.scrollTo(0, start + dist * ease(p));
        raf = p < 1 ? requestAnimationFrame(frame) : 0;
      };
      raf = requestAnimationFrame(frame);
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link) return;
      const id = link.getAttribute("href") ?? "";
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      let y = el.getBoundingClientRect().top + window.scrollY;
      y -= id === "#waitlist" ? window.innerHeight * 0.3 : 16;
      glide(Math.max(0, Math.round(y)));
    };

    document.addEventListener("click", onClick);
    const interrupts = ["wheel", "touchstart", "keydown", "mousedown"] as const;
    interrupts.forEach((name) =>
      window.addEventListener(name, stop, { passive: true }),
    );
    return () => {
      stop();
      document.removeEventListener("click", onClick);
      interrupts.forEach((name) => window.removeEventListener(name, stop));
    };
  }, []);

  return null;
}
