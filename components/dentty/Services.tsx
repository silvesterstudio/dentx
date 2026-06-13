"use client";

import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";

export default function Services({ top }: { top: string }) {
  const t = useContent();

  return (
    <section
      id="services"
      data-screen-label="Services"
      style={{
        position: "sticky",
        top,
        zIndex: 4,
        background: "#28323f",
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
        <div style={{ color: "rgba(251,251,251,0.55)", fontSize: 13, fontWeight: 500 }}>
          {t.services.eyebrow}
        </div>
        <h2
          style={{
            margin: "10px 0 clamp(24px, 3vw, 44px)",
            color: "#fbfbfb",
            fontSize: "clamp(40px, 4.6vw, 84px)",
            fontWeight: 500,
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
          }}
        >
          {t.services.title}
        </h2>

        <div
          id="services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(14px, 1.4vw, 20px)",
          }}
        >
          {t.services.items.map((item, i) => (
            <div
              key={item.name}
              className="svc-card"
              style={{
                position: "relative",
                borderRadius: 18,
                overflow: "hidden",
                aspectRatio: "4 / 3",
                background: "#1d242d",
              }}
            >
              <ImageSlot caption={item.name} shape="rect" dark />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg, rgba(22,27,34,0.25) 0%, rgba(22,27,34,0) 26%, rgba(22,27,34,0) 44%, rgba(22,27,34,0.78) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: 16,
                  color: "#fbfbfb",
                  fontSize: 13,
                  pointerEvents: "none",
                }}
              >
                [{i + 1}]
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  top: 14,
                  color: "#fbfbfb",
                  fontSize: 18,
                  pointerEvents: "none",
                }}
              >
                ↗
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  bottom: 16,
                  pointerEvents: "none",
                }}
              >
                <div style={{ color: "#fbfbfb", fontSize: 19, fontWeight: 600 }}>
                  {item.name}
                </div>
                <div
                  className="svc-desc"
                  style={{
                    color: "rgba(251,251,251,0.78)",
                    fontSize: 13,
                    lineHeight: 1.45,
                  }}
                >
                  {item.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
