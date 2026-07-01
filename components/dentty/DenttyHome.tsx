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

// Scroll-driven cover-blur: as the hero is covered by Clinica rising over it,
// a PRE-BLURRED copy of the hero photo cross-fades in over the sharp one
// (#hero-img-blur in Hero.tsx). Opacity on a composited layer is compositor-only
// work — unlike the old animated filter: blur(), which made the GPU re-run a
// full-viewport gaussian every scroll frame and lagged the Hero→Clinica scroll.
const BLUR_SRC = "/hero-desktop-blur.webp";
const FINAL_PROGRESS = 0.8; // cap so it never blurs the hero all the way out

// The header scrim appears once the white panel reaches the top.
const SCRIM_AT = 40; // px: show scrim when #main top is at/above this line

/**
 * Sticky-stack reveal + cover-blur + header scrim. The reveal itself is pure
 * CSS (sticky + z-index). On scroll we (a) cross-fade the hero's pre-blurred
 * photo in as Clinica covers it and (b) toggle the fixed header's scrim.
 * Coverage is read from the COVERING section (#main — position:relative, so its
 * getBoundingClientRect is accurate, unlike the sticky hero). The blur is
 * skipped below 980px.
 */
export default function DenttyHome() {
  const [showScrim, setShowScrim] = useState(false);

  useEffect(() => {
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
    // Cover-blur is a desktop-only flourish — below 980px we skip it entirely
    // (and never even load the blurred image), as documented.
    const mq = window.matchMedia("(max-width: 980px)");
    const mainEl = document.getElementById("main");
    const blurImg = document.getElementById("hero-img-blur") as HTMLImageElement | null;
    // Assign the blurred image on desktop up front so it's downloaded + decoded
    // long before the first scroll frame needs to fade it in.
    if (blurImg && !mq.matches && !blurImg.getAttribute("src")) {
      blurImg.src = BLUR_SRC;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;
      const mainTop = mainEl ? mainEl.getBoundingClientRect().top : vh;
      if (blurImg) {
        let o = 0;
        if (!mq.matches) {
          const cov = clamp01((vh - mainTop) / vh);
          // quantize so most frames skip the style write entirely
          o = Math.round(Math.min(cov, FINAL_PROGRESS) * 100) / 100;
        }
        const s = String(o);
        if (blurImg.style.opacity !== s) blurImg.style.opacity = s;
      }
      const scrim = !!mainEl && mainTop <= SCRIM_AT;
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
      if (blurImg) blurImg.style.opacity = "0";
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
