import { CONTACT_EMAILS } from '../siteConfig';

export const volunteeringContent = {
  seo: {
    title: 'Volunteering | Mohua Facility Hub',
    description:
      'Volunteer at Mohua Facility Hub gardens in Golden Bay — seasonal work, accommodation, and learning exchange.',
  },
  hero: {
    title: 'Come volunteer with us!',
    intro:
      'During the busier times at the SLC we welcome volunteers from all around the world to participate in a learning exchange at the gardens.',
  },
  work: {
    heading: 'A bit about what you will be doing',
    body: `Work is mostly physical in the gardens, working alongside our Garden Co-ordinator Max. Golden Bay gets pretty hot in Summer: ranging from 25-35°C. We tend to start early in the Summer to avoid the midday heat, and love to cool down in the nearby swim spots.

We have a number of buildings that are rented out for community events, so we share a weekly cleaning rota to make sure they are welcoming.`,
    seasons: [
      { season: 'Spring', tasks: 'Getting beds ready to sow, propagate and plant seedlings, and weeding.' },
      { season: 'Summer', tasks: 'Tending plants, sowing salads, weeding, and lots of watering.' },
      { season: 'Autumn', tasks: 'Getting beds ready, propagating and planting seedlings, and harvesting from our Orchard.' },
    ],
  },
  dates: [
    'Winter Volunteer position — May to September',
    '6 month placement — September to March',
    'Spring dates to be announced',
  ],
  benefits: {
    heading: 'What we will give you',
    sections: [
      {
        title: 'Accommodation',
        body: 'In either our Earth Building/Cabins, or you may choose to stay in your van. The Earth building is a shared attic above our volunteer lounge space. The cabins are two single accommodations (without electricity), looking out onto our beautiful gardens.',
      },
      {
        title: 'Food',
        body: 'We have a budget shared between volunteers for dry goods. Our freezer is stocked with harvest from last year, and as fruit and veg come into season you will have access to regeneratively-grown food. Community lunch once a week.',
      },
      {
        title: 'Knowledge',
        body: 'Each week we aim to give dedicated teaching time covering propagation, foraging, composting, feeding the soil, preserving, or earthbuilding when a tutor is available.',
      },
      {
        title: 'Access to bikes',
        body: 'We have a few bikes to get to town (~5 mins cycle) and to the nearby beaches (~25 mins).',
      },
    ],
  },
  expectations: {
    heading: 'What we expect from you',
    items: [
      '20hrs focussed and enthusiastic work each week.',
      'One weekend of your stay — checking seedling watering and re-stocking the stall.',
      'Functions and events — help make community events happen during Summer stays.',
      'Keeping to the Volunteer Agreement (e-mailed on request).',
    ],
  },
  internationalCta: {
    email: CONTACT_EMAILS.manager,
    text: 'If this sounds interesting, please email the general manager for more information.',
  },
  local: {
    heading: 'Local Volunteer Opportunities',
    body: `If you'd like to volunteer at the gardens, pop into our weekly "Grow Together Thursdays", or our monthly "Working bees". See Facebook for more details or check out our Events page.

We have a number of festivals throughout the year which we love to have help with. If you're interested in contributing to the Spring Merriment or Harvest Festival please contact our Events Co-ordinator.`,
    eventsEmail: CONTACT_EMAILS.events,
    links: [
      { label: 'Events Page', to: '/events' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  otherWays: 'Keen to help out in other ways? Get in touch and let us know how you\'d like to be involved.',
};
