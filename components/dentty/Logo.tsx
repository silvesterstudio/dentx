"use client";

import { useEffect, useRef, useState } from "react";

// The two wordmarks. "white" is the default (white logo for dark backgrounds /
// the header gradient); "second" is the alternate the user can swap in.
const LOGO_SRC = {
  white: "/logo-white.png",
  second: "/second-logo.webp",
} as const;

type Variant = keyof typeof LOGO_SRC;

const STORAGE_KEY = "dentx-logo";
// Triple-press window: all three presses must land within this gap (ms).
const PRESS_WINDOW = 600;

/**
 * Dent-X wordmark. Renders the white logo by default; pressing the logo three
 * times in quick succession swaps it with the second logo (and back). The chosen
 * variant is remembered in localStorage so it survives navigation / reload.
 * Falls back to styled text if the image file is missing, so the header is never
 * a broken image.
 */
export default function Logo({ height = 32 }: { height?: number }) {
  const [variant, setVariant] = useState<Variant>("white");
  const [ok, setOk] = useState(true);

  const presses = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "white" || saved === "second") setVariant(saved);
  }, []);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Count rapid presses; on the third within the window, flip the logo.
  const onPress = () => {
    presses.current += 1;
    if (timer.current) clearTimeout(timer.current);
    if (presses.current >= 3) {
      presses.current = 0;
      setVariant((v) => {
        const next: Variant = v === "white" ? "second" : "white";
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
        setOk(true); // give the new file a fresh chance to load
        return next;
      });
      return;
    }
    timer.current = setTimeout(() => {
      presses.current = 0;
    }, PRESS_WINDOW);
  };

  if (!ok) {
    return (
      <span
        onClick={onPress}
        style={{
          color: "#fbfbfb",
          fontWeight: 800,
          fontSize: Math.round(height * 0.78),
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Dent·X
      </span>
    );
  }

  return (
    <img
      src={LOGO_SRC[variant]}
      alt="Dent-X"
      onClick={onPress}
      onError={() => setOk(false)}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
