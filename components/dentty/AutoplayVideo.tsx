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
  /**
   * When set, this component does NOT auto-play or observe — the PARENT drives
   * play()/pause() (used by the Cazuri overlay clone, which stays paused on a
   * still frame during the expand and only plays once fullscreen, so no video is
   * decoded during the laggy morph). We still force `muted` so the parent's
   * later play() is allowed by mobile autoplay policy.
   */
  controlled?: boolean;
};

export default function AutoplayVideo({ src, controlled, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // the property, not just the attribute — required for autoplay
    if (controlled) return; // parent owns play/pause for this instance
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay, { once: true });

    // Mobile browsers (esp. iOS Safari, and any tab in Low-Power/data-saver mode)
    // often ignore an autoplay kicked while the element is offscreen, leaving a
    // frozen poster the user has to TAP to start. Watch the card and (re)kick
    // play() as it APPROACHES the viewport — the wide rootMargin fires it well
    // before the user scrolls it into view ("predict the start"), so the clip is
    // already running by the time Servicii lands. No tap required.
    // Also PAUSE the clip once it's well clear of the viewport (or hidden via
    // display:none — a display:none element reports isIntersecting:false). The
    // Cazuri overlay renders a SECOND copy of this same video that sits hidden
    // ~95% of the time; left playing it kept a whole extra decoder running every
    // frame while scrolling the rest of the page, which fed the scroll lag. The
    // wide 60% rootMargin still resumes it well before it's ever seen, so the
    // pause is invisible — the clip is always running by the time it's on screen.
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) tryPlay();
            else if (!v.paused) v.pause();
          }
        },
        { rootMargin: "60% 0px 60% 0px", threshold: 0.01 },
      );
      io.observe(v);
    }

    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      io?.disconnect();
    };
  }, [controlled]);

  return (
    <video ref={ref} {...rest} muted playsInline>
      <source src={src} type="video/mp4" />
    </video>
  );
}
