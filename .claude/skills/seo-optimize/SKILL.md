---
name: seo-optimize
description: Audit and optimize a Next.js (App Router) website for SEO — metadata, Open Graph/Twitter cards, canonical + language alternates, robots, sitemap, JSON-LD structured data, favicons/OG images, and on-page basics. Use when asked to "optimize SEO", "improve search ranking", "add meta tags / structured data / sitemap", or audit a site's SEO.
---

# SEO optimization (Next.js App Router)

Work through this checklist; implement what's missing, report what's already good.

## 1. Metadata (`app/layout.tsx` + per-page `export const metadata`)
- `metadataBase: new URL(SITE_URL)` so relative OG/canonical URLs resolve.
- `title` as `{ default, template: "%s — Brand" }`; unique `description` (≤160 chars).
- `keywords` (localized — include every language the site serves), `applicationName`, `authors`, `category`.
- `alternates.canonical` and `alternates.languages` (e.g. `ro-MD`, `ru-MD`). For a client-side language toggle on ONE URL, point all languages at `/`.
- `openGraph` (type, siteName, title, description, url, locale + alternateLocale) and `twitter` (`summary_large_image`).
- `robots` (index/follow + googleBot `max-image-preview: large`, `max-snippet: -1`).

## 2. Structured data (biggest win for LOCAL businesses)
- Inject JSON-LD via `<script type="application/ld+json">` in the root layout.
- For a clinic/shop use `LocalBusiness` or a subtype (`Dentist`, `Restaurant`, …): name, url, logo, image, telephone, email, address (`PostalAddress`), `geo`, `openingHoursSpecification`, `priceRange`, `areaServed`, `makesOffer`. This drives the Google map/hours/phone panel.
- Pull the real data from the codebase (constants/content) — NEVER invent address/phone/coords.

## 3. Files (App Router conventions auto-wire the tags)
- `app/icon.png` (≥512², square) + `app/apple-icon.png` (180²) — favicon/home-screen icon. If only a wide wordmark exists, crop the icon mark and center it on a brand-color square. Remove a stale default `app/favicon.ico`.
- `app/opengraph-image.png` + `app/twitter-image.png` (1200×630) — link-preview card.
- `app/sitemap.ts` and `app/robots.ts` (disallow `/admin`, `/api/`; point `sitemap` at `${SITE_URL}/sitemap.xml`).

## 4. On-page
- `<html lang>` correct; descriptive `alt` on meaningful images; one `<h1>`; semantic headings.
- Fast LCP: mark the above-the-fold hero image `priority`.

## 5. Verify
- `next build` must pass. Then check the built HTML / `view-source` for: one canonical, the JSON-LD block, OG/twitter tags, and `/sitemap.xml` + `/robots.txt` resolving.
- Validate JSON-LD at search.google.com/test/rich-results.

Set `SITE_URL` from `NEXT_PUBLIC_SITE_URL` with a sensible fallback so it's correct once a custom domain is connected.
