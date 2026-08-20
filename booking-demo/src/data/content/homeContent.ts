import { SITE_NAME, SITE_TAGLINE } from '../siteConfig';

export const homeContent = {
  seo: {
    title: `${SITE_NAME} | Golden Bay`,
    description:
      'Community venue hire in Golden Bay — book workshop spaces, kitchen, and meeting rooms online.',
  },
  hero: {
    title: SITE_NAME,
    subtitle: SITE_TAGLINE,
    intro:
      'A demonstration website for Marshall Solutions Advanced package — custom site plus self-service facility booking and a staff back office.',
  },
  aboutTeaser: {
    heading: 'Spaces for your group',
    body: 'Rent flexible community spaces by the hour or day. Book online, pay arrangements with staff, and keep your calendar in sync — all in a site you own outright.',
    image: '/images/home/02-SLC_gardens_02.png',
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
