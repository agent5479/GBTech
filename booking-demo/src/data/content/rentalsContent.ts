import { CONTACT_EMAILS, SITE_NAME } from '../siteConfig';

export const rentalsContent = {
  seo: {
    title: `Facility Rentals | ${SITE_NAME}`,
    description: 'Rent sample workshop, kitchen, and seminar spaces — book online in the GBTech Advanced package demo.',
  },
  hero: {
    title: 'Facility rentals',
    intro:
      'Hire a creative workshop, prep kitchen, or seminar room by the hour or day. Rates below are sample figures for this demo — a live site would use your own pricing.',
  },
  facilities: {
    heading: 'Bookable spaces',
    intro: 'Choose a space below, then use the online booking wizard to pick a time.',
    image: '/images/rentals/01-Workshop_space.webp',
    spaces: [
      {
        name: 'Creative Workshop',
        rates: [
          { label: 'Hourly hire', price: '$10' },
          { label: 'Half day (4 hours)', price: '$35' },
          { label: 'Full day (8+ hours)', price: '$55' },
        ],
      },
      {
        name: 'Prep Kitchen',
        rates: [
          { label: 'Hourly hire', price: '$12' },
          { label: 'Half day (4 hours)', price: '$40' },
          { label: 'Full day (8+ hours)', price: '$70' },
        ],
      },
      {
        name: 'Seminar Room',
        rates: [
          { label: 'Hourly hire', price: '$8' },
          { label: 'Half day (4 hours)', price: '$30' },
          { label: 'Full day (8+ hours)', price: '$50' },
        ],
      },
    ],
    notes: [
      'Showcase demo only — payment is arranged with staff in a real deployment.',
      'Equipment hire may require a refundable deposit.',
    ],
  },
  equipment: {
    heading: 'Portable AV kit',
    intro: 'Hourly AV kit hire with deposit acknowledgement in the booking form.',
    items: [{ name: 'Portable AV kit', image: undefined as string | undefined }],
    rates: [{ label: 'Hourly hire', price: '$20 + deposit' }],
    contact: CONTACT_EMAILS.general,
  },
  bookingCta: {
    heading: 'Sample venue availability',
    intro: 'Check the demo calendar, then complete the booking wizard.',
    label: 'Book a facility online',
    to: '/rentals/book',
  },
};
