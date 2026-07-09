"use client";

import { useEffect, useRef, useState } from "react";
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
  gap: 8,
  background: bg,
  color: "#ffffff",
  borderRadius: 999,
  padding: "11px 12px",
  fontSize: 13.5,
  fontWeight: 600,
  textDecoration: "none",
});

/**
 * The single "call us" affordance used in the header, hero and contact footer.
 *
 * You can't dial a `tel:` link from a desktop, so on DESKTOP the button opens a
 * small popover with the number to call from a phone + WhatsApp/Viber shortcuts,
 * and its label reads "Contactează-ne". On MOBILE it's a plain `tel:` link that
 * dials, labelled "Sună acum". Both are rendered and toggled by CSS
 * (`.cta-call-mobile` / `.cta-call-desktop`) so it's SSR-safe (no hydration
 * mismatch) and the label naturally differs per width.
 *
 * `style` sets the shared button visual (each call site passes its own look).
 */
export default function CallButton({
  style,
  wrapperStyle,
  iconSize = 16,
  align = "left",
  dropUp = false,
}: {
  style?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
  iconSize?: number;
  align?: "left" | "right";
  dropUp?: boolean;
}) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const popover: React.CSSProperties = {
    position: "absolute",
    ...(dropUp ? { bottom: "calc(100% + 12px)" } : { top: "calc(100% + 12px)" }),
    ...(align === "right" ? { right: 0 } : { left: 0 }),
    width: 268,
    background: "rgba(20,25,31,0.94)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(251,251,251,0.14)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 24px 60px rgba(8,11,16,0.5)",
    zIndex: 80,
    textAlign: "left",
    cursor: "auto",
  };

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", ...wrapperStyle }}>
      <a className="cta-call cta-call-mobile" href={CALL_HREF} style={style}>
        <PhoneGlyph size={iconSize} />
        {t.common.callNow}
      </a>
      <button
        type="button"
        className="cta-call cta-call-desktop"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{ border: "none", ...style, cursor: "pointer", fontFamily: "inherit" }}
      >
        <PhoneGlyph size={iconSize} />
        {t.common.contactUs}
      </button>

      {open && (
        <div style={popover}>
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

          <div style={{ margin: "16px 0 12px", fontSize: 12, fontWeight: 500, color: "rgba(251,251,251,0.5)" }}>
            {t.common.orWrite}
          </div>
          <div style={{ display: "flex", gap: 9 }}>
            <a href={WA_HREF} target="_blank" rel="noopener noreferrer" style={appPill("#25D366")}>
              <WhatsAppIcon size={17} />
              WhatsApp
            </a>
            <a href={VIBER_HREF} target="_blank" rel="noopener noreferrer" style={appPill("#7360F2")}>
              <ViberIcon size={17} />
              Viber
            </a>
          </div>
        </div>
      )}
    </span>
  );
}
