"use client";

import { CLINIC_TEL } from "@/lib/constants";
import { useContent } from "./LanguageProvider";

const CALL_HREF = `tel:${CLINIC_TEL}`;

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
      <div id="hero-img-box" style={{ position: "absolute", inset: 0 }}>
        <img
          src="/hero.webp"
          alt="Dent X"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "60% center",
            display: "block",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(96deg, rgba(12,16,22,0.86) 0%, rgba(12,16,22,0.5) 30%, rgba(12,16,22,0.08) 56%, rgba(12,16,22,0) 78%), linear-gradient(0deg, rgba(12,16,22,0.6) 0%, rgba(12,16,22,0) 42%)",
        }}
      />

      {/* content (nav now lives in the fixed Header) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          padding:
            "clamp(20px, 2.6vh, 36px) clamp(22px, 3.2vw, 60px) clamp(28px, 4vh, 56px)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ flex: 1 }} />

        {/* Headline block, bottom-left */}
        <div style={{ maxWidth: 760, pointerEvents: "none" }}>
          <h1
            id="hero-title"
            style={{
              margin: 0,
              color: "#fbfbfb",
              fontSize: "clamp(40px, 6vw, 100px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              textShadow: "0 4px 40px rgba(8,11,16,0.4)",
            }}
          >
            {t.hero.titleL1}
            <br />
            {t.hero.titleL2}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.86)",
              fontSize: "clamp(15px, 1.15vw, 18px)",
              lineHeight: 1.6,
              margin: "clamp(18px, 2vw, 26px) 0 0",
              maxWidth: "48ch",
              textShadow: "0 1px 16px rgba(8,11,16,0.4)",
              textWrap: "pretty",
            }}
          >
            {t.hero.sub}
          </p>
          <a
            href={CALL_HREF}
            style={{
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginTop: "clamp(22px, 2.6vw, 36px)",
              background: "#fbfbfb",
              color: "#14191f",
              borderRadius: 999,
              padding: "16px 30px",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {t.common.book}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#14191f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
