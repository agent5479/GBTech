/** Plain-text summary of a booking submission — used in confirmation display. */

import {
  BOOKING_SERVICE_TYPES,
  type BookingServiceType,
} from './bookingServiceTypes';
import { BOOKING_CATEGORIES, type BookingCategoryId } from './bookingCategories';

export interface BookingSubmissionSummaryInput {
  bookingType: BookingServiceType;
  categoryLabel: string;
  slotLabel: string;
  slotEndLabel?: string;
  locationLabel: string;
  name?: string;
  phone: string;
  email?: string;
  organisation?: string;
  message?: string;
  extendedJson?: string;
}

function line(label: string, value: string | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return `${label}: ${trimmed}`;
}

function section(title: string, lines: (string | null)[]): string | null {
  const body = lines.filter((entry): entry is string => Boolean(entry));
  if (body.length === 0) return null;
  return `${title}\n${body.join('\n')}`;
}

function parseExtendedJson(raw?: string): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function formatBookingSubmissionSummary(input: BookingSubmissionSummaryInput): string {
  const service = BOOKING_SERVICE_TYPES[input.bookingType];
  const when =
    input.slotEndLabel && input.slotEndLabel !== input.slotLabel
      ? `${input.slotLabel} – ${input.slotEndLabel} (NZ time)`
      : `${input.slotLabel} (NZ time)`;

  const extended = parseExtendedJson(input.extendedJson);
  const addonLines: (string | null)[] = [];
  if (extended) {
    if (extended.firewood) addonLines.push('- Firewood requested');
    if (extended.cleaningFeeAck) addonLines.push('- Cleaning fee acknowledged');
    if (extended.depositAck || extended.equipmentDeposit) addonLines.push('- Equipment deposit acknowledged');
    if (typeof extended.addonNotes === 'string' && extended.addonNotes.trim()) {
      addonLines.push(`- ${extended.addonNotes.trim()}`);
    }
  }

  const blocks: (string | null)[] = [
    section('Booking', [
      line('Facility', input.locationLabel),
      line('Package', `${service.label} (${service.priceLabel})`),
      line('Category', input.categoryLabel),
      line('When', when),
      line('Address', '24 Waitapu Road, Tākaka 7110'),
    ]),
    section('Your details', [
      line('Name', input.name),
      line('Phone', input.phone),
      line('Email', input.email),
      line('Organisation', input.organisation),
    ]),
  ];

  if (addonLines.length > 0) {
    blocks.push(`Add-ons\n${addonLines.join('\n')}`);
  }
  if (input.message?.trim()) {
    blocks.push(`Notes\n${input.message.trim()}`);
  }

  return blocks.filter((block): block is string => Boolean(block)).join('\n\n');
}

export function categoryLabelForId(categoryId: BookingCategoryId): string {
  return BOOKING_CATEGORIES[categoryId].label;
}
