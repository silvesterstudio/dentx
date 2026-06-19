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
      "Specialiști cu experiență, gata să te ajute cu orice problemă.",
    careTitle: "Grijă",
    careText:
      "Ne pasă de sănătatea și de zâmbetul tău, sănătos și frumos.",
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
        bio: "Stomatolog-chirurg cu experiență vastă în implantologie și protetică. Tratează fiecare caz cu precizie și calm, explicând clar fiecare etapă.",
      },
      {
        name: "Gram Alexandru",
        role: "Stomatolog · Terapeut",
        bio: "Stomatolog-terapeut atent la detalii, specializat în tratarea cariei și restaurări estetice. Pune accent pe diagnostic corect și soluții durabile.",
      },
      {
        name: "Paralunga Irina",
        role: "Asistentă medicală",
        bio: "Asistentă medicală care colaborează strâns cu medicii și pregătește instrumentarul steril. Respectă riguros protocoalele de prevenire a infecțiilor.",
      },
      {
        name: "Burența Galina",
        role: "Asistentă medicală",
        bio: "Respectă măsurile de precauție la fiecare etapă a îngrijirii și asigură dezinfecția aparaturii. Te însoțește pe tot parcursul tratamentului, cu grijă.",
      },
      {
        name: "Țurcanu Lidia",
        role: "Directoare administrativă",
        bio: "Coordonează procesele clinicii, veghind asupra siguranței și calității. Transformă calitatea serviciilor stomatologice într-o cultură de zi cu zi.",
      },
    ],
  },
  services: {
    eyebrow: "Ce oferim",
    title: "Servicii",
    quote: { small: "Ne pasă de tine", big: "Zâmbetul tău e prioritatea noastră" },
    items: [
      {
        name: "Diagnostic și radiologie",
        tagline: "Consultație, radiografie 3D, ortopantomogramă și viziografie",
        details: [
          "Consultație inițială cu evaluarea completă a sănătății orale",
          "Radiografie 3D (CBCT) pentru planificarea implanturilor și tratamentelor complexe",
          "Ortopantomogramă panoramică — vizualizarea tuturor dinților și structurilor osoase",
          "Viziografie digitală cu doză redusă de radiație",
          "Diagnostic precoce al cariilor, infecțiilor și afecțiunilor parodontale",
        ],
      },
      {
        name: "Profilaxie și estetică",
        tagline: "Detartraj, albire dentară și tratamentul sensibilității",
        details: [
          "Detartraj profesional cu ultrasunete pentru eliminarea completă a tartrului",
          "Air-flow — curățarea petelor și plăcii bacteriene cu jet de bicarbonat",
          "Albire dentară profesională în cabinet cu gel concentrat",
          "Tratamentul sensibilității dentare cu fluorizare și lacuri speciale",
          "Instrucțiuni personalizate de igienă orală și periaj profesional",
        ],
      },
      {
        name: "Tratamentul cariilor",
        tagline: "Obturații pentru toate tipurile de carii și restaurări",
        details: [
          "Tratamentul tuturor tipurilor de carii — incipiente, medii și profunde",
          "Obturații estetice din compozit fotopolimerizabil în culoarea dintelui",
          "Restaurări inlay/onlay din ceramică pentru distrucții extinse",
          "Sigilarea șanțurilor la copii pentru prevenirea cariei",
          "Utilizarea digii dentare pentru izolare perfectă și calitate maximă",
        ],
      },
      {
        name: "Tratament de canal",
        tagline: "Endodonție — tratamentul durerii acute și al canalelor",
        details: [
          "Endodonție modernă cu instrumente rotative Ni-Ti pentru canale curbe",
          "Tratamentul pulpitei și al parodontitei apicale acute și cronice",
          "Anestezie eficientă — procedura se desfășoară fără durere",
          "Obturare tridimensională pentru etanșare completă a canalelor",
          "Retreatment — retratamentul canalelor tratate incorect anterior",
        ],
      },
      {
        name: "Stomatologie pentru copii",
        tagline: "Pedodonție — obturații, tratament și extracții la dinții de lapte",
        details: [
          "Extracții și obturații la dinții de lapte într-un mediu prietenos",
          "Tratamentul cariei la copii sub anestezie locală",
          "Sigilarea molarilor permanenți pentru protecție pe termen lung",
          "Aplicare de fluor și lacuri de protecție dentară",
          "Educație pentru igiena orală corectă de la vârste mici",
        ],
      },
      {
        name: "Chirurgie dento-alveolară",
        tagline: "Extracții, tratamentul infecțiilor, chistectomie și gingivoplastie",
        details: [
          "Extracții simple și chirurgicale, inclusiv molarii de minte incluși",
          "Tratamentul chisturilor (chistectomie) și al granuloamelor",
          "Gingivoplastie — modelarea gingiei pentru un zâmbet estetic",
          "Tratamentul infecțiilor și abceselor dentare",
          "Intervenții de mică chirurgie în condiții de sterilizare maximă",
        ],
      },
      {
        name: "Implantologie",
        tagline: "Implanturi dentare, adiție de os, sinus lifting și PRF",
        details: [
          "Implanturi dentare din titan de calitate premium — soluție permanentă",
          "Adiție de os (grefare osoasă) pentru pacienți cu os insuficient",
          "Sinus lifting intern și extern pentru maxilarul superior",
          "PRF (plasmă bogată în factori de creștere) pentru vindecare accelerată",
          "Coroane pe implant din zirconiu sau ceramică pentru aspect natural",
        ],
      },
      {
        name: "Protetică dentară",
        tagline: "Coroane din zirconiu și ceramică, proteze mobile și reparații",
        details: [
          "Coroane din zirconiu de înaltă rezistență cu aspect 100% natural",
          "Coroane metalo-ceramice durabile la prețuri accesibile",
          "Punți dentare fixe pentru înlocuirea dinților lipsă fără implant",
          "Proteze mobile parțiale și totale, clasice și moderne",
          "Reparații rapide ale protezelor existente",
        ],
      },
      {
        name: "Reabilitare totală",
        tagline: "Reconstrucție completă a zâmbetului pe implanturi — All-on-4 / All-on-6",
        details: [
          "Reabilitare orală completă pentru pacienții fără dinți sau cu dinți compromiși",
          "Soluții fixe pe implanturi All-on-4 și All-on-6 — o arcadă întreagă pe 4-6 implanturi",
          "Plan de tratament digital cu ghidaj chirurgical pentru precizie maximă",
          "Dinți provizorii ficși în cel mai restrâns timp după montarea implanturilor",
          "Lucrare finală din zirconiu ori metalo-ceramică pentru funcție și estetică pe termen lung",
        ],
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
          "Înlocuirea unui dinte lipsă cu un implant și o coroană — un rezultat natural și durabil.",
        testimonial: {
          quote:
            "Aveam un dinte lipsă și mă temeam de implant. La Dent-X m-am simțit în siguranță de la prima vizită, iar rezultatul e atât de natural încât zâmbesc din nou fără rețineri.",
          author: "Ion Rusu",
        },
      },
      {
        tag: "Estetică",
        title: "Fațete estetice",
        result: "Un zâmbet uniform și luminos cu fațete și coroane ceramice.",
        testimonial: {
          quote:
            "Dinții îmi erau pătați și inegali. Acum am un zâmbet alb și uniform, exact ca dinții naturali — nimeni nu observă că am avut o lucrare.",
          author: "Elena Moraru",
        },
      },
      {
        tag: "Implant",
        title: "Reabilitare pe implanturi",
        result:
          "Refacerea completă a arcadei superioare cu o lucrare fixă pe implanturi.",
        testimonial: {
          quote:
            "Îmi pierdusem aproape toți dinții de sus. Cu lucrarea pe implanturi mănânc și râd din nou normal — mi-au redat încrederea.",
          author: "Vasile Ciobanu",
        },
      },
      {
        tag: "Estetică",
        title: "Coroane și fațete dentare",
        result:
          "Reconstrucția zâmbetului printr-un tratament complex de coroane și fațete dentare.",
        testimonial: {
          quote:
            "Dantura mea era uzată și deteriorată de ani de zile. Prin coroane și fațete, echipa Dent-X mi-a reconstruit complet zâmbetul — rezultatul a depășit așteptările.",
          author: "Maria Popescu",
        },
      },
      {
        tag: "Estetică",
        title: "Transformarea zâmbetului",
        result:
          "Refacerea formei și culorii dinților frontali pentru un zâmbet armonios.",
        testimonial: {
          quote:
            "Dinții din față îmi erau ciobiți și fără culoare. După lucrare arată naturali și luminoși, de parcă nu aș fi avut niciodată o problemă.",
          author: "Cristina Vrabie",
        },
      },
      {
        tag: "Estetică",
        title: "Tratamentul fluorozei (Icon)",
        result:
          "Tratarea fluorozei dentare prin infiltrare cu rășină Icon — petele dispar, iar țesutul dentar natural este păstrat, fără șlefuire.",
        testimonial: {
          quote:
            "Aveam pete albe și maronii pe dinți din cauza fluorozei. Prin procedura Icon au dispărut fără să-mi atingă dinții sănătoși — un rezultat natural, fără durere.",
          author: "Andrei Lungu",
        },
      },
      {
        tag: "Reabilitare",
        title: "Reabilitare totală",
        result:
          "Reabilitare orală totală a unui pacient fără dinți — o dantură nouă, fixă și funcțională.",
        testimonial: {
          quote:
            "Rămăsesem complet fără dinți și nu mai puteam mânca normal. După reabilitarea totală am o dantură fixă și stabilă — am o viață nouă.",
          author: "Ana Rusu",
        },
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
      { days: "Luni – Vineri", time: "08:30 – 18:00" },
      { days: "Sâmbătă", time: "08:30 – 14:00" },
      { days: "Duminică", time: "Zi liberă" },
    ],
    mapCaption: "Hartă — locația clinicii",
    rights: "Toate drepturile rezervate.",
  },
  booking: {
    cta: "Programează o consultație",
    title: "Programează o consultație",
    subtitle: "Lasă-ne datele tale și te contactăm pentru a confirma programarea.",
    name: "Nume",
    namePh: "Numele tău",
    phone: "Telefon",
    phonePh: "0XX XXX XXX",
    date: "Data preferată",
    time: "Ora preferată",
    submit: "Trimite cererea",
    sending: "Se trimite…",
    successTitle: "Cerere trimisă!",
    successText: "Mulțumim! Te vom contacta în curând pentru a confirma programarea.",
    error: "Ceva n-a mers. Te rugăm să ne suni direct.",
    close: "Închide",
    freeNote: "Consultația este gratuită și durează ~15 minute.",
    datePh: "Alege data",
    timePh: "Alege ora",
  },
};
