import { CONTACT_EMAILS, SITE_ADDRESS_LINES, SITE_NAME, SOCIAL_LINKS } from '../siteConfig';

export const contactContent = {
  seo: {
    title: `Contact | ${SITE_NAME}`,
    description: 'Contact the Community Venue Demo — Marshall Solutions Advanced package showcase.',
  },
  hero: {
    title: 'Get in touch',
    intro: 'Questions about facility hire or this demo? Send an enquiry — showcase mode only, messages are not delivered.',
  },
  emails: [{ label: 'General', address: CONTACT_EMAILS.general }],
  socialNote: 'This is a demonstration site for Marshall Solutions.',
  social: SOCIAL_LINKS,
  region: {
    heading: 'Location',
    body: 'Golden Bay, Tasman — built locally by Marshall Solutions for community and service businesses.',
  },
  visit: {
    heading: 'Demo address',
    address: SITE_ADDRESS_LINES,
    image: '/images/contact/01-picking_food_garden.jpg',
  },
};
