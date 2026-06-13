"use client";

import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";

export default function Reviews({ top }: { top: string }) {
  const t = useContent();

  return (
    <section
      id="reviews"
      data-screen-label="Reviews"
      style={{
        position: "sticky",
        top,
        zIndex: 6,
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
        <div>
          <div style={{ color: "rgba(251,251,251,0.55)", fontSize: 13, fontWeight: 500 }}>
            {t.reviews.eyebrow}
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
            {t.reviews.title}
          </h2>
        </div>

        <div
          id="reviews-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 1.6vw, 24px)",
            marginTop: "clamp(24px, 3vw, 44px)",
          }}
        >
          {t.reviews.items.map((r) => (
            <article
              key={r.name}
              style={{
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                aspectRatio: "3 / 4",
                background: "#1d242d",
              }}
            >
              <ImageSlot caption={`${t.reviews.videoLabel} — ${r.name}`} shape="rect" dark />

              {/* readability gradient */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg, rgba(20,25,31,0.35) 0%, rgba(20,25,31,0) 32%, rgba(20,25,31,0) 52%, rgba(20,25,31,0.78) 100%)",
                }}
              />

              {/* play button */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "rgba(251,251,251,0.92)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(8,11,16,0.35)",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#14191f">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>

              {/* name + role */}
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  right: 18,
                  bottom: 16,
                  pointerEvents: "none",
                }}
              >
                <div style={{ color: "#fbfbfb", fontSize: 17, fontWeight: 700 }}>
                  {r.name}
                </div>
                <div
                  style={{
                    color: "rgba(251,251,251,0.75)",
                    fontSize: 13,
                    marginTop: 3,
                  }}
                >
                  {r.role}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
