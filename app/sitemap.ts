import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// Single-page site — the one route, with the language alternates Google expects.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          "ro-MD": `${SITE_URL}/`,
          "ru-MD": `${SITE_URL}/`,
        },
      },
    },
  ];
}
