import type { Metadata } from "next";
import DenttyHome from "@/components/dentty/DenttyHome";
import { LanguageProvider } from "@/components/dentty/LanguageProvider";
import { ru } from "@/lib/content/ru";
import { faqJsonLd } from "@/lib/seo";

// Russian version at its own indexable URL (/ru) so it ranks for Cyrillic
// searches (e.g. "стоматолог Кишинёв") separately from the Romanian homepage.
export const metadata: Metadata = {
  // `absolute` so the layout's "%s — Dent X" template doesn't double the brand
  // (ru.meta.title already ends with the clinic name).
  title: { absolute: ru.meta.title },
  description: ru.meta.description,
  alternates: {
    canonical: "/ru",
    languages: {
      "ro-MD": "/",
      "ru-MD": "/ru",
    },
  },
  openGraph: {
    title: ru.meta.title,
    description: ru.meta.description,
    url: "/ru",
    locale: "ru_MD",
    alternateLocale: "ro_MD",
  },
  twitter: {
    title: ru.meta.title,
    description: ru.meta.description,
  },
};

export default function HomeRu() {
  return (
    <>
      {/* FAQ structured data (Russian). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ru.faq.items)) }}
      />
      <LanguageProvider initialLang="ru">
        <DenttyHome />
      </LanguageProvider>
    </>
  );
}
