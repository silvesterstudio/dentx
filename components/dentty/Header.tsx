"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CLINIC_TEL } from "@/lib/constants";
import type { Lang } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Logo from "./Logo";
import CallButton from "./CallButton";

const CALL_HREF = `tel:${CLINIC_TEL}`;

// Handset glyph for the mobile-only quick-call icon.
function PhoneGlyph({ size = 22, stroke = "#fbfbfb" }: { size?: number; stroke?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const NAV = [
  { key: "home", href: "#home" },
  { key: "about", href: "#clinic" },
  { key: "faq", href: "#faq" },
  { key: "services", href: "#services" },
  { key: "cases", href: "#cases" },
  { key: "contact", href: "#contact" },
] as const;

// Smooth multi-stop dark gradient (extra stops kill the banding "line").
const SCRIM_GRADIENT =
  "linear-gradient(to bottom," +
  " rgba(17,21,27,0.60) 0%," +
  " rgba(17,21,27,0.46) 24%," +
  " rgba(17,21,27,0.30) 46%," +
  " rgba(17,21,27,0.16) 64%," +
  " rgba(17,21,27,0.06) 82%," +
  " rgba(17,21,27,0.015) 92%," +
  " rgba(17,21,27,0) 100%)";

const BLUR_LAYERS = [
  { blur: 10, mask: "linear-gradient(to bottom, #000 0%, #000 8%, transparent 34%)" },
  { blur: 6, mask: "linear-gradient(to bottom, #000 0%, #000 24%, transparent 54%)" },
  { blur: 3, mask: "linear-gradient(to bottom, #000 0%, #000 44%, transparent 74%)" },
  { blur: 1.5, mask: "linear-gradient(to bottom, #000 0%, #000 66%, transparent 94%)" },
];

// Frosted pill in the same glass language as the nav + language toggle. Used for
// the Feedback link so it reads as part of the design system, not a bolted-on box.
const FEEDBACK_PILL: React.CSSProperties = {
  color: "#fbfbfb",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
  padding: "13px 18px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function LangToggle({
  lang,
  setLang,
  pillId = "lang-pill",
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  pillId?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius: 999,
        padding: 4,
        gap: 2,
      }}
    >
      {(["ro", "ru"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          style={{
            position: "relative",
            border: "none",
            cursor: "pointer",
            borderRadius: 999,
            padding: "9px 14px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            textTransform: "uppercase",
            background: "transparent",
            color: lang === l ? "#14191f" : "#fbfbfb",
            transition: "color 0.25s ease",
          }}
        >
          {lang === l && (
            <motion.span
              layoutId={pillId}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "#fbfbfb",
                borderRadius: 999,
                zIndex: -1,
              }}
            />
          )}
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Header({ showScrim = false }: { showScrim?: boolean }) {
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);

  // Scroll-spy: highlight the nav link for the section currently in view. The
  // layout is a sticky-stack (sections overlap via sticky + z-index), so instead
  // of "which section spans the centre" we take the LAST nav section whose top
  // has crossed a line ~1/3 down the viewport — i.e. the most recent section to
  // come into view. Works across the sticky Hero and the tall Cazuri track.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1)); // "#home" -> "home"
    let raf = 0;
    let timer = 0;
    let lastRun = 0;
    const update = () => {
      raf = 0;
      lastRun = performance.now();
      const vh = window.innerHeight || 1;
      const line = vh * 0.35;
      let idx = 0;
      for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) idx = i;
      }
      // The Contact section is short and the video-lift keeps its top mid-screen,
      // so it never crosses the line — force the last nav item near the page bottom.
      const max = document.documentElement.scrollHeight - vh;
      if (window.scrollY >= max - vh * 0.35) idx = ids.length - 1;
      setActive((prev) => (prev === idx ? prev : idx));
    };
    // Throttled to ~6 checks/s (with a trailing run so it always settles on the
    // right section). A nav highlight doesn't need per-frame accuracy, and the
    // un-throttled version measured EIGHT section rects on every scroll frame —
    // right after the other scroll handlers had written styles, forcing extra
    // full-page layouts during the heavy scrubbed animations.
    const onScroll = () => {
      if (raf || timer) return;
      const wait = 160 - (performance.now() - lastRun);
      if (wait <= 0) {
        raf = requestAnimationFrame(update);
      } else {
        timer = window.setTimeout(() => {
          timer = 0;
          raf = requestAnimationFrame(update);
        }, wait);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Navigate to a section. We scroll ourselves (instead of relying on the
  // native `#anchor` jump) so it lands BELOW the fixed header and uses a
  // controlled smooth scroll. #home goes to the very top; #home/#team are
  // sticky so their getBoundingClientRect is unreliable — everything we link to
  // (#clinic, #services, #cases, #reviews, #contact) lives in a relative
  // container, so measuring them is accurate.
  const goTo = (e: { preventDefault: () => void }, href: string, i: number) => {
    e.preventDefault();
    setActive(i);
    setMenuOpen(false);
    let y = 0;
    if (href !== "#home") {
      const el = document.querySelector(href);
      // section may be intentionally absent (e.g. Recenzii/Contacte links kept in
      // the nav but their sections removed) — don't jump anywhere.
      if (!el) return;
      const headerH =
        (document.querySelector("header") as HTMLElement | null)?.offsetHeight ?? 80;
      if (el) {
        const top = Math.round(el.getBoundingClientRect().top + window.scrollY);
        if (href === "#services") {
          // Servicii slides UP over the sticky team. Land at its own top so it
          // fully covers the team — its own top padding clears the fixed nav.
          // Landing higher (top - headerH) would reveal a sliver of the team.
          y = Math.max(0, top);
        } else if (href === "#cases") {
          // #cases is the expand track; land where the video is fullscreen with
          // the "Lucrările noastre" title + before/after on it.
          y = Math.max(0, top + Math.round(window.innerHeight * 0.8));
        } else {
          y = Math.max(0, top - headerH - 8);
        }
      }
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? ("instant" as ScrollBehavior) : "smooth" });
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "clamp(16px, 2.2vh, 26px) clamp(22px, 3.2vw, 60px) clamp(12px, 1.6vh, 18px)",
        boxSizing: "border-box",
      }}
    >
      {/* Scrim: progressive (gradient) blur + smooth dark gradient, only over sections. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: showScrim ? 1 : 0,
          transition: "opacity 0.35s ease",
          pointerEvents: "none",
        }}
      >
        {BLUR_LAYERS.map((layer, i) => (
          <div
            key={i}
            className="header-blur-layer"
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: `blur(${layer.blur}px)`,
              WebkitBackdropFilter: `blur(${layer.blur}px)`,
              maskImage: layer.mask,
              WebkitMaskImage: layer.mask,
            }}
          />
        ))}
        <div style={{ position: "absolute", inset: 0, background: SCRIM_GRADIENT }} />
      </div>

      <div
        className="header-bar"
        style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}
      >
        <a
          href="#home"
          onClick={(e) => goTo(e, "#home", 0)}
          style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <Logo height={50} />
        </a>

        <nav
          id="nav-links"
          style={{
            margin: "0 auto",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 999,
            padding: 6,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {NAV.map((link, i) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => goTo(e, link.href, i)}
              style={{
                position: "relative",
                color: i === active ? "#14191f" : "#fbfbfb",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: i === active ? 600 : 500,
                padding: "11px 22px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                transition: "color 0.25s ease",
              }}
            >
              {i === active && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#fbfbfb",
                    borderRadius: 999,
                    zIndex: -1,
                  }}
                />
              )}
              {t.nav[link.key]}
            </a>
          ))}
        </nav>

        {/* MOBILE-ONLY quick-call: a bare white handset icon in the top bar (no
            glass chip) so the number is one tap away without opening the burger.
            tel: works on a phone. Pushed to the right edge; the burger sits close
            beside it (see the tightened .header-bar gap on mobile). */}
        <a
          id="nav-call-mobile"
          href={CALL_HREF}
          aria-label={t.common.callNow}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            padding: 9,
            background: "transparent",
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <PhoneGlyph size={24} stroke="#fbfbfb" />
        </a>

        <button
          id="nav-burger"
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          style={{
            display: "none",
            flexDirection: "column",
            justifyContent: "center",
            gap: 4,
            background: "rgba(255,255,255,0.14)",
            border: "none",
            borderRadius: 12,
            padding: 14,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ display: "block", width: 18, height: 2, background: "#fbfbfb", borderRadius: 2 }}
            />
          ))}
        </button>

        <div
          className="header-desktop-actions"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          {/* small Feedback pill — same frosted-glass language as the toggle/nav
              (no odd outline), so it sits in the design system unobtrusively */}
          <a href="/feedback" style={FEEDBACK_PILL}>
            {t.common.feedback}
          </a>

          <LangToggle lang={lang} setLang={setLang} pillId="lang-pill-desktop" />

          <CallButton
            style={{
              background: "#fbfbfb",
              color: "#14191f",
              borderRadius: 999,
              padding: "13px 24px",
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
            }}
            iconSize={15}
          />
        </div>
      </div>

      {menuOpen && (
        <nav
          style={{
            position: "relative",
            marginTop: 10,
            background: "rgba(20,25,31,0.82)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: 16,
            padding: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {NAV.map((link, i) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => goTo(e, link.href, i)}
              style={{
                color: i === active ? "#fbfbfb" : "rgba(251,251,251,0.85)",
                textDecoration: "none",
                fontSize: 16,
                fontWeight: i === active ? 600 : 400,
                padding: "13px 16px",
              }}
            >
              {t.nav[link.key]}
            </a>
          ))}

          {/* divider + actions moved out of the cramped top bar */}
          <div style={{ height: 1, background: "rgba(251,251,251,0.12)", margin: "8px 8px" }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "6px 8px 4px",
            }}
          >
            <LangToggle lang={lang} setLang={setLang} pillId="lang-pill-mobile" />
            <a href="/feedback" onClick={() => setMenuOpen(false)} style={FEEDBACK_PILL}>
              {t.common.feedback}
            </a>
          </div>

          <a
            href={CALL_HREF}
            style={{
              marginTop: 8,
              background: "#fbfbfb",
              color: "#14191f",
              borderRadius: 999,
              padding: "15px 22px",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14191f"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {t.common.callNow}
          </a>
        </nav>
      )}
    </header>
  );
}
