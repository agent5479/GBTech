import { SITE_NAME, SITE_TAGLINE } from '../siteConfig';

export const homeContent = {
  seo: {
    title: `${SITE_NAME} | GBTech Advanced demo`,
    description:
      'Harbour Hall Demo — try a sample venue website with self-service room booking for GBTech’s Advanced package.',
  },
  hero: {
    title: SITE_NAME,
    subtitle: SITE_TAGLINE,
    intro:
      'A fictional venue website for the GBTech Advanced package — custom site plus self-service facility booking and a staff back office.',
  },
  aboutTeaser: {
    heading: 'Spaces for your group',
    body: 'Rent flexible hire rooms by the hour or day. Book online, arrange payment with staff, and keep your calendar in sync — all in a site you own outright.',
    image: '/images/rentals/01-Workshop_space.jpg',
    links: [
      { label: 'Facility rentals', to: '/rentals' },
      { label: 'Book online', to: '/rentals/book' },
      { label: 'About this demo', to: '/about' },
    ],
  },
  bookCta: {
    heading: 'Ready to try the booking flow?',
    body: 'Walk through the public wizard, then open the staff demo to import your booking — fully simulated, no real calendar writes.',
    link: { label: 'Book a facility', to: '/rentals/book' },
  },
};
