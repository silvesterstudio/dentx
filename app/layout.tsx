import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { dictionaries } from "@/lib/content";
import { LanguageProvider } from "@/components/dentty/LanguageProvider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
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
    <html lang="ro" className={`${manrope.variable} antialiased scroll-smooth`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
