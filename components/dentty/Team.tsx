"use client";

import { useEffect, useRef } from "react";
import { useContent } from "./LanguageProvider";

// Filenames are ASCII-only on purpose: a non-Latin1 char (the "Ț", U+021A=538) in
// an image URL makes Next throw "Cannot convert argument to a ByteString" when it
// builds the resource header, 500-ing the page (which killed the video expand).
// One {desktop, mobile} pair per member — order matches t.team.members.
const PHOTOS = [
  { desktop: "/team-dorel-desktop.webp", mobile: "/team-dorel-mobile.webp" },
  { desktop: "/team-alexandru-desktop.webp", mobile: "/team-alexandru-mobile.webp" },
  { desktop: "/team-irina-desktop.webp", mobile: "/team-irina-mobile.webp" },
  { desktop: "/team-galina-desktop.webp", mobile: "/team-galina-mobile.webp" },
  { desktop: "/team-lidia-desktop.webp", mobile: "/team-lidia-mobile.webp" },
];

// Vertical scroll (svh) spent per member transition while the team is pinned.
const DWELL_VH = 70;

const HEADING = {
  margin: "10px 0 0",
  color: "#28323f",
  fontSize: "clamp(40px, 4.6vw, 84px)",
  fontWeight: 500,
  lineHeight: 0.98,
  letterSpacing: "-0.03em",
} as const;

/**
 * Team — a normal-flow section (taller than the viewport) whose INNER stage is
 * sticky (top:0), so it pins for the horizontal sweep and then scrolls up and
 * out with the page; Servicii simply follows it (default scroll, no slide-over).
 * A zero-height #team-sentinel rendered just before it gives a sticky-proof read
 * of how far we've scrolled into the pin, which drives the strip's translate.
 * Same white as Clinica noastră with no edge between them, so the two read as
 * one continuous block. Below 980px globals.css stacks the panels.
 */
export default function Team() {
  const t = useContent();
  const members = t.team.members;
  const total = members.length;

  const stripRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastP = -1;
    const update = () => {
      raf = 0;
      const strip = stripRef.current;
      const bar = barRef.current;
      const sentinel = document.getElementById("team-sentinel");
      if (!strip) return;
      if (!sentinel) {
        strip.style.transform = "";
        if (bar) bar.style.transform = "";
        return;
      }
      const vh = window.innerHeight || 1;
      const scrollDist = Math.max(1, (total - 1) * (DWELL_VH / 100) * vh);
      const offset = -sentinel.getBoundingClientRect().top; // 0 at pin start, grows
      const p = Math.min(1, Math.max(0, offset / scrollDist));
      // Skip the style writes when the sweep position hasn't meaningfully moved
      // (e.g. scrolling elsewhere on the page once the team is parked at p=0/1),
      // so we don't repaint the strip every idle scroll frame on mobile.
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      // Panels are flex:0 0 100% in a 100%-wide strip → one panel = 100%.
      strip.style.transform = `translate3d(${-((total - 1) * 100 * p)}%,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [total]);

  return (
    <section
      id="team"
      data-screen-label="Team"
      style={{
        // Normal flow (not a sticky overlay layer): the team scrolls up and out
        // and Servicii follows it like a default scroll — Servicii no longer
        // slides OVER the team. Only the inner stage pins (for the sweep).
        position: "relative",
        zIndex: 3,
        height: `calc(100svh + ${(total - 1) * DWELL_VH}svh)`,
        background: "#fbfbfb",
      }}
    >
      <div
        id="team-stage"
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingTop: "clamp(84px, 11vh, 116px)",
          paddingBottom: "clamp(24px, 3vw, 44px)",
        }}
      >
        {/* header */}
        <div style={{ padding: "0 clamp(20px, 2.4vw, 44px)", flexShrink: 0 }}>
          <div style={{ maxWidth: 1760, margin: "0 auto", width: "100%" }}>
            <h2 className="reveal" style={HEADING}>{t.team.title}</h2>
            <div
              className="team-progress"
              style={{
                marginTop: "clamp(12px, 1.4vw, 20px)",
                height: 3,
                borderRadius: 999,
                background: "rgba(40,50,63,0.12)",
                overflow: "hidden",
              }}
            >
              <div
                ref={barRef}
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: "#28323f",
                  transformOrigin: "left",
                  transform: "scaleX(0)",
                }}
              />
            </div>
          </div>
        </div>

        {/* horizontal viewport */}
        <div
          id="team-viewport"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            marginTop: "clamp(16px, 2vw, 28px)",
          }}
        >
          <div
            ref={stripRef}
            id="team-strip"
            style={{ display: "flex", width: "100%", height: "100%", willChange: "transform" }}
          >
            {members.map((m, i) => (
              <div
                key={m.name}
                className="team-panel"
                style={{
                  flex: "0 0 100%",
                  height: "100%",
                  boxSizing: "border-box",
                  padding: "0 clamp(20px, 2.4vw, 44px)",
                }}
              >
                <div
                  className="team-grid"
                  style={{
                    maxWidth: 1760,
                    margin: "0 auto",
                    height: "100%",
                    display: "grid",
                    gridTemplateColumns: "1.3fr 0.7fr",
                    gap: 16,
                    alignItems: "stretch",
                  }}
                >
                  {/* photo */}
                  <div
                    className="team-photo"
                    style={{
                      position: "relative",
                      borderRadius: 18,
                      overflow: "hidden",
                      background: "#e9e9e9",
                    }}
                  >
                    <picture>
                      {/* dedicated mobile crop (≤980px) for the merged overlay card */}
                      <source media="(max-width: 980px)" srcSet={PHOTOS[i].mobile} />
                      <img
                        src={PHOTOS[i].desktop}
                        alt={m.name}
                        decoding="async"
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          objectPosition: "center top",
                        }}
                      />
                    </picture>
                  </div>

                  {/* info card */}
                  <div
                    className="team-info"
                    style={{
                      background: "#e9e9e9",
                      borderRadius: 18,
                      padding: "clamp(22px, 2.5vw, 32px)",
                      display: "flex",
                      flexDirection: "column",
                      boxSizing: "border-box",
                      overflow: "hidden",
                    }}
                  >
                    <span style={{ color: "rgba(40,50,63,0.55)", fontSize: 13 }}>
                      {i + 1}/{total}
                    </span>
                    <div
                      style={{
                        color: "#28323f",
                        fontSize: "clamp(24px, 2.2vw, 32px)",
                        fontWeight: 600,
                        marginTop: 18,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {m.name}
                    </div>
                    <div style={{ color: "rgba(40,50,63,0.6)", fontSize: 13.5, marginTop: 8 }}>
                      {m.role}
                    </div>
                    <div style={{ flex: 1 }} />
                    <p
                      style={{
                        color: "rgba(40,50,63,0.7)",
                        fontSize: 13.5,
                        lineHeight: 1.65,
                        margin: "24px 0 0",
                        textWrap: "pretty",
                      }}
                    >
                      {m.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
