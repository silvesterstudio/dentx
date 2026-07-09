"use client";

import { useContent } from "./LanguageProvider";
import { CLINIC_TEL } from "@/lib/constants";

export default function Hero() {
  const t = useContent();

  return (
    <section
      id="home"
      data-screen-label="Hero"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        height: "100svh",
        boxSizing: "border-box",
        overflow: "hidden",
        background: "#14191f",
      }}
    >
      {/* full-bleed image */}
      <div
        id="hero-img-box"
        className="hero-img-reveal"
        style={{ position: "absolute", inset: 0 }}
      >
        <picture>
          {/* dedicated mobile hero photo (≤980px); both are full-bleed cover */}
          <source media="(max-width: 980px)" srcSet="/hero-mobile.webp" />
          <img
            src="/hero-desktop.webp"
            alt="Clinică stomatologică Dent X în Chișinău"
            decoding="async"
            fetchPriority="high"
            className="hero-fg"
          />
        </picture>
        {/* Pre-blurred copy of the hero photo (hero-desktop-blur.webp, generated
            offline). The desktop cover-blur used to be a live filter: blur() on
            the whole section — a full-viewport gaussian re-applied by the GPU
            every scroll frame, which is what lagged the Hero→Clinica hand-off.
            DenttyHome now just cross-fades THIS layer's opacity (compositor-only)
            for the same look. No src here: DenttyHome assigns it on ≥980px only,
            so phones never download the extra image. */}
        <img
          id="hero-img-blur"
          className="hero-fg"
          alt=""
          aria-hidden
          decoding="async"
          style={{ opacity: 0, willChange: "opacity", pointerEvents: "none" }}
        />
      </div>
      <div
        className="hero-grad"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          // strong bottom gradient for the centred bottom text (faces stay
          // clear), plus a light top wash so the nav reads over the wall.
          // On mobile this is softened (see globals.css) so it doesn't paint the
          // letter-boxed blur-fill strip solid black.
          background:
            "linear-gradient(0deg, rgba(12,16,22,0.9) 0%, rgba(12,16,22,0.62) 18%, rgba(12,16,22,0.18) 40%, rgba(12,16,22,0) 60%), linear-gradient(180deg, rgba(12,16,22,0.5) 0%, rgba(12,16,22,0) 20%)",
        }}
      />

      {/* content (nav now lives in the fixed Header) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding:
            "clamp(20px, 2.6vh, 36px) clamp(22px, 3.2vw, 60px) clamp(36px, 5vh, 64px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: 1 }} />

        {/* Headline block, centred at the bottom */}
        <div style={{ maxWidth: 920, textAlign: "center", pointerEvents: "none" }}>
          <h1
            id="hero-title"
            style={{
              margin: 0,
              color: "#fbfbfb",
              fontSize: "clamp(36px, 5vw, 84px)",
              fontWeight: 800,
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
            }}
          >
            <span className="hero-reveal-line">
              <span>
                {(() => {
                  // only the FIRST word ("Zâmbetul") is the classy italic serif;
                  // the rest of the headline stays the bold sans.
                  const [first, ...rest] = t.hero.titleL1.split(" ");
                  return (
                    <>
                      <span
                        style={{
                          fontFamily: "var(--font-display), Georgia, serif",
                          fontStyle: "italic",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {first}
                      </span>
                      {rest.length ? ` ${rest.join(" ")}` : ""}
                    </>
                  );
                })()}
              </span>
            </span>
            <span className="hero-reveal-line hero-line-2">
              <span>{t.hero.titleL2}</span>
            </span>
          </h1>
          <div className="hero-cta-reveal">
            {/* Sole CTA is the phone call (booking form removed) — a white pill
                matching the old CTA's prominence, linking to the clinic number. */}
            <a
              href={`tel:${CLINIC_TEL}`}
              style={{
                pointerEvents: "auto",
                marginTop: "clamp(22px, 2.6vw, 36px)",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#fbfbfb",
                color: "#14191f",
                borderRadius: 999,
                padding: "16px 30px",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {t.common.callNow}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
