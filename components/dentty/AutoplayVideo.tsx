"use client";

import { useEffect, useRef } from "react";
import type { VideoHTMLAttributes } from "react";

/**
 * Muted-autoplay <video> that actually autoplays on mobile.
 *
 * React's `muted` JSX attribute does NOT reliably set the underlying DOM
 * `muted` PROPERTY, and mobile browsers only allow autoplay for genuinely
 * muted videos — so the attribute-only version kept falling back to "tap to
 * play". Here we force `el.muted = true` on the element and kick `play()`
 * ourselves (retrying once the data loads), which makes autoplay stick.
 *
 * Renders a bare <video> with a single <source> — no wrapper DOM — so it drops
 * straight into the existing layouts.
 */
type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "muted" | "children"> & {
  src: string;
};

export default function AutoplayVideo({ src, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // the property, not just the attribute — required for autoplay
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay, { once: true });
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, []);

  return (
    <video ref={ref} {...rest} muted playsInline>
      <source src={src} type="video/mp4" />
    </video>
  );
}
