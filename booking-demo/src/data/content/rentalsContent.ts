import { CONTACT_EMAILS, SITE_NAME } from '../siteConfig';

export const rentalsContent = {
  seo: {
    title: `Facility Rentals | ${SITE_NAME}`,
    description: 'Rent community spaces and equipment — book online in the Marshall Solutions Advanced package demo.',
  },
  hero: {
    title: 'Facility rentals',
    intro:
      'Hire workshop space, a commercial kitchen, or a meeting room by the hour or day. This demo uses sample rates — your live site would reflect your own pricing.',
  },
  facilities: {
    heading: 'Bookable spaces',
    intro: 'Choose a space below, then use the online booking wizard to pick a time.',
    image: '/images/rentals/01-Workshop_space.jpg',
    spaces: [
      {
        name: 'The Makerspace',
        rates: [
          { label: 'Hourly hire', price: '$10' },
          { label: 'Half day (4 hours)', price: '$35' },
          { label: 'Full day (8+ hours)', price: '$55' },
        ],
      },
      {
        name: 'The Kitchen',
        rates: [
          { label: 'Hourly hire', price: '$12' },
          { label: 'Half day (4 hours)', price: '$40' },
          { label: 'Full day (8+ hours)', price: '$70' },
        ],
      },
      {
        name: 'Meeting Room',
        rates: [
          { label: 'Hourly hire', price: '$8' },
          { label: 'Half day (4 hours)', price: '$30' },
        ],
      },
    ],
    notes: [
      'Showcase demo only — payment is arranged with staff in a real deployment.',
      'Equipment hire may require a refundable deposit.',
    ],
  },
  equipment: {
    heading: 'Shared equipment',
    intro: 'Hourly equipment hire with deposit acknowledgement in the booking form.',
    items: [{ name: 'Shared equipment', image: undefined as string | undefined }],
    rates: [{ label: 'Hourly hire', price: '$20 + deposit' }],
    contact: CONTACT_EMAILS.general,
  },
  bookingCta: {
    heading: 'Venue availability',
    intro: 'Check sample availability, then complete the booking wizard.',
    label: 'Book a facility online',
    to: '/rentals/book',
  },
  allotment: {
    id: 'allotmentRental',
    heading: 'Allotment rental',
    body: 'Allotment enquiries are handled via the contact form in this demo.',
    cta: { label: 'Contact us', to: '/contact' },
  },
};
