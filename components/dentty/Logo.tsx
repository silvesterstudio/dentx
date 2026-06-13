"use client";

import { useState } from "react";

/**
 * Dent-X wordmark. Renders /logo-white.png (the white logo, for use on dark
 * backgrounds / over the header's gradient). Falls back to styled text if the
 * file hasn't been added yet, so the header is never a broken image.
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
      src="/logo-white.png"
      alt="Dent-X"
      onError={() => setOk(false)}
      style={{ height, width: "auto", display: "block" }}
    />
  );
}
