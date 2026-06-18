"use client";

import { useState } from "react";

// The single Dent-X wordmark (the most recently uploaded logo).
const LOGO_SRC = "/second-logo.webp";

/**
 * Dent-X wordmark. Renders the logo image; falls back to styled text if the file
 * is missing, so the header is never a broken image.
 */
export default function Logo({ height = 32 }: { height?: number }) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <span
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
      src={LOGO_SRC}
      alt="Dent-X"
      onError={() => setOk(false)}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
