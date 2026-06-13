"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import MainSection from "./MainSection";
import Team from "./Team";
import Services from "./Services";
import CaseStudies from "./CaseStudies";
import Reviews from "./Reviews";
import Contact from "./Contact";

// Scroll-driven blur: as a section gets covered by the next one, the WHOLE
// outgoing section blurs in proportion to how far it's been covered.
// MAX_BLUR is the notional "100%" blur; FINAL_PROGRESS caps the ramp so the
// peak tops out below full — the section is never blurred all the way out.
const MAX_BLUR = 8; // px at 100% coverage (never reached)
const FINAL_PROGRESS = 0.8; // cap: blur peaks at 80% of MAX, not 100%

// The header scrim (gradient + blur) appears once the white panel has reached
// the top — i.e., we've scrolled off the hero onto the content sections.
const SCRIM_AT = 40; // px: show scrim when #main top is at/above this line

// Sections that pin with `top = viewportHeight - sectionHeight` and have the
// next section slide up over them. (Hero is pinned at top:0; #main is a tall
// relative block that scrolls over the hero and continuously into the team;
// #team manages its own sticky pin + height for the horizontal sweep; Contact
// is the final flow section.)
const STICKY_IDS = ["services", "cases", "reviews"];

// [sectionToBlur, sectionCoveringIt] — each outgoing section blurs as its
// successor rises over it. Clinica noastră (#main) flows continuously into the
// team (no overlay between them), so there's no blur there; navy Servicii then
// slides over the white team.
const BLUR_PAIRS: [string, string][] = [
  ["home", "main"],
  ["team", "services"],
  ["services", "cases"],
  ["cases", "reviews"],
  ["reviews", "contact"],
];

// Every element that may have a scroll-blur applied — cleared on teardown and
// when the layout flattens on mobile.
const BLUR_TARGETS = ["home", "main", "team", "services", "cases", "reviews"];

/**
 * Sticky-stack reveal + scroll-linked blur.
 *
 * Each sticky section pins at `top = viewportHeight - sectionHeight`, so the
 * next one scrolls up and over it. Heights are measured live and applied as
 * inline `top`. As a section is covered, it blurs progressively with scroll
 * (capped below full). The fixed header's scrim fades in once you leave the
 * hero. Below 980px globals.css flattens the stack and the blur is disabled.
 */
export default function DenttyHome() {
  const [tops, setTops] = useState<Record<string, string>>({});
  const [showScrim, setShowScrim] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const vh = window.innerHeight;
      setTops((prev) => {
        const next: Record<string, string> = {};
        let changed = false;
        for (const id of STICKY_IDS) {
          const el = document.getElementById(id);
          const v = el ? Math.round(vh - el.offsetHeight) + "px" : "0px";
          next[id] = v;
          if (prev[id] !== v) changed = true;
        }
        return changed ? next : prev;
      });
    };

    const ro = new ResizeObserver(measure);
    STICKY_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) ro.observe(el);
    });
    window.addEventListener("resize", measure);
    measure();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 980px)");
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
    const coverage = (el: HTMLElement | null, vh: number) =>
      el ? clamp01((vh - el.getBoundingClientRect().top) / vh) : 0;
    const applyBlur = (el: HTMLElement | null, progress: number) => {
      if (!el) return;
      const p = Math.min(progress, FINAL_PROGRESS);
      el.style.filter = p > 0.001 ? `blur(${(p * MAX_BLUR).toFixed(2)}px)` : "";
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight || 1;

      if (mq.matches) {
        BLUR_PAIRS.forEach(([target]) => {
          const el = document.getElementById(target);
          if (el) el.style.filter = "";
        });
      } else {
        BLUR_PAIRS.forEach(([target, coverer]) =>
          applyBlur(
            document.getElementById(target),
            coverage(document.getElementById(coverer), vh),
          ),
        );
      }

      const main = document.getElementById("main");
      const scrim = !!main && main.getBoundingClientRect().top <= SCRIM_AT;
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
      BLUR_TARGETS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.style.filter = "";
      });
    };
  }, []);

  const top = (id: string) => tops[id] ?? "0px";

  return (
    <div style={{ background: "#1d242b" }}>
      <Header showScrim={showScrim} />
      <Hero />
      <MainSection />
      {/* Sticky-proof marker: tracks scroll into the team's pinned sweep. */}
      <div id="team-sentinel" aria-hidden style={{ height: 0 }} />
      <Team />
      <Services top={top("services")} />
      <CaseStudies top={top("cases")} />
      <Reviews top={top("reviews")} />
      <Contact />
    </div>
  );
}
