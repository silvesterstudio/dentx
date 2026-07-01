import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// RO homepage at "/" and RU at "/ru" — each listed with the full set of language
// alternates Google expects for a multilingual site.
const languages = {
  "ro-MD": `${SITE_URL}/`,
  "ru-MD": `${SITE_URL}/ru`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}/ru`,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
