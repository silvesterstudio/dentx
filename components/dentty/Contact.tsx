"use client";

import {
  CLINIC_PHONES,
  CLINIC_TEL,
  CLINIC_EMAIL,
  CLINIC_LEGAL,
  MAP_EMBED_SRC,
  waLink,
  viberLink,
} from "@/lib/constants";
import { useContent } from "./LanguageProvider";
import Logo from "./Logo";
import { WhatsAppIcon, ViberIcon } from "./Social";

const CALL_HREF = `tel:${CLINIC_TEL}`;

const DETAIL_LABEL = {
  color: "rgba(251,251,251,0.5)",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
} as const;

const DETAIL_VALUE = {
  color: "#fbfbfb",
  fontSize: "clamp(16px, 1.3vw, 19px)",
  fontWeight: 500,
  textDecoration: "none",
} as const;

function AppButton({
  href,
  label,
  bg,
  children,
}: {
  href: string;
  label: string;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </a>
  );
}

export default function Contact() {
  const t = useContent();

  return (
    <section
      id="contact"
      data-screen-label="Contact"
      style={{
        position: "relative",
        zIndex: 7,
        background: "#14191f",
        borderRadius: "28px 28px 0 0",
        minHeight: "100svh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        padding: "clamp(28px, 4vw, 64px) clamp(20px, 2.4vw, 44px) clamp(28px, 3vw, 44px)",
      }}
    >
      <div
        style={{
          maxWidth: 1760,
          margin: "0 auto",
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ color: "rgba(251,251,251,0.55)", fontSize: 13, fontWeight: 500 }}>
          {t.contact.eyebrow}
        </div>
        <h2
          style={{
            margin: "10px 0 0",
            color: "#fbfbfb",
            fontSize: "clamp(40px, 4.6vw, 84px)",
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
          }}
        >
          {t.contact.title}
        </h2>

        <div
          id="contact-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(20px, 2.4vw, 40px)",
            marginTop: "clamp(28px, 3.2vw, 48px)",
            alignItems: "stretch",
          }}
        >
          {/* details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 2.2vw, 30px)" }}>
            <div>
              <div style={DETAIL_LABEL}>{t.contact.phoneLabel}</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 12 }}>
                {CLINIC_PHONES.map((p) => (
                  <div
                    key={p.e164}
                    style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
                  >
                    <a href={`tel:+${p.e164}`} style={DETAIL_VALUE}>
                      {p.display}
                    </a>
                    <div style={{ display: "flex", gap: 8 }}>
                      <AppButton href={waLink(p.e164)} label="WhatsApp" bg="#25D366">
                        <WhatsAppIcon size={18} />
                      </AppButton>
                      <AppButton href={viberLink(p.e164)} label="Viber" bg="#7360F2">
                        <ViberIcon size={18} />
                      </AppButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={DETAIL_LABEL}>{t.contact.emailLabel}</div>
              <a
                href={`mailto:${CLINIC_EMAIL}`}
                style={{ ...DETAIL_VALUE, display: "block", marginTop: 8 }}
              >
                {CLINIC_EMAIL}
              </a>
            </div>
            <div>
              <div style={DETAIL_LABEL}>{t.contact.addressLabel}</div>
              <div style={{ ...DETAIL_VALUE, marginTop: 8 }}>{t.contact.address}</div>
            </div>
            <div>
              <div style={DETAIL_LABEL}>{t.contact.hoursLabel}</div>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                {t.contact.hours.map((h) => (
                  <div
                    key={h.days}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: 320,
                      color: "rgba(251,251,251,0.82)",
                      fontSize: 14,
                    }}
                  >
                    <span>{h.days}</span>
                    <span style={{ color: "rgba(251,251,251,0.6)" }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 4 }}>
              <a
                href={CALL_HREF}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fbfbfb",
                  color: "#14191f",
                  borderRadius: 999,
                  padding: "15px 28px",
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {t.common.book}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#14191f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* map */}
          <div
            style={{
              borderRadius: 18,
              overflow: "hidden",
              minHeight: "clamp(280px, 30vw, 420px)",
            }}
          >
            <iframe
              src={MAP_EMBED_SRC}
              title={t.contact.mapCaption}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "clamp(280px, 30vw, 420px)",
                border: 0,
                display: "block",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 36 }} />

        {/* footer */}
        <div
          style={{
            marginTop: "clamp(36px, 4vw, 64px)",
            paddingTop: 24,
            borderTop: "1px solid rgba(251,251,251,0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Logo height={26} />
          <div style={{ color: "rgba(251,251,251,0.5)", fontSize: 13 }}>
            © {CLINIC_LEGAL}. {t.contact.rights}
          </div>
        </div>
      </div>
    </section>
  );
}
