export type Lang = "ro" | "ru";

export type Content = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    about: string;
    services: string;
    cases: string;
    reviews: string;
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
    items: { name: string; tagline: string }[];
  };
  cases: {
    eyebrow: string;
    title: string;
    before: string;
    after: string;
    items: { tag: string; title: string; result: string }[];
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
};
