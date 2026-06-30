import type { MetadataRoute } from "next";
import { dictionaries } from "@/lib/content";
import { CLINIC_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: dictionaries.ro.meta.title,
    short_name: CLINIC_NAME,
    description: dictionaries.ro.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1d242b",
    theme_color: "#1d242b",
    lang: "ro",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
