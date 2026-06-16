"use client";

import { useEffect } from "react";
import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";

const HEADING = {
  margin: 0,
  color: "#28323f",
  fontSize: "clamp(40px, 5vw, 88px)",
  fontWeight: 500,
  lineHeight: 0.96,
  letterSpacing: "-0.03em",
} as const;

const SINCE = {
  color: "rgba(40,50,63,0.55)",
  fontSize: 13,
  fontWeight: 500,
  whiteSpace: "nowrap",
} as const;

const BLOCK_TITLE = { color: "#28323f", fontSize: 16, fontWeight: 700 } as const;
const BLOCK_TEXT = {
  color: "rgba(40,50,63,0.72)",
  fontSize: 14,
  lineHeight: 1.6,
  margin: "10px 0 0",
  textWrap: "pretty",
} as const;

// Editorial 3-column collage matching the reference. Image frames (the user
// crops photos to these ratios): left 4:5, centre feature 5:6, right 1:1.
const PHOTOS: Record<string, string | undefined> = {
  radiology: "/clinic-radiology.webp", // left, 4:5
  reception: "/clinic-reception.webp", // centre feature, 5:6
  office: "/clinic-office.webp", // right, 1:1 (square)
  // Mobile-only extras (Clinica brick): Foto 4 (right col) and Foto 5 (left col).
  extra1: "/image-4.webp",
  extra2: "/image-5.webp",
};

