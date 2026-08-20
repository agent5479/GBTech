import { SOCIAL_LINKS } from '../siteConfig';
import { curatedImages } from './curatedImages';

export const eventsContent = {
  seo: {
    title: 'Events | Mohua Facility Hub',
    description:
      'Community events and gatherings celebrating nature and the seasons at Mohua Facility Hub, Tākaka.',
  },
  hero: {
    title: 'Our Events',
    intro: `The SLC holds events and gatherings that celebrate our interconnectedness with nature and the seasons. These events connect communities and give opportunity to share knowledge.

We also provide spaces for others to hold events ranging from art classes, performances, storytelling, movies and gatherings. Contact us if you're interested in renting one of our spaces.`,
    image: curatedImages.events.hero,
  },
  calendarNote: `Our monthly events calendar is published on Facebook. Follow us for the latest workshops, festivals, and community gatherings.`,
  facebookLink: SOCIAL_LINKS.facebook,
  gallery: curatedImages.events.gallery,
};
