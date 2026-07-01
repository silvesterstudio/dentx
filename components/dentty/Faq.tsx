"use client";

import { useState } from "react";
import { useContent } from "./LanguageProvider";

// FAQ — matches the site's wide, editorial, multi-column light sections
// (MainSection's clinic grid, Reviews' 3-col grid): same 1760 container, the same
// clamp(20px,2.4vw,44px) side padding + clamp(56px,7vw,96px) vertical rhythm, the
// same h2 scale (clamp(40px,4.6vw,84px)/500/-0.03em/#28323f), and no redundant
// eyebrow (Services/Reviews use none). Two columns on desktop — heading on the
// left, accordion on the right — collapsing to one column on mobile (globals.css).
// Sits in the non-sticky white flow between Clinica and the Team sweep.
export default function Faq() {
  const t = useContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      data-screen-label="FAQ"
      style={{
        position: "relative",
        zIndex: 2,
        background: "#fbfbfb",
        boxSizing: "border-box",
        padding: "clamp(56px, 7vw, 96px) clamp(20px, 2.4vw, 44px)",
      }}
    >
      <div style={{ maxWidth: 1760, margin: "0 auto", width: "100%" }}>
        <div
          className="faq-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "clamp(28px, 4vw, 96px)",
            alignItems: "start",
          }}
        >
          {/* LEFT — heading + intro (matches the site's top-left heading language) */}
          <div className="reveal">
            <h2
              style={{
                margin: 0,
                color: "#28323f",
                fontSize: "clamp(40px, 4.6vw, 84px)",
                fontWeight: 500,
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
              }}
            >
              {t.faq.title}
            </h2>
            <p
              style={{
                margin: "clamp(16px, 1.6vw, 24px) 0 0",
                maxWidth: "34ch",
                color: "rgba(40,50,63,0.6)",
                fontSize: "clamp(15px, 1.05vw, 17px)",
                lineHeight: 1.55,
              }}
            >
              {t.faq.subtitle}
            </p>
          </div>

          {/* RIGHT — accordion */}
          <div>
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
                      padding: "clamp(20px, 2vw, 26px) 2px",
                    }}
                  >
                    <span
                      style={{
                        color: "#28323f",
                        fontSize: "clamp(17px, 1.3vw, 21px)",
                        fontWeight: 600,
                        lineHeight: 1.3,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        width: 36,
                        height: 36,
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
                          padding: "0 2px clamp(22px, 2.2vw, 30px)",
                          maxWidth: "62ch",
                          color: "rgba(40,50,63,0.72)",
                          fontSize: "clamp(15px, 1.05vw, 17px)",
                          lineHeight: 1.62,
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
      </div>
    </section>
  );
}
