import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { dictionaries } from "@/lib/content";
import { LanguageProvider } from "@/components/dentty/LanguageProvider";
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

export const metadata: Metadata = {
  title: dictionaries.ro.meta.title,
  description: dictionaries.ro.meta.description,
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
