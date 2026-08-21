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
    description: 'About the Community Venue Demo — a GBTech Advanced package showcase.',
  },
  hero: {
    title: `About ${SITE_NAME}`,
    intro:
      'This is a generic demonstration of a custom community venue website built for Golden Bay businesses. It shows how a local organisation can present their spaces online and accept facility bookings without monthly builder fees.',
  },
  scope: [
    {
      title: 'Community spaces',
      body: 'Workshop, kitchen, and meeting rooms available for hire by local groups, tutors, and small businesses.',
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
    body: 'GBTech builds custom websites with optional automated booking for Tasman and Golden Bay service businesses — yoga studios, venues, tutors, and community groups.',
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
