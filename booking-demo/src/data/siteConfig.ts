import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import {
  SHOWCASE_ADDRESS,
  SHOWCASE_ADDRESS_LINES,
  SHOWCASE_SITE_NAME,
  SHOWCASE_SITE_SHORT_NAME,
  SHOWCASE_TAGLINE,
} from '@shared/showcaseBrand';
import { SITE_ADDRESS as LIVE_SITE_ADDRESS } from './bookingFacilities';

export interface NavLink {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

export const SITE_NAME = IS_SHOWCASE_MODE ? SHOWCASE_SITE_NAME : 'Mohua Facility Hub';
export const SITE_SHORT_NAME = IS_SHOWCASE_MODE ? SHOWCASE_SITE_SHORT_NAME : 'Hub';
export const SITE_TAGLINE = IS_SHOWCASE_MODE
  ? SHOWCASE_TAGLINE
  : 'Nāu te rourou, nāku te rourou ka ora ai te iwi';

export const SITE_ADDRESS_LINES = IS_SHOWCASE_MODE
  ? SHOWCASE_ADDRESS_LINES
  : ['24 Waitapu Road', 'Tākaka 7110', 'Golden Bay, New Zealand'];

export const SITE_ADDRESS_FULL = IS_SHOWCASE_MODE ? SHOWCASE_ADDRESS : LIVE_SITE_ADDRESS;

export const CONTACT_EMAILS = {
  general: 'contact@example.com',
  events: 'events@example.com',
  manager: 'staff@example.com',
  trust: 'trust@example.com',
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
} as const;

export const NAV_GROUPS: NavGroup[] = IS_SHOWCASE_MODE
  ? [
      {
        label: 'Explore',
        links: [
          { label: 'About', to: '/about' },
          { label: 'Facility Rentals', to: '/rentals' },
          { label: 'Book a facility', to: '/rentals/book' },
          { label: 'Contact', to: '/contact' },
        ],
      },
    ]
  : [
      {
        label: 'What We Offer',
        links: [
          { label: 'Events', to: '/events' },
          { label: 'Courses', to: '/courses' },
          { label: 'Education', to: '/bespoke-education' },
          { label: 'Facility Rentals', to: '/rentals' },
        ],
      },
      {
        label: 'Projects',
        links: [
          { label: 'Mohua Compost Collective', to: '/compost' },
          { label: 'Kai Resilience', to: '/kai-resilience' },
        ],
      },
      {
        label: 'Getting Involved',
        links: [
          { label: 'Volunteering', to: '/getting-involved' },
          { label: 'Allotment Rental', to: '/rentals#allotmentRental' },
        ],
      },
      {
        label: 'About',
        links: [
          { label: 'Our Team', to: '/our-team' },
          { label: 'About us', to: '/about' },
          { label: 'Contact', to: '/contact' },
        ],
      },
    ];

export const BOOK_CTA = { label: 'Book a facility', to: '/rentals/book' };
