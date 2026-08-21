import { describe, expect, it } from 'vitest';
import { getServiceTypesForFacility } from '@shared/bookingServiceTypes';
import {
  buildShowcaseAvailability,
  getShowcaseBookedBlocks,
} from '../services/showcaseAvailability';

describe('showcase availability', () => {
  it('maps seminar facility to duration options (regression: empty duration grid)', () => {
    expect(getServiceTypesForFacility('seminar').map((t) => t.id)).toEqual([
      'seminar_hourly',
      'seminar_half_day',
      'seminar_full_day',
    ]);
    expect(getServiceTypesForFacility('workshop').length).toBe(3);
    expect(getServiceTypesForFacility('meeting-room')).toEqual([]);
  });

  it('returns slots that avoid sample busy blocks', () => {
    const date = '2026-09-01';
    const blocks = getShowcaseBookedBlocks(date, 'kitchen');
    const result = buildShowcaseAvailability(date, 'kitchen_hourly', 'kitchen');
    expect(result.success).toBe(true);
    expect(result.slots?.length).toBeGreaterThan(0);
    for (const slot of result.slots || []) {
      const hour = new Date(slot.start).getHours();
      expect(blocks.some((b) => hour >= b.startHour && hour < b.endHour)).toBe(false);
    }
  });

  it('honours half-day duration length', () => {
    const result = buildShowcaseAvailability('2026-09-02', 'workshop_half_day', 'workshop');
    expect(result.success).toBe(true);
    for (const slot of result.slots || []) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      expect((end.getTime() - start.getTime()) / 60000).toBe(240);
    }
  });
});
