"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal driver. Arms the CSS reveal system (adds `js-reveal` to <html>
 * so `.reveal` / `.reveal-img` start hidden), then watches every such element
 * with one IntersectionObserver and adds `in-view` as it enters the viewport,
 * which plays the transition (see globals.css). Reveals are one-shot.
 *
 * Skipped entirely under prefers-reduced-motion — `js-reveal` is never set, so
 * the content keeps its natural (visible) state. Renders nothing.
 *
 * This is decoupled from the scroll-scrubbed effects (Team sweep, Services video
 * expand, Cazuri video) on purpose: it only touches opacity/transform of
 * normal-flow content that those effects don't drive.
 */
export default function RevealOnScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const root = document.documentElement;
    root.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          // Promote to a GPU layer only for the duration of this one reveal,
          // then drop the hint so it doesn't stay a permanent layer.
          el.classList.add("revealing");
          el.addEventListener(
            "transitionend",
            () => el.classList.remove("revealing"),
            { once: true }
          );
          el.classList.add("in-view");
        }
      },
      // fire a little before the element is fully on screen
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-img");
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
