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

    // Elements still waiting to be revealed. Once revealed, an element leaves
    // this set; when the set empties we tear down the fallback listeners.
    const pending = new Set<HTMLElement>();

    const reveal = (el: HTMLElement) => {
      if (!pending.has(el)) return;
      pending.delete(el);
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
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        }
      },
      // fire a little before the element is fully on screen
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-img");
    els.forEach((el) => {
      pending.add(el);
      io.observe(el);
    });

    // Safety net. The IntersectionObserver can miss elements during fast or
    // instant (anchor-jump) scrolls into the pinned Servicii/Echipa sections,
    // which left service cards stuck invisible ("only the video shows"). This
    // rAF-throttled sweep reveals any pending element that is actually within
    // the viewport, so nothing can stay hidden once it's on screen. It runs
    // only while something is still pending, then removes itself.
    let raf = 0;
    const sweep = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      for (const el of pending) {
        const r = el.getBoundingClientRect();
        // visible (with a small margin) → reveal it now
        if (r.top < vh * 0.95 && r.bottom > 0) reveal(el);
      }
      if (pending.size === 0) teardown();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };

    let torn = false;
    const teardown = () => {
      if (torn) return;
      torn = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // initial sweep after layout settles (covers a deep-link landing on a section)
    sweep();

    return () => {
      io.disconnect();
      teardown();
      root.classList.remove("js-reveal");
    };
  }, []);

  return null;
}
