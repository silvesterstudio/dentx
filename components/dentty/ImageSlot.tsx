/**
 * Styled placeholder that stands in for a real photo. The source mockup used a
 * drag-to-fill <image-slot>; in this build the slots render as neutral boxes
 * with their caption so the layout is pixel-accurate and real images can be
 * dropped in later. Fills its parent (width/height: 100%).
 */
import Image from "next/image";

type ImageSlotProps = {
  caption: string;
  shape?: "rounded" | "rect";
  radius?: number;
  /** Use light-on-dark styling for slots that sit on dark surfaces. */
  dark?: boolean;
  /** When set, the real photo is rendered (cover) instead of the placeholder. */
  src?: string;
  alt?: string;
  /** Hide the caption text in the placeholder (e.g. when the card already shows
   *  the name elsewhere). The caption is still used as the alt text for src. */
  showLabel?: boolean;
};

const ICON = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.45 }}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

export default function ImageSlot({
  caption,
  shape = "rounded",
  radius = 12,
  dark = false,
  src,
  alt,
  showLabel = true,
}: ImageSlotProps) {
  const borderRadius = shape === "rect" ? 0 : radius;

  if (src) {
    // Route real photos through next/image so they're resized to the displayed
    // size and decoded asynchronously — the source files are multi-MB, and
    // decoding the full bitmap on the main thread as the frame scrolls in was
    // stalling the scroll. `fill` needs a positioned parent, so we provide our
    // own relative wrapper (the layout containers aren't all positioned).
    return (
      <span
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          borderRadius,
          overflow: "hidden",
        }}
      >
        <Image
          src={src}
          alt={alt ?? caption}
          fill
          sizes="(max-width: 980px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </span>
    );
  }

  const fg = dark ? "rgba(251,251,251,0.6)" : "rgba(0,0,0,0.55)";
  const ring = dark ? "rgba(251,251,251,0.28)" : "rgba(0,0,0,0.22)";
  const fill = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        background: fill,
        color: fg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        textAlign: "center",
        padding: 12,
        boxSizing: "border-box",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "0.01em",
        lineHeight: 1.3,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          border: `1.5px dashed ${ring}`,
          pointerEvents: "none",
        }}
      />
      {ICON}
      {showLabel && <span style={{ maxWidth: "90%" }}>{caption}</span>}
    </div>
  );
}
