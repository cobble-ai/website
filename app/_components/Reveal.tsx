"use client";

import { useEffect } from "react";

// Scroll-reveal, ported from the landing page design. Any element with the
// .rv class fades and rises into place the first time it scrolls into view
// (threshold 0.15, -6% bottom margin, as in the HTML). It only hides elements
// when JavaScript runs and reduced motion is off, so content is never stuck
// invisible without JS.
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv, .rvh"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    // Wait for the intro to finish, so the reveal plays where the visitor can see it.
    const waitForIntro = (fn: () => void) => {
      if (!document.documentElement.classList.contains("intro-pending")) return fn();
      const obs = new MutationObserver(() => {
        if (!document.documentElement.classList.contains("intro-pending")) {
          obs.disconnect();
          fn();
        }
      });
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    };
    waitForIntro(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));
    });
    return () => {};
  }, []);

  return null;
}
