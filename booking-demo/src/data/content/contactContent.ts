import { CONTACT_EMAILS, SITE_ADDRESS_LINES, SITE_NAME, SOCIAL_LINKS } from '../siteConfig';

export const contactContent = {
  seo: {
    title: `Contact | ${SITE_NAME}`,
    description: 'Contact Harbour Hall Demo — GBTech Advanced package showcase.',
  },
  hero: {
    title: 'Get in touch',
    intro:
      'Questions about facility hire or this demo? Send an enquiry — showcase mode only, messages are not delivered.',
  },
  emails: [{ label: 'General', address: CONTACT_EMAILS.general }],
  socialNote: 'This is a demonstration site for GBTech.',
  social: SOCIAL_LINKS,
  region: {
    heading: 'Location',
    body: 'Sample Bay address below is fictional — built to show how a venue site can present location details.',
  },
  visit: {
    heading: 'Demo address',
    address: SITE_ADDRESS_LINES,
    image: undefined as string | undefined,
  },
};
