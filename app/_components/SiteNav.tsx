"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Top-left wordmark, top-right floating pill. The pill shows at the top of the
// page and when scrolling up; scrolling down swaps it for a compact
// "Join the waitlist" button, which scrolls to the form.
const linkClass =
  "rounded-sm text-[0.96rem] font-semibold text-ink underline-offset-4 whitespace-nowrap hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function SiteNav() {
  const [hidden, setHidden] = useState(false); // pill is hidden (scrolled down)
  const [compact, setCompact] = useState(false); // show compact CTA instead

  useEffect(() => {
    const TOP = 80;
    const DELTA = 6;
    let last = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = Math.max(0, window.scrollY);
      const d = y - last;
      if (y < TOP) {
        setHidden(false);
        setCompact(false);
        last = y;
        return;
      }
      if (Math.abs(d) < DELTA) return;
      const down = d > 0;
      setHidden(down);
      setCompact(down);
      last = y;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Wordmark: top-left, peach with a dark cartoon outline. */}
      <Link
        href="/"
        aria-label="Cobble home"
        className="rv pointer-events-auto absolute top-5 left-[calc(max(0px,(100vw-1200px)/2)+1.25rem)] font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.045em] text-[#f6d5bd] lowercase [text-shadow:2px_0_0_#0a0a0a,-2px_0_0_#0a0a0a,0_2px_0_#0a0a0a,0_-2px_0_#0a0a0a,2px_2px_0_#0a0a0a,-2px_-2px_0_#0a0a0a,2px_-2px_0_#0a0a0a,-2px_2px_0_#0a0a0a,0_3px_0_#0a0a0a] sm:top-6"
      >
        cobble
      </Link>

      {/* Floating pill: links + CTA, top-right. */}
      <nav
        aria-label="Primary"
        className={`nav-load pointer-events-auto absolute top-3 right-3 flex items-center gap-[22px] rounded-full border-[0.5px] border-[rgba(20,20,20,0.08)] bg-[rgba(255,255,255,0.92)] max-sm:border-[0.5px] max-sm:border-[rgba(20,20,20,0.08)] max-sm:shadow-[0_8px_22px_-14px_rgba(20,20,20,0.3)] py-[7px] pr-[7px] pl-6 shadow-[0_8px_22px_-14px_rgba(20,20,20,0.3)] transition-[transform,opacity] duration-500 sm:top-4 sm:right-6 ${
          hidden || compact ? "pointer-events-none -translate-y-6 scale-[0.97] opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <a href="#features" className={`${linkClass} hidden md:inline`}>
          Features
        </a>
        <a href="#why" className={`${linkClass} hidden md:inline`}>
          Why we&apos;re building it
        </a>
        <a href="#founders" className={`${linkClass} hidden md:inline`}>
          About the founders
        </a>
        <a href="#faq" className={`${linkClass} hidden md:inline`}>
          FAQs
        </a>
        <a
          href="#waitlist"
          className="inline-flex h-[46px] items-center rounded-full bg-maroon px-5 py-[11px] text-[0.96rem] font-semibold text-[#f6eee5] ring-[0.5px] ring-inset ring-[rgba(255,255,255,0.8)] lg:ring-1 shadow-none transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Get early access
        </a>
      </nav>

      {/* Compact CTA: shown after scrolling down. */}
      <a
        href="#waitlist"
        aria-hidden={!compact}
        tabIndex={compact ? 0 : -1}
        className={`pointer-events-auto absolute top-3 right-3 inline-flex h-11 items-center rounded-full border-2 border-[#2a0d11] bg-[#f6d5bd] px-5 text-[0.95rem] font-bold text-[#2a0d11] shadow-[0_4px_0_0_#2a0d11] transition-[transform,opacity] duration-500 sm:top-4 sm:right-6 ${
          compact ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        Join the waitlist
      </a>
    </header>
  );
}
