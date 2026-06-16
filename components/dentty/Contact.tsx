"use client";

import {
  CLINIC_PHONES,
  CLINIC_TEL,
  CLINIC_EMAIL,
  waLink,
  viberLink,
} from "@/lib/constants";
import { useContent } from "./LanguageProvider";
import { WhatsAppIcon, ViberIcon } from "./Social";
import BookingForm from "./BookingForm";

const CALL_HREF = `tel:${CLINIC_TEL}`;
const MAPS_LINK = "https://maps.app.goo.gl/?q=Dent-X+Chisinau";

// The last section — a compact, footer-style "Contacte". It's a normal (shorter
// than fullscreen) block beneath the Cazuri video; the fixed video card lifts UP
// to reveal it (handled in CaseStudies). z-index 5 so it sits above #work (z4)
// but below the lifting video overlay (z6) — they're adjacent, never overlap.
export default function Contact() {
  const t = useContent();

  return (
    <section id="contact" data-screen-label="Contact" style={SECTION}>
      {/* dark lip extending above the section, so the lifting video's rounded
          bottom corners reveal this dark colour (not the white section behind). */}
      <div aria-hidden className="contact-lip" style={LIP} />
      <div style={INNER}>
        {/* top: invite + CTA */}
        <div style={TOP}>
          <div className="reveal" style={{ maxWidth: 520 }}>
            <h2 style={TITLE}>
              <span style={{ fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", fontWeight: 500 }}>
                {t.contact.title.split(" ")[0]}
              </span>
              {t.contact.title.split(" ").slice(1).length ? ` ${t.contact.title.split(" ").slice(1).join(" ")}` : ""}
            </h2>
            <p style={SUB}>{t.booking.subtitle}</p>
          </div>
          <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", transitionDelay: "0.1s" }}>
            <BookingForm />
            <a href={CALL_HREF} style={CALL_BTN}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {t.common.callNow}
            </a>
          </div>
        </div>

        <div style={DIVIDER} />

        {/* columns: details */}
        <div style={COLS}>
          <div className="reveal" style={{ transitionDelay: "0.05s" }}>
            <div style={LABEL}>{t.contact.phoneLabel}</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
              {CLINIC_PHONES.map((p) => (
                <div key={p.e164} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <a href={`tel:+${p.e164}`} style={VALUE}>{p.display}</a>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={waLink(p.e164)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{ ...APP, background: "#25D366" }}>
                      <WhatsAppIcon size={16} />
                    </a>
                    <a href={viberLink(p.e164)} target="_blank" rel="noopener noreferrer" aria-label="Viber" style={{ ...APP, background: "#7360F2" }}>
                      <ViberIcon size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ transitionDelay: "0.13s" }}>
            <div style={LABEL}>{t.contact.emailLabel}</div>
            <a href={`mailto:${CLINIC_EMAIL}`} style={{ ...VALUE, display: "block", marginTop: 10 }}>{CLINIC_EMAIL}</a>
            <div style={{ ...LABEL, marginTop: 18 }}>{t.contact.addressLabel}</div>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" style={{ ...VALUE, display: "block", marginTop: 10 }}>
              {t.contact.address}
            </a>
          </div>

          <div className="reveal" style={{ transitionDelay: "0.21s" }}>
            <div style={LABEL}>{t.contact.hoursLabel}</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
              {t.contact.hours.map((h) => (
                <div key={h.days} style={{ display: "flex", justifyContent: "space-between", gap: 18, color: "rgba(251,251,251,0.82)", fontSize: 14 }}>
                  <span>{h.days}</span>
                  <span style={{ color: "rgba(251,251,251,0.55)" }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Slate (lighter than the near-black video edges) so the lifting video's rounded
// corners read against it — mirrors the reference's lighter footer.
const CONTACT_BG = "#28323f";

const SECTION: React.CSSProperties = {
  position: "relative",
  zIndex: 5, // above #work (z4); below the lifting video overlay (z6)
  background: CONTACT_BG,
  boxSizing: "border-box",
};

// Slate panel extending a full screen ABOVE the section, so the lifting +
// shrinking video card reveals this Contacte colour around it (not the white
// cases section behind). It's behind the fixed video overlay (z6) the whole time
// it matters, so it never shows where it shouldn't.
const LIP: React.CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  top: "-100svh",
  height: "100svh",
  background: CONTACT_BG,
  pointerEvents: "none",
};

const INNER: React.CSSProperties = {
  maxWidth: 1500,
  margin: "0 auto",
  width: "100%",
  boxSizing: "border-box",
  padding: "clamp(44px, 6vh, 80px) clamp(20px, 4vw, 64px) clamp(28px, 3.5vh, 44px)",
};

const TOP: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: 28,
  flexWrap: "wrap",
};

const TITLE: React.CSSProperties = {
  margin: "10px 0 0",
  color: "#fbfbfb",
  fontSize: "clamp(34px, 3.6vw, 56px)",
  fontWeight: 700,
  lineHeight: 1.0,
  letterSpacing: "-0.03em",
};

const SUB: React.CSSProperties = {
  margin: "12px 0 0",
  color: "rgba(251,251,251,0.7)",
  fontSize: "clamp(15px, 1.1vw, 17px)",
  lineHeight: 1.5,
};

const CALL_BTN: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  background: "transparent",
  color: "#fbfbfb",
  border: "1px solid rgba(251,251,251,0.3)",
  borderRadius: 999,
  padding: "15px 26px",
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
};

const DIVIDER: React.CSSProperties = {
  height: 1,
  background: "rgba(251,251,251,0.12)",
  margin: "clamp(26px, 3.5vh, 44px) 0",
};

const COLS: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "28px 40px",
};

const LABEL: React.CSSProperties = {
  color: "rgba(251,251,251,0.5)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const VALUE: React.CSSProperties = {
  color: "#fbfbfb",
  fontSize: "clamp(16px, 1.1vw, 18px)",
  fontWeight: 500,
  textDecoration: "none",
};

const APP: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: "50%",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
