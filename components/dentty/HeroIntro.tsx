"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * Hero intro reveal trigger — NO visible curtain (the old navy Preloader screen
 * with the logo was removed on request). This only stages the hero's staged
 * reveal: it sets `html.intro-pre` synchronously BEFORE the first paint (so the
 * hero's title lines, image and CTA start in their hidden state — see
 * globals.css), then removes the flag a couple of frames later so those CSS
 * transitions play in on load (title words rise from a mask, the image scales
 * in, the CTA fades up). Honours prefers-reduced-motion by skipping entirely.
 */
export default function HeroIntro() {
  // Apply the hidden state before paint so the reveal has somewhere to animate
  // FROM. useLayoutEffect runs before the browser paints.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    document.documentElement.classList.add("intro-pre");
  }, []);

  // After the hidden state has painted, drop the flag so the transitions run.
  // Two rAFs guarantee the initial hidden state committed at least one frame —
  // removing it the same frame would snap instead of animate.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro-pre")) return; // reduced motion → nothing staged
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => root.classList.remove("intro-pre"));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      root.classList.remove("intro-pre");
    };
  }, []);

  return null;
}
