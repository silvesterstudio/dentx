import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { CLINIC_NAME } from "@/lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: CLINIC_NAME,
  description: "Stomatologie modernă pentru întreaga familie — implanturi, estetică dentară și tratamente fără durere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${jakarta.variable} ${inter.variable} antialiased scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
