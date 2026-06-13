import type { Content } from "./types";

export const ro: Content = {
  meta: {
    title: "Dent X — Clinică stomatologică în Moldova",
    description:
      "Clinică stomatologică modernă din 2021: terapie, endodonție, chirurgie, implanturi și protetică. Specialiști cu experiență, la doar un telefon distanță.",
  },
  nav: {
    home: "Acasă",
    about: "Despre noi",
    services: "Servicii",
    cases: "Lucrări",
    reviews: "Recenzii",
    contact: "Contacte",
  },
  common: {
    callNow: "Sună acum",
    book: "Programează-te",
    viewMore: "Vezi mai mult",
  },
  hero: {
    titleL1: "Zâmbetul tău",
    titleL2: "pe primul loc",
    sub: "Fie că ai nevoie de un control de rutină sau de o urgență stomatologică, specialiștii noștri cu experiență sunt la doar un telefon distanță.",
  },
  about: {
    eyebrow: "Gamă largă de servicii",
    title: "Clinica noastră",
    since: "Din 2021",
    expertiseTitle: "Experiență",
    expertiseText:
      "Clinica noastră reunește specialiști cu experiență și înalt calificați, mereu gata să te ajute cu orice problemă a cavității bucale.",
    careTitle: "Grijă",
    careText:
      "Ne pasă de sănătatea ta și facem tot posibilul pentru ca zâmbetul tău să fie sănătos și frumos.",
    photoRadiology: "Foto clinică — sala de radiologie",
    photoReception: "Foto clinică — recepție",
    photoOffice: "Foto clinică — cabinet",
  },
  team: {
    eyebrow: "Echipa noastră",
    title: "Echipa",
    photoPrefix: "Foto —",
    members: [
      {
        name: "Țurcanu Dorel",
        role: "Stomatolog-chirurg · Protezist · Terapeut",
        bio: "Stomatolog-chirurg cu experiență vastă în implantologie și protetică, tratează fiecare caz cu precizie și calm.",
      },
      {
        name: "Ursu Alexandru",
        role: "Stomatolog · Terapeut",
        bio: "Stomatolog-terapeut atent la detalii, specializat în tratamentul cariei și restaurări estetice.",
      },
      {
        name: "Cucu Natalia",
        role: "Stomatolog · Protezist · Terapeut",
        bio: "Stomatolog-protezist și terapeut, redă zâmbete naturale prin coroane și restaurări de calitate.",
      },
      {
        name: "Pasalunga Zina",
        role: "Asistentă medicală",
        bio: "Asistentă medicală care se asigură că fiecare vizită decurge lin și în siguranță.",
      },
      {
        name: "Burența Galina",
        role: "Infirmieră",
        bio: "Menține clinica impecabil de curată, pentru un mediu sigur și primitor.",
      },
      {
        name: "Țurcanu Lidia",
        role: "Director administrativ",
        bio: "Director administrativ, coordonează activitatea clinicii și te ajută cu programările.",
      },
    ],
  },
  services: {
    eyebrow: "Ce oferim",
    title: "Servicii",
    items: [
      {
        name: "Radiografie",
        tagline: "Viziografie, ortopantomogramă și scanare 3D",
      },
      {
        name: "Stomatologie terapeutică",
        tagline: "Tratamentul cariei, obturații și igienizare profesională",
      },
      {
        name: "Endodonție",
        tagline: "Tratamentul modern al canalelor radiculare",
      },
      {
        name: "Chirurgie stomatologică",
        tagline: "Extracții, implanturi și sinus lifting",
      },
      {
        name: "Protetică dentară",
        tagline: "Coroane metalo-ceramice și din zirconiu",
      },
      {
        name: "Proteze mobile",
        tagline: "Soluții comode, parțiale și totale",
      },
    ],
  },
  cases: {
    eyebrow: "Rezultate reale",
    title: "Lucrările noastre",
    before: "Înainte",
    after: "După",
    items: [
      {
        tag: "Implant",
        title: "Implant cu coroană",
        result:
          "Înlocuirea unui dinte lipsă cu un implant și coroană — un rezultat natural și durabil.",
      },
      {
        tag: "Estetică",
        title: "Coroane din zirconiu",
        result: "Un zâmbet uniform și luminos cu coroane din zirconiu.",
      },
      {
        tag: "Restaurare",
        title: "Restaurare estetică",
        result: "Refacerea formei și culorii dinților frontali.",
      },
    ],
  },
  reviews: {
    eyebrow: "Ce spun pacienții",
    title: "Recenzii",
    rating: "4.9",
    count: "300+",
    from: "din {count} recenzii",
    videoLabel: "Recenzie video",
    items: [
      { name: "Ion R.", role: "Implant dentar" },
      { name: "Elena M.", role: "Estetică dentară" },
      { name: "Sergiu V.", role: "Protetică" },
    ],
  },
  contact: {
    eyebrow: "Ia legătura",
    title: "Contacte",
    phoneLabel: "Telefon",
    emailLabel: "E-mail",
    addressLabel: "Adresă",
    hoursLabel: "Program",
    address: "str. Mircea cel Bătrîn 14, Chișinău",
    hours: [
      { days: "Luni – Vineri", time: "08:00 – 20:00" },
      { days: "Sâmbătă", time: "09:00 – 16:00" },
      { days: "Duminică", time: "Închis" },
    ],
    mapCaption: "Hartă — locația clinicii",
    rights: "Toate drepturile rezervate.",
  },
};
