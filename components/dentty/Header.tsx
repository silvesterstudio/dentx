"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CLINIC_TEL } from "@/lib/constants";
import type { Lang } from "@/lib/content";
import { useLang } from "./LanguageProvider";
import Logo from "./Logo";

const CALL_HREF = `tel:${CLINIC_TEL}`;

const NAV = [
  { key: "home", href: "#home" },
  { key: "about", href: "#clinic" },
  { key: "services", href: "#services" },
  { key: "cases", href: "#cases" },
  { key: "reviews", href: "#reviews" },
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

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
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
              layoutId="lang-pill"
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
        <a href="#home" onClick={() => setActive(0)} style={{ display: "flex", alignItems: "center" }}>
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
              onClick={() => setActive(i)}
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
            marginLeft: "auto",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{ display: "block", width: 18, height: 2, background: "#fbfbfb", borderRadius: 2 }}
            />
          ))}
        </button>

        <LangToggle lang={lang} setLang={setLang} />

        <a
          href={CALL_HREF}
          style={{
            background: "#fbfbfb",
            color: "#14191f",
            borderRadius: 999,
            padding: "13px 24px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <svg
            width="15"
            height="15"
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
      </div>

      {menuOpen && (
        <nav
          style={{
            position: "relative",
            marginTop: 10,
            background: "rgba(20,25,31,0.65)",
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
              onClick={() => {
                setActive(i);
                setMenuOpen(false);
              }}
              style={{
                color: i === active ? "#fbfbfb" : "rgba(251,251,251,0.85)",
                textDecoration: "none",
                fontSize: 15,
                fontWeight: i === active ? 600 : 400,
                padding: "12px 16px",
              }}
            >
              {t.nav[link.key]}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
