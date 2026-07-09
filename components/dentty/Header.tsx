"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CLINIC_TEL,
  CLINIC_PHONE,
  CLINIC_PHONES,
  waLink,
  viberLink,
} from "@/lib/constants";
import type { Lang } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Logo from "./Logo";

const CALL_HREF = `tel:${CLINIC_TEL}`;
const WA_HREF = waLink(CLINIC_PHONES[0].e164);
const VIBER_HREF = viberLink(CLINIC_PHONES[0].e164);

// Handset glyph shared by every call affordance (nav pill, mobile icon, popover).
function PhoneGlyph({ size = 15, stroke = "#14191f" }: { size?: number; stroke?: string }) {
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

// Brand marks for the desktop "message us instead" options (single-path logos).
function WhatsAppGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

function ViberGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" aria-hidden>
      <path d="M11.4 0C9.5 0 5.3.3 3 2.5 1.3 4.2.7 6.7.6 9.8c-.1 3.1-.1 8.9 5.5 10.5v2.4s0 1 .6 1.2c.8.2 1.2-.5 2-1.3l1.4-1.6c3.9.3 6.8-.4 7.1-.5.8-.3 5.2-.8 5.9-6.7.7-6-.4-9.8-2.3-11.6C19.9 1 17.5-.7 12.1-.7c0 0-.4 0-.7 0zM11.5 1.7c.5 0 .9 0 .9 0 4.5 0 6.7 1.4 7.2 1.8 1.7 1.4 2.5 4.9 1.9 9.9-.6 4.9-4.1 5.1-4.8 5.4-.3.1-2.9.7-6.2.5 0 0-2.4 2.9-3.2 3.7-.1.1-.3.2-.4.1-.1 0-.2-.2-.2-.4v-4c-4.8-1.3-4.5-6.3-4.4-8.9 0-2.6.5-4.7 2-6.2C6.4 2 9.9 1.7 11.5 1.7zm.4 2.6c-.2 0-.3.1-.3.3 0 .2.1.3.3.3 1.5 0 2.8.5 3.9 1.5 1 1 1.5 2.4 1.6 4.1 0 .2.1.3.3.3.2 0 .3-.1.3-.3 0-1.9-.6-3.5-1.7-4.6-1.1-1.1-2.6-1.6-4.3-1.7 0 0 0 0-.1 0zm-4 .7c-.2 0-.4 0-.5.2-.3.2-.5.6-.6 1-.1.4-.1.9.1 1.3.7 1.5 1.7 2.9 3 4 .1.1.3.2.4.3.1.1.3.2.4.3 1.2.9 2.5 1.7 3.9 2.2.4.1.9.2 1.3.1.4-.1.7-.3.9-.6.2-.3.4-.6.3-1 0-.1 0-.3-.1-.4 0-.2-.2-.3-.3-.4-.4-.4-.9-.7-1.3-1-.4-.3-.8-.3-1.1 0-.2.2-.4.3-.5.5-.1.1-.3.2-.4.1-.5-.3-1-.6-1.4-1-.4-.4-.8-.9-1-1.5-.1-.1 0-.3.1-.4.2-.1.3-.3.5-.4.3-.3.3-.6.1-.9-.3-.5-.7-.9-1-1.3-.1-.1-.2-.2-.4-.3-.1-.1-.2-.1-.3-.1zm4 .5c-.2 0-.3.1-.3.3 0 .2.1.3.3.3.8 0 1.4.3 1.8.7.4.4.6 1 .7 1.9 0 .2.1.3.3.3.2 0 .3-.1.3-.3 0-.9-.3-1.7-.8-2.2-.5-.6-1.3-.9-2.2-.9 0 0 0 0-.1 0zm.4 1.4c-.2 0-.3.1-.3.3 0 .2.1.3.3.3.4 0 .7.1.8.3.2.2.3.5.3.9 0 .2.1.3.3.3.2 0 .3-.1.3-.3 0-.5-.1-.9-.4-1.3-.3-.3-.7-.5-1.2-.5-.1 0-.2 0-.4 0z" />
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
  // Desktop "Sună acum" opens a small popover instead of a dead tel: link (you
  // can't dial from a desktop) — it shows the number to call from a phone plus
  // WhatsApp/Viber shortcuts. Closes on an outside click.
  const [callOpen, setCallOpen] = useState(false);
  const callRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!callOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (callRef.current && !callRef.current.contains(e.target as Node)) setCallOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [callOpen]);

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

      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
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

        {/* MOBILE-ONLY quick-call: a white handset icon in the top bar so the
            number is one tap away without opening the burger. tel: works on a
            phone. Pushed to the right edge; the burger follows it. */}
        <a
          id="nav-call-mobile"
          href={CALL_HREF}
          aria-label={t.common.callNow}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 46,
            height: 46,
            background: "rgba(255,255,255,0.14)",
            borderRadius: 12,
            flexShrink: 0,
            marginLeft: "auto",
          }}
        >
          <PhoneGlyph size={19} stroke="#fbfbfb" />
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
          {/* small, unobtrusive Feedback pill (Google-review funnel at /feedback) */}
          <a
            href="/feedback"
            style={{
              color: "#fbfbfb",
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 600,
              padding: "9px 15px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            {t.common.feedback}
          </a>

          <LangToggle lang={lang} setLang={setLang} pillId="lang-pill-desktop" />

          <div ref={callRef} style={{ position: "relative" }}>
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={callOpen}
              onClick={() => setCallOpen((v) => !v)}
              style={{
                background: "#fbfbfb",
                color: "#14191f",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                borderRadius: 999,
                padding: "13px 24px",
                fontSize: 14,
                fontWeight: 600,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <PhoneGlyph size={15} />
              {t.common.callNow}
            </button>

            {callOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  width: 268,
                  background: "rgba(20,25,31,0.92)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(251,251,251,0.14)",
                  borderRadius: 18,
                  padding: 18,
                  boxShadow: "0 24px 60px rgba(8,11,16,0.5)",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: "rgba(251,251,251,0.55)",
                  }}
                >
                  {t.common.callFromPhone}
                </div>
                <a
                  href={CALL_HREF}
                  style={{
                    display: "block",
                    marginTop: 6,
                    color: "#fbfbfb",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    textDecoration: "none",
                  }}
                >
                  {CLINIC_PHONE}
                </a>

                <div
                  style={{
                    margin: "16px 0 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "rgba(251,251,251,0.5)",
                  }}
                >
                  {t.common.orWrite}
                </div>
                <div style={{ display: "flex", gap: 9 }}>
                  <a
                    href={WA_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#25D366",
                      color: "#ffffff",
                      borderRadius: 999,
                      padding: "11px 12px",
                      fontSize: 13.5,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <WhatsAppGlyph size={17} />
                    WhatsApp
                  </a>
                  <a
                    href={VIBER_HREF}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "#7360F2",
                      color: "#ffffff",
                      borderRadius: 999,
                      padding: "11px 12px",
                      fontSize: 13.5,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    <ViberGlyph size={17} />
                    Viber
                  </a>
                </div>
              </div>
            )}
          </div>
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
            <a
              href="/feedback"
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#fbfbfb",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                padding: "10px 16px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
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
