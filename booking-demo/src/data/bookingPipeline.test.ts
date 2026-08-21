import { describe, expect, it } from 'vitest';
import { getRequiredBookingApiKeys } from '@shared/bookingFieldMap';
import {
  SAMPLE_EXTENDED_DETAILS_INPUT,
  SAMPLE_EXTENDED_JSON_PARSED,
  SAMPLE_EQUIPMENT_EXTENDED_JSON,
} from '@shared/bookingTestFixture';
import {
  buildExtendedDetailsPayload,
  EXTENDED_DETAILS_SCHEMA_VERSION,
} from './bookingExtendedDetails';
import { formatBookingSubmissionSummary, categoryLabelForId } from '@shared/bookingSubmissionSummary';

describe('booking pipeline — Hub extended JSON', () => {
  it('builds extended JSON with add-ons and booking metadata', () => {
    const { firewood, cleaningFeeAck, depositAck, equipmentDeposit, addonNotes, bookingType, durationPackage, priceLabel } =
      SAMPLE_EXTENDED_DETAILS_INPUT;
    const json = buildExtendedDetailsPayload(
      { firewood, cleaningFeeAck, depositAck, equipmentDeposit, addonNotes },
      { bookingType, durationPackage, priceLabel, category: 'facility' }
    );
    expect(json).toBeTruthy();

    const parsed = JSON.parse(json!);
    expect(parsed.v).toBe(EXTENDED_DETAILS_SCHEMA_VERSION);
    expect(parsed.bookingType).toBe(SAMPLE_EXTENDED_JSON_PARSED.bookingType);
    expect(parsed.firewood).toBe(true);
    expect(parsed.cleaningFeeAck).toBe(true);
  });

  it('includes equipment deposit fields for equipment category', () => {
    const json = buildExtendedDetailsPayload(
      { firewood: false, cleaningFeeAck: true, equipmentDeposit: true, depositAck: true, addonNotes: '' },
      { bookingType: 'equipment_hourly', durationPackage: 'hourly', priceLabel: '$20 + $50 deposit', category: 'equipment' }
    );
    const parsed = JSON.parse(json!);
    expect(parsed.equipmentDeposit).toBe(true);
    expect(parsed.depositAck).toBe(true);
  });

  it('documents required top-level API keys for booking', () => {
    expect(getRequiredBookingApiKeys()).toEqual(
      expect.arrayContaining(['booking_type', 'category', 'slot_start', 'location', 'phone'])
    );
  });

  it('formats a kitchen half-day submission summary', () => {
    const json = buildExtendedDetailsPayload(
      {
        firewood: SAMPLE_EXTENDED_DETAILS_INPUT.firewood,
        cleaningFeeAck: SAMPLE_EXTENDED_DETAILS_INPUT.cleaningFeeAck,
        depositAck: false,
        equipmentDeposit: false,
        addonNotes: SAMPLE_EXTENDED_DETAILS_INPUT.addonNotes,
      },
      {
        bookingType: 'kitchen_half_day',
        durationPackage: 'half_day',
        priceLabel: '$40',
        category: 'facility',
      }
    );

    const summary = formatBookingSubmissionSummary({
      bookingType: 'kitchen_half_day',
      categoryLabel: categoryLabelForId('facility'),
      slotLabel: 'Tue 15 Jul 2026, 9:00 am',
      slotEndLabel: '1:00 pm',
      locationLabel: 'Prep Kitchen',
      name: 'Jane Smith',
      phone: '027 123 4567',
      email: 'jane@example.com',
      organisation: 'Sample Craft Group',
      message: 'Prep kitchen session',
      extendedJson: json,
    });

    expect(summary).toContain('Prep Kitchen');
    expect(summary).toContain('$40');
    expect(summary).toContain('Supplies pack requested');
    expect(summary).toContain('Jane Smith');
  });

  it('formats equipment booking summary with deposit', () => {
    const summary = formatBookingSubmissionSummary({
      bookingType: 'equipment_hourly',
      categoryLabel: categoryLabelForId('equipment'),
      slotLabel: 'Sat 1 Aug 2026, 10:00 am',
      slotEndLabel: '11:00 am',
      locationLabel: 'Portable AV kit',
      phone: '021 234 5678',
      organisation: 'Community Kitchen Collective',
      extendedJson: JSON.stringify(SAMPLE_EQUIPMENT_EXTENDED_JSON),
    });

    expect(summary).toContain('Equipment deposit acknowledged');
    expect(summary).toContain('$20 + $50 deposit');
  });
});
