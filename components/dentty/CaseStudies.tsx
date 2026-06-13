"use client";

import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";

const SLOT_LABEL = {
  position: "absolute",
  left: 10,
  top: 10,
  background: "rgba(20,25,31,0.72)",
  color: "#fbfbfb",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.02em",
  padding: "4px 9px",
  borderRadius: 999,
  pointerEvents: "none",
} as const;

export default function CaseStudies({ top }: { top: string }) {
  const t = useContent();

  return (
    <section
      id="cases"
      data-screen-label="Case Studies"
      style={{
        position: "sticky",
        top,
        zIndex: 5,
        background: "#fbfbfb",
        borderRadius: "28px 28px 0 0",
        minHeight: "100svh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding:
          "clamp(28px, 4vw, 64px) clamp(20px, 2.4vw, 44px) clamp(40px, 5vw, 80px)",
      }}
    >
      <div style={{ maxWidth: 1760, margin: "0 auto", width: "100%" }}>
        <div style={{ color: "rgba(40,50,63,0.6)", fontSize: 13, fontWeight: 500 }}>
          {t.cases.eyebrow}
        </div>
        <h2
          style={{
            margin: "10px 0 0",
            color: "#28323f",
            fontSize: "clamp(40px, 4.6vw, 84px)",
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
          }}
        >
          {t.cases.title}
        </h2>

        <div
          id="cases-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 1.6vw, 24px)",
            marginTop: "clamp(24px, 3vw, 44px)",
          }}
        >
          {t.cases.items.map((c) => (
            <article
              key={c.title}
              style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 14,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                boxShadow:
                  "0 1px 2px rgba(20,25,31,0.04), 0 14px 36px rgba(20,25,31,0.06)",
              }}
            >
              {/* before / after — one image per row, stacked */}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16 / 9",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "#eceef0",
                    }}
                  >
                    <ImageSlot caption={`${c.title} — ${t.cases.before}`} shape="rect" />
                    <span style={SLOT_LABEL}>{t.cases.before}</span>
                  </div>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16 / 9",
                      borderRadius: 14,
                      overflow: "hidden",
                      background: "#eceef0",
                    }}
                  >
                    <ImageSlot caption={`${c.title} — ${t.cases.after}`} shape="rect" />
                    <span style={{ ...SLOT_LABEL, background: "#1f7a52" }}>
                      {t.cases.after}
                    </span>
                  </div>
                </div>

                {/* transition indicator centered on the seam */}
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#28323f",
                    color: "#fbfbfb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "3px solid #ffffff",
                    boxShadow: "0 6px 16px rgba(20,25,31,0.28)",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </span>
              </div>

              <span
                style={{
                  alignSelf: "flex-start",
                  marginTop: 18,
                  background: "rgba(40,50,63,0.08)",
                  color: "#28323f",
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: 999,
                }}
              >
                {c.tag}
              </span>
              <h3
                style={{
                  margin: "12px 0 0",
                  color: "#28323f",
                  fontSize: "clamp(20px, 1.6vw, 24px)",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {c.title}
              </h3>
              <p
                style={{
                  color: "rgba(40,50,63,0.7)",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                  margin: "10px 0 0",
                  textWrap: "pretty",
                }}
              >
                {c.result}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
