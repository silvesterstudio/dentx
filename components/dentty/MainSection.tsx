"use client";

import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";

const HEADING = {
  margin: "10px 0 0",
  color: "#28323f",
  fontSize: "clamp(40px, 4.6vw, 84px)",
  fontWeight: 500,
  lineHeight: 0.98,
  letterSpacing: "-0.03em",
} as const;

const EYEBROW = {
  color: "rgba(40,50,63,0.6)",
  fontSize: 13,
  fontWeight: 500,
} as const;

const ABOUT_PHOTOS = [
  "/clinic-radiology.webp",
  "/clinic-reception.webp",
  "/clinic-office.webp",
];

export default function MainSection() {
  const t = useContent();

  const aboutCaptions = [
    t.about.photoRadiology,
    t.about.photoReception,
    t.about.photoOffice,
  ];

  return (
    <section
      id="main"
      style={{
        // Relative (not sticky): Clinica scrolls continuously up and out, and
        // the team rises into its place — no overlay between them, so the two
        // read as one continuous block. The team (#team) is the sticky layer
        // that pins for the sweep and gets slid over by Servicii.
        position: "relative",
        zIndex: 2,
        background: "#fbfbfb",
        borderRadius: "28px 28px 0 0",
        minHeight: "100svh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: 0,
        padding:
          "clamp(28px, 4vw, 64px) clamp(20px, 2.4vw, 44px) clamp(40px, 5vw, 80px)",
      }}
    >
      <div id="clinic" data-screen-label="About Us" style={{ maxWidth: 1760, margin: "0 auto", width: "100%" }}>
        {/* Row 1: heading + meta */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "clamp(16px, 1.6vw, 28px)",
            alignItems: "end",
            marginBottom: "clamp(16px, 1.6vw, 24px)",
          }}
        >
          <div style={{ gridColumn: "1 / 3" }}>
            <div style={EYEBROW}>{t.about.eyebrow}</div>
            <h2 style={HEADING}>{t.about.title}</h2>
          </div>
          <div style={{ textAlign: "right", ...EYEBROW, paddingBottom: 4 }}>
            {t.about.since}
          </div>
        </div>

        {/* Row 2: 3 images side-by-side, all 16:9 */}
        <div
          id="clinic-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "clamp(12px, 1.4vw, 20px)",
          }}
        >
          {aboutCaptions.map((caption, i) => (
            <div key={caption} style={{ width: "100%", aspectRatio: "16 / 9" }}>
              <ImageSlot caption={caption} shape="rounded" radius={16} src={ABOUT_PHOTOS[i]} />
            </div>
          ))}
        </div>

        {/* Row 3: text captions below images */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "clamp(12px, 1.4vw, 20px)",
            marginTop: "clamp(18px, 2vw, 28px)",
            alignItems: "start",
          }}
        >
          <div>
            <div style={{ color: "#28323f", fontSize: 15, fontWeight: 700 }}>
              {t.about.expertiseTitle}
            </div>
            <p
              style={{
                color: "rgba(40,50,63,0.72)",
                fontSize: 13.5,
                lineHeight: 1.6,
                margin: "10px 0 0",
                textWrap: "pretty",
              }}
            >
              {t.about.expertiseText}
            </p>
          </div>
          <div>
            <div style={{ color: "#28323f", fontSize: 15, fontWeight: 700 }}>
              {t.about.careTitle}
            </div>
            <p
              style={{
                color: "rgba(40,50,63,0.72)",
                fontSize: 13.5,
                lineHeight: 1.6,
                margin: "10px 0 0",
                textWrap: "pretty",
              }}
            >
              {t.about.careText}
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
            <a
              href="#services"
              style={{
                background: "#28323f",
                color: "#fbfbfb",
                borderRadius: 12,
                padding: "14px 26px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {t.common.viewMore} <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
