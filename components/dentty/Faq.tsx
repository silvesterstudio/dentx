"use client";

import { useState } from "react";
import { useContent } from "./LanguageProvider";

// FAQ accordion — a light section (matches the Servicii/Recenzii light blocks:
// #fbfbfb bg, #28323f ink, Manrope, the same clamp() heading scale and `.reveal`
// scroll-in). Placed after Contact so it never interferes with the Cazuri video
// lift (which reveals Contact). The open row expands via a grid-rows 0fr→1fr
// transition — smooth, no JS height measuring.
export default function Faq() {
  const t = useContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      data-screen-label="FAQ"
      style={{
        position: "relative",
        zIndex: 5,
        background: "#fbfbfb",
        boxSizing: "border-box",
        padding: "clamp(56px, 7vw, 104px) clamp(20px, 2.4vw, 44px)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <div className="reveal">
          <div
            style={{
              display: "inline-block",
              color: "rgba(40,50,63,0.55)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {t.faq.eyebrow}
          </div>
          <h2
            style={{
              margin: 0,
              color: "#28323f",
              fontSize: "clamp(34px, 4.2vw, 68px)",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
            }}
          >
            {t.faq.title}
          </h2>
          <p
            style={{
              margin: "16px 0 0",
              maxWidth: 620,
              color: "rgba(40,50,63,0.68)",
              fontSize: "clamp(15px, 1.1vw, 18px)",
              lineHeight: 1.5,
            }}
          >
            {t.faq.subtitle}
          </p>
        </div>

        <div style={{ marginTop: "clamp(28px, 3.5vw, 52px)" }}>
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="reveal"
                style={{
                  borderTop: "1px solid rgba(40,50,63,0.12)",
                  borderBottom:
                    i === t.faq.items.length - 1 ? "1px solid rgba(40,50,63,0.12)" : "none",
                  transitionDelay: `${0.03 + i * 0.04}s`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  style={{
                    all: "unset",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 20,
                    width: "100%",
                    cursor: "pointer",
                    padding: "clamp(20px, 2.4vw, 28px) 4px",
                  }}
                >
                  <span
                    style={{
                      color: "#28323f",
                      fontSize: "clamp(16px, 1.35vw, 21px)",
                      fontWeight: 600,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.q}
                  </span>
                  {/* plus → × rotate on open */}
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      border: "1px solid rgba(40,50,63,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#28323f",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>

                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.34s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  <div style={{ overflow: "hidden" }}>
                    <p
                      style={{
                        margin: 0,
                        padding: "0 4px clamp(20px, 2.4vw, 28px)",
                        maxWidth: 680,
                        color: "rgba(40,50,63,0.72)",
                        fontSize: "clamp(15px, 1.05vw, 17px)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
