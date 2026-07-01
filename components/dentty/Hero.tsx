"use client";

import { useContent } from "./LanguageProvider";
import BookingForm from "./BookingForm";

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
              textShadow: "0 4px 40px rgba(8,11,16,0.45)",
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
            <BookingForm
              ctaLabel={t.common.book}
              buttonStyle={{ pointerEvents: "auto", marginTop: "clamp(22px, 2.6vw, 36px)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
