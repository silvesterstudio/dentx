"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { dictionaries, type Content, type Lang } from "@/lib/content";

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: Content };

const LanguageContext = createContext<LangCtx | null>(null);

// The active language is determined by the ROUTE ("/" = ro, "/ru" = ru) so each
// language has its own indexable URL for SEO. `initialLang` is passed from the
// page (server-rendered), so the first HTML is already in the right language.
export function LanguageProvider({
  children,
  initialLang = "ro",
}: {
  children: React.ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // The on-site toggle switches language instantly (client state) AND syncs the
  // URL to the matching route so it stays shareable/bookmarkable and matches what
  // a reload would render. We use history.replaceState (not a full navigation) so
  // the intro/preloader and scroll position aren't reset on every toggle.
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      const path = l === "ru" ? "/ru" : "/";
      if (window.location.pathname !== path) {
        window.history.replaceState(window.history.state, "", path);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = dictionaries[lang].meta.title;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}

export function useContent() {
  return useLang().t;
}
