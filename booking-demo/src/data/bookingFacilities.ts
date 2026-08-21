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

/** Fictional sample venues for the public GBTech demo (not a real client site). */
const SHOWCASE_FACILITIES: BookingFacility[] = [
  {
    id: 'workshop',
    label: 'Creative Workshop',
    category: 'facility',
    description: 'Flexible room for crafts, repairs, and small group projects.',
    lat: -41.27,
    lng: 173.28,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'kitchen',
    label: 'Prep Kitchen',
    category: 'facility',
    description: 'Commercial-style prep kitchen with oven and bench space.',
    lat: -41.27,
    lng: 173.28,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'seminar',
    label: 'Seminar Room',
    category: 'facility',
    description: 'Quiet meeting and seminar room for groups up to 20.',
    lat: -41.27,
    lng: 173.28,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'equipment',
    label: 'Portable AV kit',
    category: 'equipment',
    description: 'Projector, speaker, and stand. Refundable deposit applies.',
    lat: -41.27,
    lng: 173.28,
    allowedDurations: ['hourly'],
  },
];

const LIVE_FACILITIES: BookingFacility[] = [
  {
    id: 'workshop',
    label: 'Creative Workshop',
    category: 'facility',
    description: 'Workshop space for crafts, repairs, and creative projects.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'kitchen',
    label: 'Prep Kitchen',
    category: 'facility',
    description: 'Commercial kitchen with oven and prep space.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'seminar',
    label: 'Seminar Room',
    category: 'facility',
    description: 'Meeting and seminar room for groups up to 20.',
    lat: -40.856,
    lng: 172.805,
    allowedDurations: ['hourly', 'half_day', 'full_day'],
  },
  {
    id: 'equipment',
    label: 'Portable AV kit',
    category: 'equipment',
    description: 'Projector and speaker kit. $50 deposit (refundable when returned clean).',
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
