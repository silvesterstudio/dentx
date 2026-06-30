import {
  SITE_URL,
  CLINIC_NAME,
  CLINIC_LEGAL,
  CLINIC_EMAIL,
  CLINIC_TEL,
  CLINIC_FOUNDED_YEAR,
  CLINIC_ADDRESS,
} from "./constants";

/**
 * schema.org JSON-LD for the clinic — a `Dentist` (a LocalBusiness + MedicalBusiness
 * subtype). This is what lets Google show the rich local panel (map pin, hours,
 * phone, rating) and is the single biggest SEO win for a local dental practice.
 * Injected once in the root layout.
 */
export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinic`,
    name: CLINIC_NAME,
    legalName: CLINIC_LEGAL,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/opengraph-image.png`,
    telephone: CLINIC_TEL,
    email: CLINIC_EMAIL,
    foundingDate: String(CLINIC_FOUNDED_YEAR),
    priceRange: "$$",
    currenciesAccepted: "MDL",
    medicalSpecialty: "Dentistry",
    address: {
      "@type": "PostalAddress",
      streetAddress: CLINIC_ADDRESS.street,
      addressLocality: CLINIC_ADDRESS.city,
      addressCountry: CLINIC_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC_ADDRESS.lat,
      longitude: CLINIC_ADDRESS.lng,
    },
    hasMap: `https://www.google.com/maps?q=${CLINIC_ADDRESS.lat},${CLINIC_ADDRESS.lng}`,
    areaServed: { "@type": "City", name: CLINIC_ADDRESS.city },
    availableLanguage: ["ro", "ru"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:30",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:30",
        closes: "14:00",
      },
    ],
    // The services the clinic offers — helps Google understand the practice.
    makesOffer: [
      "Stomatologie terapeutică",
      "Endodonție",
      "Chirurgie dento-alveolară",
      "Implantologie",
      "Protetică dentară",
      "Stomatologie pediatrică",
      "Profilaxie și estetică dentară",
    ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
  };
}