export default function MainSection() {
  const t = useContent();

  // Mobile Clinica layout is selectable for review via ?cv=1..4 (default 1).
  useEffect(() => {
    const cv = new URLSearchParams(window.location.search).get("cv");
    const el = document.getElementById("clinic-grid");
    if (el) el.setAttribute("data-variant", cv && /^[1-5]$/.test(cv) ? cv : "5");
  }, []);

  return (
    <section
      id="main"
      style={{
        // Relative (not sticky): Clinica scrolls up and out and the team rises
        // into its place — the two read as one continuous block.
        position: "relative",
        zIndex: 2,
        background: "#fbfbfb",
        minHeight: "100svh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        margin: 0,
        padding:
          "clamp(100px, 13vh, 150px) clamp(20px, 2.4vw, 44px) clamp(56px, 7vw, 96px)",
      }}
    >
      <div id="clinic" style={{ maxWidth: 1500, margin: "0 auto", width: "100%" }}>
        <div
          id="clinic-grid"
          data-variant="5"
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.7fr 1fr",
            gap: "clamp(20px, 2.6vw, 48px)",
            // stretch so all columns share the tallest height — lets the side
            // text blocks bottom-align to the same line.
            alignItems: "stretch",
          }}
        >
          {/* COLUMN A — heading, then an image stepped down toward the bottom */}
          <div className="clinic-col" style={{ display: "flex", flexDirection: "column" }}>
            <h2 className="reveal" style={HEADING}>{t.about.title}</h2>
            <div
              data-cl="radiology"
              className="clinic-photo reveal-img"
              style={{ marginTop: "clamp(90px, 17vw, 250px)", aspectRatio: "4 / 5", transitionDelay: "0.05s" }}
            >
              <ImageSlot
                caption={t.about.photoRadiology}
                shape="rounded"
                radius={18}
                src={PHOTOS.radiology}
              />
            </div>
          </div>

          {/* COLUMN B — large feature image, Expertise below it */}
          <div className="clinic-col" style={{ display: "flex", flexDirection: "column" }}>
            <div data-cl="reception" className="clinic-photo reveal-img" style={{ aspectRatio: "5 / 6", transitionDelay: "0.12s" }}>
              <ImageSlot
                caption={t.about.photoReception}
                shape="rounded"
                radius={18}
                src={PHOTOS.reception}
              />
            </div>
            <div data-cl="expertise" className="clinic-text reveal" style={{ marginTop: "auto", paddingTop: "clamp(40px, 6vw, 96px)" }}>
              <div style={BLOCK_TITLE}>{t.about.expertiseTitle}</div>
              <p style={{ ...BLOCK_TEXT, maxWidth: "38ch" }}>{t.about.expertiseText}</p>
            </div>
          </div>

          {/* COLUMN C — "Din 2021", a square image stepped down, View more, Care */}
          <div className="clinic-col" style={{ display: "flex", flexDirection: "column" }}>
            <div data-cl="since" className="reveal" style={{ ...SINCE, textAlign: "right" }}>{t.about.since}</div>
            <div
              data-cl="office"
              className="clinic-photo reveal-img"
              style={{ marginTop: "clamp(70px, 12vw, 175px)", aspectRatio: "1 / 1", transitionDelay: "0.18s" }}
            >
              <ImageSlot
                caption={t.about.photoOffice}
                shape="rounded"
                radius={18}
                src={PHOTOS.office}
              />
            </div>
            <div data-cl="care" className="clinic-text reveal" style={{ marginTop: "auto", paddingTop: "clamp(36px, 5.5vw, 88px)" }}>
              <div style={BLOCK_TITLE}>{t.about.careTitle}</div>
              <p style={{ ...BLOCK_TEXT, maxWidth: "32ch" }}>{t.about.careText}</p>
            </div>

            {/* MOBILE-ONLY extra photos — fill the lower gap, same 3:4 pattern.
                Add real images by giving these slots a src (e.g. PHOTOS.extra1). */}
            <div data-cl="extra1" className="clinic-photo clinic-extra reveal-img" style={{ aspectRatio: "3 / 4" }}>
              <ImageSlot caption="Foto 4" shape="rounded" radius={18} src={PHOTOS.extra1} />
            </div>
            <div data-cl="extra2" className="clinic-photo clinic-extra reveal-img" style={{ aspectRatio: "3 / 4" }}>
              <ImageSlot caption="Foto 5" shape="rounded" radius={18} src={PHOTOS.extra2} />
            </div>
          </div>
        </div>

        {/* MOBILE collage — two INDEPENDENT flex columns so the right column can
            stagger: it starts at the MIDDLE of the first left photo (Experiență
            fills reception's top half, radiology begins at its midpoint). Desktop
            uses #clinic-grid above; this block shows only ≤980px. */}
        <div className="clinic-mobile" aria-hidden>
          <div className="cm-head">
            <h2 className="cm-title">{t.about.title}</h2>
            <span className="cm-since">{t.about.since}</span>
          </div>
          <div className="cm-cols">
            {/* LEFT column — 3 images (1·3·5) */}
            <div className="cm-col">
              <div className="cm-photo reveal-img">
                <ImageSlot caption={t.about.photoReception} shape="rounded" radius={18} src={PHOTOS.reception} />
              </div>
              <div className="cm-photo reveal-img">
                <ImageSlot caption={t.about.photoOffice} shape="rounded" radius={18} src={PHOTOS.office} />
              </div>
              <div className="cm-photo reveal-img">
                <ImageSlot caption="Foto 5" shape="rounded" radius={18} src={PHOTOS.extra2} />
              </div>
            </div>
            {/* RIGHT column — Experiență fills the top half, then 2 images (2·4)
                offset to the middles of the left images, Grijă beside Foto 5 */}
            <div className="cm-col">
              <div className="cm-text cm-expertise reveal">
                <div style={BLOCK_TITLE}>{t.about.expertiseTitle}</div>
                <p style={BLOCK_TEXT}>{t.about.expertiseText}</p>
              </div>
              <div className="cm-photo reveal-img">
                <ImageSlot caption={t.about.photoRadiology} shape="rounded" radius={18} src={PHOTOS.radiology} />
              </div>
              <div className="cm-photo reveal-img">
                <ImageSlot caption="Foto 4" shape="rounded" radius={18} src={PHOTOS.extra1} />
              </div>
              <div className="cm-text reveal">
                <div style={BLOCK_TITLE}>{t.about.careTitle}</div>
                <p style={BLOCK_TEXT}>{t.about.careText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
