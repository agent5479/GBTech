import { SITE_NAME } from '../siteConfig';

type ScopeItem = {
  title: string;
  body: string;
  link?: { label: string; to: string };
};

type HistoryPeriod = {
  era: string;
  years: string;
  items: string[];
};

export const aboutContent = {
  seo: {
    title: `About | ${SITE_NAME}`,
    description: 'About Harbour Hall Demo — a GBTech Advanced package showcase of a potential venue booking system.',
  },
  hero: {
    title: `About ${SITE_NAME}`,
    intro:
      'This is a fictional demonstration of a custom venue website. It shows how a local organisation can present hire spaces online and accept facility bookings without monthly builder fees. Room names and the address are sample content only.',
  },
  scope: [
    {
      title: 'Hire spaces',
      body: 'Workshop, kitchen, and seminar rooms available for hire by local groups, tutors, and small businesses.',
    },
    {
      title: 'Online booking',
      body: 'Visitors choose a facility, pick a time, and confirm — the staff app receives the booking for import.',
    },
    {
      title: 'Full ownership',
      body: 'The site and booking system live in accounts you control. No lock-in to Wix, Squarespace, or Calendly.',
    },
  ] as ScopeItem[],
  vision: {
    heading: 'What this demo shows',
    body: 'GBTech builds custom websites with optional automated booking for Tasman and Golden Bay service businesses — studios, venues, tutors, and community groups.',
  },
  need: {
    heading: 'Who it is for',
    intro: 'Local businesses that need:',
    items: [
      'A professional site without monthly Wix or Squarespace fees',
      'Self-service bookings that sync to Google Calendar',
      'A staff view to import bookings and track renters',
    ],
    closing: 'This demo pair shows both sides of the Advanced package.',
  },
  history: {
    id: 'History',
    heading: 'About this showcase',
    periods: [] as HistoryPeriod[],
  },
  images: [] as { src: string; alt: string }[],
  teamLink: { label: 'Contact us', to: '/contact' },
};
