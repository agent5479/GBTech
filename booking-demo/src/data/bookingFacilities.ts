/** Hub bookable facilities — keep in sync with google-apps-script/Code.gs LOCATIONS when live. */

import type { BookingCategoryId } from '@shared/bookingCategories';
import type { DurationPackage } from '@shared/bookingServiceTypes';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import { SHOWCASE_ADDRESS } from '@shared/showcaseBrand';

export interface BookingFacility {
  id: string;
  label: string;
  category: BookingCategoryId;
  description: string;
  lat: number;
  lng: number;
  allowedDurations: DurationPackage[];
}

const SHOWCASE_FACILITIES: BookingFacility[] = [
  {
    id: 'makerspace',
    label: 'The Makerspace',
    category: 'facility',
    description: 'Workshop space for crafts, repairs, and community projects.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'kitchen',
    label: 'The Kitchen',
    category: 'facility',
    description: 'Commercial kitchen with oven and prep space for workshops and catering.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'meeting-room',
    label: 'Meeting Room',
    category: 'facility',
    description: 'Quiet meeting and workshop room for groups up to 20.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'equipment',
    label: 'Shared equipment',
    category: 'equipment',
    description: 'Community equipment hire. Refundable deposit applies.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly'],
  },
];

const LIVE_FACILITIES: BookingFacility[] = [
  {
    id: 'makerspace',
    label: 'The Makerspace',
    category: 'facility',
    description: 'Workshop space for crafts, repairs, and creative projects.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'kitchen',
    label: 'The Kitchen',
    category: 'facility',
    description: 'Commercial kitchen with oven and prep space for workshops and catering.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'earth-building',
    label: 'Earth Building',
    category: 'facility',
    description: 'Meeting and workshop room in the earth building.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'equipment',
    label: 'Fruit processing equipment',
    category: 'equipment',
    description: 'Apple press and related equipment. $50 deposit (refundable when returned clean).',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly'],
  },
];

export const BOOKING_FACILITIES = IS_SHOWCASE_MODE ? SHOWCASE_FACILITIES : LIVE_FACILITIES;

export function getFacilityById(id: string): BookingFacility | undefined {
  return BOOKING_FACILITIES.find((f) => f.id === id);
}

export function getFacilitiesByCategory(category: BookingCategoryId): BookingFacility[] {
  return BOOKING_FACILITIES.filter((f) => f.category === category);
}

export const SITE_ADDRESS = IS_SHOWCASE_MODE ? SHOWCASE_ADDRESS : '24 Waitapu Road, Tākaka 7110';
