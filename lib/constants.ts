export const CLINIC_NAME = "Dent X";
export const CLINIC_LEGAL = "SRL „Dent X Tur”";
export const CLINIC_FOUNDED_YEAR = 2021;
export const CLINIC_EMAIL = "dentx.md@gmail.com";

// Public site origin (no trailing slash) — used as the SEO metadataBase, in the
// sitemap, robots and structured data. This MUST be the live custom domain so
// canonical/OG/JSON-LD URLs point at the real site (not the *.vercel.app URL).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://dentx.md"
).replace(/\/$/, "");

// Clinic location (street/city + map coordinates) for LocalBusiness structured data.
export const CLINIC_ADDRESS = {
  street: "str. Mircea cel Bătrîn 14",
  city: "Chișinău",
  country: "MD", // Moldova
  lat: 47.045672,
  lng: 28.888667,
} as const;

export type Phone = { display: string; e164: string };

// Reception number — reachable on WhatsApp + Viber.
export const CLINIC_PHONES: Phone[] = [
  { display: "060 25 00 25", e164: "37360250025" },
];

// Primary number used by the "Call Now" / "Book" buttons.
export const CLINIC_PHONE = CLINIC_PHONES[0].display;
export const CLINIC_TEL = `+${CLINIC_PHONES[0].e164}`;

export const waLink = (e164: string) => `https://wa.me/${e164}`;
export const viberLink = (e164: string) => `viber://chat?number=%2B${e164}`;

// Google Maps embed for the clinic location.
export const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5437.445318810227!2d28.888667075693036!3d47.04567272654476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97d3a5f8ef2cd%3A0xf07ac0efff65e656!2sDent-X!5e0!3m2!1sen!2s!4v1781331008966!5m2!1sen!2s";
