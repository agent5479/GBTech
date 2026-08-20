import { CONTACT_EMAILS } from '../siteConfig';
import { curatedImages } from './curatedImages';

export const compostContent = {
  seo: {
    title: 'Mohua Compost Collective | Mohua Facility Hub',
    description:
      'Free parakai (food scraps) drop-off service in Tākaka turning food waste into valuable compost.',
  },
  hero: {
    title: 'Mohua Compost Collective',
    tagline: 'Turning food waste into a valuable resource.',
  },
  dropOff: {
    heading: 'Free Parakai (Food scraps) Drop off Service',
    body: `We are collecting food scraps to reduce waste going to landfill, and will turn it into beautiful compost. We've made it super easy with 2 drop-off locations in Tākaka township.`,
    localInfo: [
      'We provide free 5L buckets for you to collect your parakai in at home.',
      'We also sell our EM Brew which will help begin the compost journey.',
    ],
    contact: CONTACT_EMAILS.manager,
  },
  dos: [
    'Fruit and vegetable scraps',
    'Coffee grounds and tea bags',
    'Eggshells',
    'Bread and grains',
    'Paper towels and napkins',
  ],
  donts: [
    'Meat, fish, or bones',
    'Dairy products',
    'Oils and fats',
    'Plastic or packaging',
    'Pet waste',
  ],
  steps: [
    'Collect your scraps at home.',
    'Drop it off at our handy central locations at the SLC or I-site. Make sure the bin is shut tight!',
    'Our partners at Helping Hands will pick up our fermenting parakai and deliver it to our Mohua Compost Collective Team.',
    'We will sort your scraps, mix it with other compost ingredients to get the perfect balance of carbon to nitrogen.',
    'We will monitor moisture levels and temperature, and turn it regularly to keep it aerated.',
    'In a few months, we\'ll have nutritious food for our gardens.',
  ],
  images: curatedImages.compost,
  sponsors: [
    { name: 'MSD', image: curatedImages.sponsors.msd },
    { name: 'Helping Hands', image: curatedImages.sponsors.helpingHands },
  ],
  resources: [
    { label: 'Aotearoa Compost Network', url: 'https://www.compostcollective.org.nz/' },
    { label: 'Make Soil', url: 'https://www.makesoil.org/' },
    { label: 'The Compost Collective', url: 'https://compostcollective.org.nz/' },
    { label: 'Environment Hubs Aotearoa', url: 'https://environmenthubs.org.nz/' },
  ],
};
