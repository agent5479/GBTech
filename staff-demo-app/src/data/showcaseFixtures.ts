import type { TenantData } from '@/types';
import type { PendingBooking } from '@/services/bookingImport';

export const SHOWCASE_TENANT_ID = 'showcase-venue';

export function getShowcaseTenantData(): TenantData {
  const now = new Date().toISOString();
  return {
    owners: [],
    dogs: [],
    trainingLogs: [],
    scheduledSessions: [],
    trainingFocus: [],
    trainingSessions: [],
    clientReports: [],
    deletedRecords: {},
    activityLog: [],
    payments: [],
    renters: [
      {
        id: 'renter_demo_1',
        name: 'Takaka Craft Group',
        phone: '027 555 0101',
        email: 'craft@example.com',
        organisation: 'Takaka Craft Group',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'renter_demo_2',
        name: 'Maria Garcia',
        phone: '021 555 0202',
        email: 'maria@example.com',
        createdAt: now,
        updatedAt: now,
      },
    ],
    rentals: [
      {
        id: 'rental_demo_1',
        renterId: 'renter_demo_1',
        facility: 'The Kitchen',
        category: 'facility',
        bookingType: 'kitchen_half_day',
        start: new Date(Date.now() + 3 * 86400000).toISOString(),
        end: new Date(Date.now() + 3 * 86400000 + 4 * 3600000).toISOString(),
        calendarEventId: 'showcase_evt_seed_1',
        amountDue: 40,
        amountPaid: 40,
        currency: 'NZD',
        paymentStatus: 'paid',
        importedAt: now,
        updatedAt: now,
      },
    ],
  };
}

export function getShowcaseSeedPendingBookings(): PendingBooking[] {
  const start = new Date();
  start.setDate(start.getDate() + 5);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setHours(12, 0, 0, 0);

  return [
    {
      rowIndex: 9001,
      timestamp: new Date().toISOString(),
      name: 'Jordan Lee',
      phone: '027 555 0303',
      email: 'jordan@example.com',
      organisation: 'Bay Yoga Collective',
      facilityType: 'makerspace_half_day',
      message: 'Workshop setup — showcase sample booking',
      appointmentStart: start.toISOString(),
      appointmentEnd: end.toISOString(),
      calendarEventId: 'showcase_evt_seed_9001',
      location: 'The Makerspace',
      category: 'facility',
      extendedJson: JSON.stringify({
        v: 1,
        bookingType: 'makerspace_half_day',
        durationPackage: 'half_day',
        priceLabel: '$35',
      }),
    },
  ];
}
