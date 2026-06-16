"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  name: string;
  tagline: string;
  details: string[];
  onClose: () => void;
};

export default function ServiceModal({ name, tagline, details, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(8,11,16,0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(20px, 5vw, 60px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1d242d",
          borderRadius: 24,
          padding: "clamp(28px, 4vw, 48px)",
          maxWidth: 560,
          width: "100%",
          position: "relative",
          boxShadow: "0 32px 80px rgba(8,11,16,0.8)",
          border: "1px solid rgba(251,251,251,0.08)",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Închide"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(251,251,251,0.08)",
            border: "none",
            cursor: "pointer",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fbfbfb",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div
          style={{
            color: "rgba(251,251,251,0.45)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          {tagline}
        </div>

        <h3
          style={{
            margin: "0 0 28px",
            color: "#fbfbfb",
            fontSize: "clamp(22px, 2.4vw, 30px)",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {name}
        </h3>

        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {details.map((d, i) => (
            <li
              key={i}
              style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
            >
              <span
                style={{
                  color: "rgba(251,251,251,0.3)",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: 3,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  color: "rgba(251,251,251,0.82)",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                {d}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body
  );
}
