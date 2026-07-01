import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { dictionaries } from "@/lib/content";
import { SITE_URL, CLINIC_NAME } from "@/lib/constants";
import { clinicJsonLd } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

// Elegant serif for display headlines (the italic, leaning hero title).
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
});

const META = dictionaries.ro.meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: META.title,
    template: `%s — ${CLINIC_NAME}`,
  },
  description: META.description,
  applicationName: CLINIC_NAME,
  keywords: [
    "stomatolog Chișinău",
    "clinică stomatologică Chișinău",
    "dentist Chișinău",
    "implant dentar Chișinău",
    "protetică dentară",
    "tratament canal",
    "stomatologie copii",
    "Dent X",
    "стоматолог Кишинёв",
    "стоматология Кишинёв",
  ],
  authors: [{ name: CLINIC_NAME }],
  creator: CLINIC_NAME,
  category: "Health",
  alternates: {
    canonical: "/",
    languages: {
      "ro-MD": "/",
      "ru-MD": "/ru",
    },
  },
  openGraph: {
    type: "website",
    siteName: CLINIC_NAME,
    title: META.title,
    description: META.description,
    url: SITE_URL,
    locale: "ro_MD",
    alternateLocale: "ru_MD",
  },
  twitter: {
    card: "summary_large_image",
    title: META.title,
    description: META.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#1d242b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${manrope.variable} ${playfair.variable} antialiased scroll-smooth`}>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) inject
          attributes like cz-shortcut-listen onto <body> before React hydrates,
          which would otherwise log a hydration-mismatch warning. */}
      <body suppressHydrationWarning>
        {/* schema.org LocalBusiness/Dentist — powers Google's rich local result. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd()) }}
        />
        {/* LanguageProvider is mounted per-ROUTE (app/page = ro, app/ru/page = ru)
            so each language is server-rendered at its own URL for SEO. */}
        {children}
      </body>
    </html>
  );
}
