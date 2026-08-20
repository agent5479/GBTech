import { describe, expect, it } from 'vitest';
import { planRentalImport, type PendingBooking } from './bookingImport';
import type { TenantData } from '@/types';

const samplePending: PendingBooking = {
  rowIndex: 42,
  timestamp: '2026-06-18T10:00:00.000Z',
  name: 'Jane Smith',
  phone: '027 123 4567',
  email: 'jane@example.com',
  organisation: 'Takaka Craft Group',
  facilityType: 'Kitchen — half day (4 hours)',
  addons: 'Cleaning fee ack',
  message: 'Pizza oven session',
  appointmentStart: '2026-07-15T09:00:00+12:00',
  appointmentEnd: '2026-07-15T13:00:00+12:00',
  calendarEventId: 'evt_test_123',
  location: 'The Kitchen',
  category: 'facility',
  extendedJson: JSON.stringify({
    v: 1,
    bookingType: 'kitchen_half_day',
    durationPackage: 'half_day',
    priceLabel: '$40',
    cleaningFeeAck: true,
  }),
};

const emptyTenantData = (): TenantData => ({
  owners: [],
  dogs: [],
  trainingLogs: [],
  scheduledSessions: [],
  trainingFocus: [],
  trainingSessions: [],
  clientReports: [],
  deletedRecords: {},
  activityLog: [],
  renters: [],
  rentals: [],
  payments: [],
});

describe('staff booking import — Hub rental plan', () => {
  it('creates renter and rental from pending booking', () => {
    const plan = planRentalImport(samplePending, emptyTenantData());
    expect(plan).toBeTruthy();
    expect(plan!.renter.phone).toBe(samplePending.phone);
    expect(plan!.renter.organisation).toBe(samplePending.organisation);
    expect(plan!.rental.facility).toBe('The Kitchen');
    expect(plan!.rental.paymentStatus).toBe('unpaid');
    expect(plan!.renterIsNew).toBe(true);
  });

  it('returns null when rental already imported', () => {
    const data = emptyTenantData();
    data.rentals.push({
      id: 'rental_existing',
      renterId: 'renter_1',
      facility: 'The Kitchen',
      calendarEventId: samplePending.calendarEventId,
    });
    expect(planRentalImport(samplePending, data)).toBeNull();
  });

  it('matches existing renter by email', () => {
    const data = emptyTenantData();
    data.renters.push({
      id: 'renter_existing',
      name: 'Jane Smith',
      email: samplePending.email,
    });
    const plan = planRentalImport(samplePending, data);
    expect(plan!.renter.id).toBe('renter_existing');
    expect(plan!.renterIsNew).toBe(false);
  });
});
