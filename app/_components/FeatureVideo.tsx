"use client";

import { useEffect, useRef, useState } from "react";

// A muted, looping screen recording of the real app. Until the file exists
// (or while it loads), the fallback stays on screen, so a missing video never
// leaves an empty box. Drop recordings into public/demos/ with the same names.
export default function FeatureVideo({
  src,
  children,
}: {
  src: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  // Show the video once it has a frame. It can load before React hydrates,
  // so check readyState as well as listening for the event.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const show = () => setReady(true);
    if (video.readyState >= 2) queueMicrotask(show);
    video.addEventListener("loadeddata", show);
    return () => video.removeEventListener("loadeddata", show);
  }, []);

  // Only play while the card is on screen, and never for users who ask for
  // reduced motion: they keep the still first frame.
  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !media.matches) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <div className="absolute inset-0">
      <div className={`absolute inset-0 flex flex-col justify-center gap-2.5 p-4 transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setReady(false)}
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
