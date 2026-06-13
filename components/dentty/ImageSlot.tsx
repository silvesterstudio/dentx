/**
 * Styled placeholder that stands in for a real photo. The source mockup used a
 * drag-to-fill <image-slot>; in this build the slots render as neutral boxes
 * with their caption so the layout is pixel-accurate and real images can be
 * dropped in later. Fills its parent (width/height: 100%).
 */

type ImageSlotProps = {
  caption: string;
  shape?: "rounded" | "rect";
  radius?: number;
  /** Use light-on-dark styling for slots that sit on dark surfaces. */
  dark?: boolean;
  /** When set, the real photo is rendered (cover) instead of the placeholder. */
  src?: string;
  alt?: string;
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
}: ImageSlotProps) {
  const borderRadius = shape === "rect" ? 0 : radius;

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? caption}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          borderRadius,
        }}
      />
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
      <span style={{ maxWidth: "90%" }}>{caption}</span>
    </div>
  );
}
