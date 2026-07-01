export type Lang = "ro" | "ru";

export type Content = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    about: string;
    services: string;
    cases: string;
    reviews: string;
    faq: string;
    contact: string;
  };
  common: { callNow: string; book: string; viewMore: string };
  hero: { titleL1: string; titleL2: string; sub: string };
  about: {
    eyebrow: string;
    title: string;
    since: string;
    expertiseTitle: string;
    expertiseText: string;
    careTitle: string;
    careText: string;
    photoRadiology: string;
    photoReception: string;
    photoOffice: string;
  };
  team: {
    eyebrow: string;
    title: string;
    photoPrefix: string;
    members: { name: string; role: string; bio: string }[];
  };
  services: {
    eyebrow: string;
    title: string;
    quote: { small: string; big: string };
    items: { name: string; tagline: string; details: string[] }[];
  };
  cases: {
    eyebrow: string;
    title: string;
    before: string;
    after: string;
    items: {
      tag: string;
      title: string;
      result: string;
      testimonial: { quote: string; author: string };
    }[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    rating: string;
    count: string;
    from: string;
    videoLabel: string;
    items: { name: string; role: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    phoneLabel: string;
    emailLabel: string;
    addressLabel: string;
    hoursLabel: string;
    address: string;
    hours: { days: string; time: string }[];
    mapCaption: string;
    rights: string;
  };
  booking: {
    cta: string;
    title: string;
    subtitle: string;
    name: string;
    namePh: string;
    phone: string;
    phonePh: string;
    date: string;
    time: string;
    submit: string;
    sending: string;
    successTitle: string;
    successText: string;
    error: string;
    close: string;
    freeNote: string;
    datePh: string;
    timePh: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
};
