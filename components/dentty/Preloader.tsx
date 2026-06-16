"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Logo from "./Logo";

/**
 * Page-load intro. A full-screen navy curtain (matching the hero, #14191f)
 * covers the first paint with the Dent-X logo fading in at centre, then lifts
 * up. As it lifts it removes the `intro-pre` flag from <html>, which releases
 * the hero's staged reveal (title words rise from a mask, the image scales in,
 * the CTA fades up — see globals.css). Honours prefers-reduced-motion by
 * skipping the whole sequence (no curtain, hero shown immediately).
 *
 * The hero's hidden state is applied via `html.intro-pre` set synchronously
 * BEFORE paint (useLayoutEffect). Any one-frame flash of the un-hidden hero is
 * masked by the opaque curtain that renders on top from the very first paint.
 */
const LOGO_IN = 80; // ms: when the centred logo starts fading in
const LIFT_AT = 1150; // ms: when the curtain starts lifting (+ hero reveals)
const LIFT_MS = 1000; // ms: curtain lift duration (must match the transition)

export default function Preloader() {
  // "covering" = curtain on screen; "lifting" = sliding up; "gone" = unmounted.
  const [phase, setPhase] = useState<"covering" | "lifting" | "gone">(
    "covering"
  );
  const [logoIn, setLogoIn] = useState(false);

  // Stage the hero as hidden before the browser paints, so the reveal can play
  // when the curtain lifts. Skip entirely for reduced motion.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("gone");
      return;
    }
    const root = document.documentElement;
    root.classList.add("intro-pre");
    // lock scrolling while the curtain is up
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      root.classList.remove("intro-pre");
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (phase === "gone") return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setLogoIn(true), LOGO_IN));
    timers.push(
      window.setTimeout(() => {
        // Release the hero reveal in sync with the curtain lift.
        document.documentElement.classList.remove("intro-pre");
        document.body.style.overflow = "";
        setPhase("lifting");
      }, LIFT_AT)
    );
    timers.push(window.setTimeout(() => setPhase("gone"), LIFT_AT + LIFT_MS));
    return () => timers.forEach((t) => clearTimeout(t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#14191f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: phase === "lifting" ? "translateY(-100%)" : "translateY(0)",
        transition: `transform ${LIFT_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          opacity: logoIn ? 1 : 0,
          transform: logoIn ? "scale(1)" : "scale(0.94)",
          transition:
            "opacity 0.7s ease, transform 0.9s cubic-bezier(0.7, 0, 0.2, 1)",
        }}
      >
        <Logo height={54} />
      </div>
    </div>
  );
}
