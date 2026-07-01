"use client";

import { useEffect, useState } from "react";
import Preloader from "./Preloader";
import RevealOnScroll from "./RevealOnScroll";
import Header from "./Header";
import Hero from "./Hero";
import MainSection from "./MainSection";
import Team from "./Team";
import Services from "./Services";
import CaseStudies from "./CaseStudies";
import Contact from "./Contact";
import Faq from "./Faq";

// Scroll-driven cover-blur: as a section is covered by the next one rising over
// it, the outgoing section blurs in proportion to how far it's been covered.
const MAX_BLUR = 8; // px at full coverage
const FINAL_PROGRESS = 0.8; // cap so it never blurs the section all the way out

// The header scrim appears once the white panel reaches the top.
const SCRIM_AT = 40; // px: show scrim when #main top is at/above this line

/**
 * Sticky-stack reveal + cover-blur + header scrim. The reveal itself is pure
 * CSS (sticky + z-index). On scroll we (a) blur each outgoing section as its
 * successor covers it and (b) toggle the fixed header's scrim. Coverage is read
 * from the COVERING section (#main, #work — both position:relative, so their
 * getBoundingClientRect is accurate, unlike the sticky outgoing ones). The blur
 * is skipped below 980px.
 */
export default function DenttyHome() {
  const [showScrim, setShowScrim] = useState(false);

  useEffect(() => {
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
    // Cover-blur is a desktop-only flourish — a full-viewport blur() filter is
    // too expensive to animate per scroll frame on phones (it made mobile
    // scrolling janky). Below 980px we skip it entirely, as documented.
    const mq = window.matchMedia("(max-width: 980px)");
    const homeEl = document.getElementById("home");
    const mainEl = document.getElementById("main");
    // [outgoing section that gets blurred, covering section we measure].
    // Team→Servicii is now a default scroll (no slide-over), so it's not blurred.
    const pairs: [HTMLElement | null, HTMLElement | null][] = [
      [homeEl, mainEl],
    ];

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      for (const [target, coverer] of pairs) {
        if (!target) continue;
        let f = "";
        if (coverer && !mq.matches) {
          const cov = clamp01((vh - coverer.getBoundingClientRect().top) / vh);
          const p = Math.min(cov, FINAL_PROGRESS);
          if (p > 0.001) f = `blur(${(p * MAX_BLUR).toFixed(2)}px)`;
        }
        if (target.style.filter !== f) {
          target.style.filter = f;
          // hint the compositor only while actually blurring
          target.style.willChange = f ? "filter" : "auto";
        }
      }
      const scrim = !!mainEl && mainEl.getBoundingClientRect().top <= SCRIM_AT;
      setShowScrim((prev) => (prev === scrim ? prev : scrim));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      pairs.forEach(([t]) => {
        if (t) {
          t.style.filter = "";
          t.style.willChange = "auto";
        }
      });
    };
  }, []);

  // Smooth (eased) wheel scrolling. We intercept the wheel and lerp the actual
  // scroll position toward an accumulated target, so scrolling GLIDES instead of
  // jumping per notch. Crucially this does NOT snap to sections and does NOT
  // debounce/chain gestures — it only smooths the raw scroll, so the old
  // device-dependent snapping bugs can't happen. Keyboard, scrollbar and touch
  // stay native; disabled on mobile and for reduced motion. Each frame's
  // scrollTo fires a scroll event, so the cover-blur and the team's sentinel
  // sweep animate smoothly along with it.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mq = window.matchMedia("(max-width: 980px)");
    if (reduce.matches) return; // honour reduced motion → plain native scroll

    const EASE = 0.18; // higher = snappier, lower = floatier
    const INSTANT = "instant" as ScrollBehavior;
    const maxY = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;

    const loop = () => {
      raf = 0;
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        window.scrollTo({ top: Math.round(current), behavior: INSTANT });
        return;
      }
      current += diff * EASE;
      window.scrollTo({ top: Math.round(current), behavior: INSTANT });
      raf = requestAnimationFrame(loop);
    };

    const onWheel = (e: WheelEvent) => {
      if (mq.matches || e.ctrlKey) return; // mobile / pinch-zoom → native
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal → native
      e.preventDefault();
      const dy =
        e.deltaY *
        (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1);
      if (!raf) {
        // Resync to reality in case a native scroll (keyboard / scrollbar /
        // anchor) moved the page since the last gesture.
        current = window.scrollY;
        target = current;
      }
      target = Math.max(0, Math.min(maxY(), target + dy));
      if (!raf) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{ background: "#1d242b" }}>
      <Preloader />
      <RevealOnScroll />
      <Header showScrim={showScrim} />
      <Hero />
      <MainSection />
      {/* FAQ sits in the NON-sticky light flow between Clinica (#main, which scrolls
          up and out) and the Team sweep. This zone touches none of the loved sticky
          effects (Team sweep, Servicii slide-over, the Cazuri→Contact video lift) nor
          the cover-blur pairs (home←main, team←work), and stays seamlessly white. */}
      <Faq />
      {/* Sticky-proof marker: tracks scroll into the team's pinned sweep. */}
      <div id="team-sentinel" aria-hidden style={{ height: 0 }} />
      <Team />
      {/* Servicii + Cazuri + Recenzii fused into one continuous light block that
          slides over the team and is scrolled through with ordinary native
          scroll (no per-section snapping). */}
      <section
        id="work"
        style={{ position: "relative", zIndex: 4, background: "#fbfbfb" }}
      >
        <Services />
        <CaseStudies />
      </section>
      {/* Contact is a normal, shorter section beneath the fullscreen Cazuri
          video. At the end of the cases, the fixed video card LIFTS up (tracked
          in CaseStudies) to reveal Contact underneath — it does NOT slide over. */}
      <Contact />
    </div>
  );
}
