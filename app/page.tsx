import DenttyHome from "@/components/dentty/DenttyHome";
import { LanguageProvider } from "@/components/dentty/LanguageProvider";
import { ro } from "@/lib/content/ro";
import { faqJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      {/* FAQ structured data (Romanian) — eligible for the FAQ rich result. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(ro.faq.items)) }}
      />
      <LanguageProvider initialLang="ro">
        <DenttyHome />
      </LanguageProvider>
    </>
  );
}
