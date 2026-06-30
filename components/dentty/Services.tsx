"use client";

import { useState } from "react";
import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";
import ServiceModal from "./ServiceModal";
import AutoplayVideo from "./AutoplayVideo";
import type { CSSProperties } from "react";

// Scroll distance (svh) the bento stays pinned while the video expands. The
// expand driver in CaseStudies derives this from the section height (height - vh).
const PIN_VH = 80;

// Asymmetric "out of the box" bento: a TALL feature tile (left) + two WIDE tiles
// (top) + six SMALL tiles, with the VIDEO tile as a compact square-ish tall card
// in the bottom-right. Low so jumping to Servicii leaves it below screen-centre
// and it only expands once scrolled up.
// 12-col × 3-row grid; rows in vh so all of Servicii fits one screen.
//   row1:  heading(1-5)        │ wide(5-9)  │ wide(9-13)
//   row2:  TALL(1-4) │ sm(4-6) │ sm(6-8) │ sm(8-10) │ VIDEO(10-13)
//   row3:  TALL(cont)│ sm(4-6) │ sm(6-8) │ sm(8-10) │ VIDEO(cont)
// PLACE[i] maps to t.services.items[i] (9 services). Cells are assigned so the
// longest names land in the tall/wide tiles and short ones in the small tiles.
const PLACE: CSSProperties[] = [
  { gridColumn: "1 / 4", gridRow: "2 / 4" }, // 0 — TALL, left (spans 2 rows)
  { gridColumn: "5 / 9", gridRow: "1" }, //     1 — wide, top
  { gridColumn: "4 / 6", gridRow: "3" }, //     2 — small
  { gridColumn: "6 / 8", gridRow: "2" }, //     3 — small
  { gridColumn: "9 / 13", gridRow: "1" }, //    4 — wide, top-right
  { gridColumn: "6 / 8", gridRow: "3" }, //     5 — small
  { gridColumn: "4 / 6", gridRow: "2" }, //     6 — small
  { gridColumn: "8 / 10", gridRow: "2" }, //    7 — small
  { gridColumn: "8 / 10", gridRow: "3" }, //    8 — small (Reabilitare totală)
];

export default function Services() {
  const t = useContent();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const openItem = openIdx !== null ? t.services.items[openIdx] : null;

  return (
    <>
    <section
      id="services"
      data-screen-label="Servicii"
      style={{
        position: "relative",
        // Tall section whose inner stage PINS (sticky): the video expands while
        // the bento stays put, so the page doesn't visually scroll during the
        // expand — and the expand starts right at the Servicii-link landing.
        // The extra PIN_VH of height is the scroll the expand scrubs over.
        height: `calc(100svh + ${PIN_VH}svh)`,
      }}
    >
      <div
        id="services-stage"
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          boxSizing: "border-box",
          overflow: "hidden",
          padding:
            "clamp(108px, 14vh, 156px) clamp(20px, 2.4vw, 44px) clamp(28px, 4vh, 48px)",
        }}
      >
        <div style={{ maxWidth: 1760, margin: "0 auto", width: "100%" }}>
        <div
          id="services-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            // 3 equal rows sized in vh so all of Servicii fits in one viewport.
            gridTemplateRows: "repeat(3, clamp(150px, 20vh, 230px))",
            gap: "clamp(10px, 1vw, 16px)",
          }}
        >
          {/* heading tile, top-left */}
          <h2
            className="reveal"
            style={{
              gridColumn: "1 / 5",
              gridRow: "1",
              alignSelf: "start",
              margin: 0,
              color: "#28323f",
              fontSize: "clamp(40px, 4.6vw, 80px)",
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
            }}
          >
            {t.services.title}
          </h2>

          {/* service cards */}
          {t.services.items.map((item, i) => (
            <div
              key={i}
              className="svc-card reveal"
              data-svc={i}
              onClick={() => setOpenIdx(i)}
              style={{
                ...PLACE[i],
                position: "relative",
                borderRadius: 18,
                overflow: "hidden",
                background: "#1d242d",
                minWidth: 0,
                transitionDelay: `${0.05 + i * 0.06}s`,
                cursor: "pointer",
              }}
            >
              <ImageSlot src={`/${i + 1}.webp`} caption={item.name} shape="rect" dark showLabel={false} />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(180deg, rgba(22,27,34,0.3) 0%, rgba(22,27,34,0) 24%, rgba(22,27,34,0) 42%, rgba(22,27,34,0.8) 100%)",
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
                <div
                  style={{
                    color: "#fbfbfb",
                    fontSize: "clamp(14px, 1.1vw, 19px)",
                    fontWeight: 600,
                    lineHeight: 1.15,
                  }}
                >
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

          {/* VIDEO tile — bottom-right, wide. SAME card that scrubs out to a
              fullscreen video as you scroll (the expand is driven from
              CaseStudies, which renders a fixed clone of this — #cazuri-overlay).
              Placed low so jumping to Servicii doesn't land it at screen-centre
              and auto-trigger the expand. */}
          <div
            id="quote-tile"
            className="reveal"
            style={{
              gridColumn: "10 / 13",
              gridRow: "2 / 4",
              position: "relative",
              borderRadius: 18,
              overflow: "hidden",
              background: "#28323f",
              minWidth: 0,
              // reveals in just after the last service card (cards end ~0.47s)
              transitionDelay: "0.5s",
            }}
          >
            {/* Preview is STATIC (controlled = never auto-plays) — it shows the
                poster still. The clip only ever plays once it has expanded to
                fullscreen (see CaseStudies). So no video decodes in the bento or
                during the morph — only when it's the full-screen feature. */}
            <AutoplayVideo
              className="qt-video"
              controlled
              poster="/clinic-office.webp"
              src="/video-card.mp4"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {/* same dark gradient the video carries when it expands, so the
                tile reads consistently before and during the morph */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg, rgba(16,20,26,0.55) 0%, rgba(16,20,26,0.15) 32%, rgba(16,20,26,0.35) 62%, rgba(16,20,26,0.82) 100%)",
              }}
            />
          </div>
        </div>
      </div>
      </div>
    </section>

    {openItem && (
      <ServiceModal
        name={openItem.name}
        tagline={openItem.tagline}
        details={openItem.details}
        onClose={() => setOpenIdx(null)}
      />
    )}
    </>
  );
}
