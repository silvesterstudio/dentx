"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  CLINIC_TEL,
  CLINIC_PHONE,
  CLINIC_PHONES,
  waLink,
  viberLink,
} from "@/lib/constants";
import { useLang } from "./LanguageProvider";
import { WhatsAppIcon, ViberIcon } from "./Social";

const CALL_HREF = `tel:${CLINIC_TEL}`;
const WA_HREF = waLink(CLINIC_PHONES[0].e164);
const VIBER_HREF = viberLink(CLINIC_PHONES[0].e164);

function PhoneGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const appPill = (bg: string): React.CSSProperties => ({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  background: bg,
  color: "#ffffff",
  borderRadius: 999,
  padding: "14px 12px",
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
});

const closeBtn: React.CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  width: 34,
  height: 34,
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(251,251,251,0.08)",
  color: "rgba(251,251,251,0.72)",
  border: "none",
  cursor: "pointer",
};

/**
 * The single "call us" affordance used in the header, hero and contact footer.
 *
 * You can't dial a `tel:` link from a desktop, so on DESKTOP the button opens a
 * CENTERED MODAL (portaled to <body> so it sits above every section AND the
 * fixed Cazuri video overlay, z6/nav z100) with a frosted-blur backdrop, the
 * number to call from a phone, and WhatsApp/Viber shortcuts. On MOBILE it's a
 * plain `tel:` link that dials. Both are rendered and toggled by CSS
 * (`.cta-call-mobile` / `.cta-call-desktop`) so it's SSR-safe and the label
 * differs per width ("Contactează-ne" desktop, "Sună acum" mobile).
 *
 * Open/close is driven by two states + CSS transitions (NOT framer-motion's
 * AnimatePresence, which flakes on unmounting an exit animation inside a
 * portal): `render` keeps the node mounted; `shown` toggles the enter/leave
 * transition; the backdrop's opacity `transitionend` unmounts on close.
 *
 * `style` sets the shared button visual (each call site passes its own look).
 */
export default function CallButton({
  style,
  wrapperStyle,
  iconSize = 16,
}: {
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  iconSize?: number;
}) {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const [render, setRender] = useState(false); // in the DOM (through the leave anim)
  const [shown, setShown] = useState(false); // drives the enter/leave transition
  const rafRef = useRef<number>(0);
  const closeTimer = useRef<number>(0);

  useEffect(() => setMounted(true), []);

  const openModal = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = 0;
    }
    if (render) setShown(true); // reopened mid-close → reverse the leave
    else setRender(true); // fresh open → the enter effect animates it in
  };
  // Leave: play the transition, then unmount after it (a timeout, NOT
  // transitionend — background/headless tabs don't reliably fire transitionend).
  const closeModal = () => {
    setShown(false);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = 0;
      setRender(false);
    }, 340);
  };

  // fade/scale IN once the node is in the DOM (double-rAF so the browser paints
  // the initial hidden state first, then transitions to shown).
  useEffect(() => {
    if (!render) return;
    rafRef.current = requestAnimationFrame(() =>
      requestAnimationFrame(() => setShown(true)),
    );
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Esc closes while open.
  useEffect(() => {
    if (!render) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [render]);

  const modal =
    mounted && render
      ? createPortal(
          <div
            onMouseDown={closeModal}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000, // above the Cazuri video overlay (z6) and nav (z100)
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              opacity: shown ? 1 : 0,
              background: shown ? "rgba(10,13,18,0.5)" : "rgba(10,13,18,0)",
              backdropFilter: shown ? "blur(12px)" : "blur(0px)",
              WebkitBackdropFilter: shown ? "blur(12px)" : "blur(0px)",
              transition:
                "opacity 0.25s ease, background 0.25s ease, backdrop-filter 0.25s ease, -webkit-backdrop-filter 0.25s ease",
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              onMouseDown={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "min(440px, 92vw)",
                background: "rgba(22,27,34,0.98)",
                border: "1px solid rgba(251,251,251,0.12)",
                borderRadius: 24,
                padding: "34px 30px 30px",
                boxShadow: "0 40px 100px rgba(8,11,16,0.6)",
                color: "#fbfbfb",
                textAlign: "left",
                opacity: shown ? 1 : 0,
                transform: shown ? "translateY(0) scale(1)" : "translateY(14px) scale(0.93)",
                transition:
                  "opacity 0.24s ease, transform 0.34s cubic-bezier(0.34, 1.28, 0.64, 1)",
              }}
            >
              <button type="button" onClick={closeModal} aria-label="Închide" style={closeBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>

              <div
                style={{
                  fontSize: 13,
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
                  display: "inline-block",
                  marginTop: 8,
                  color: "#fbfbfb",
                  fontSize: 34,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  textDecoration: "none",
                }}
              >
                {CLINIC_PHONE}
              </a>

              <div
                style={{
                  margin: "26px 0 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "rgba(251,251,251,0.45)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span style={{ flex: 1, height: 1, background: "rgba(251,251,251,0.12)" }} />
                {t.common.orWrite}
                <span style={{ flex: 1, height: 1, background: "rgba(251,251,251,0.12)" }} />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <a href={WA_HREF} target="_blank" rel="noopener noreferrer" style={appPill("#25D366")}>
                  <WhatsAppIcon size={20} />
                  WhatsApp
                </a>
                <a href={VIBER_HREF} target="_blank" rel="noopener noreferrer" style={appPill("#7360F2")}>
                  <ViberIcon size={20} />
                  Viber
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <span style={{ position: "relative", display: "inline-flex", ...wrapperStyle }}>
      <a className="cta-call cta-call-mobile" href={CALL_HREF} style={style}>
        <PhoneGlyph size={iconSize} />
        {t.common.callNow}
      </a>
      <button
        type="button"
        className="cta-call cta-call-desktop"
        aria-haspopup="dialog"
        aria-expanded={render}
        onClick={openModal}
        style={{ border: "none", ...style, cursor: "pointer", fontFamily: "inherit" }}
      >
        <PhoneGlyph size={iconSize} />
        {t.common.contactUs}
      </button>

      {modal}
    </span>
  );
}
