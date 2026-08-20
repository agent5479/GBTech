import { BOOKING_SUCCESS_FOLLOWUP, BOOKING_SUCCESS_MESSAGE, BOOKING_SUCCESS_TITLE } from '../data/bookingConfirmation';
import { formatBookingSubmissionSummary, categoryLabelForId } from '@shared/bookingSubmissionSummary';
import type { BookingServiceType } from '@shared/bookingServiceTypes';
import type { BookingCategoryId } from '@shared/bookingCategories';

interface BookingConfirmationDetailsProps {
  bookingType: BookingServiceType;
  category: BookingCategoryId;
  slotLabel: string;
  slotEndLabel: string;
  locationLabel: string;
  name: string;
  phone: string;
  email: string;
  organisation: string;
  message: string;
  extendedJson?: string;
}

export default function BookingConfirmationDetails(props: BookingConfirmationDetailsProps) {
  const summary = formatBookingSubmissionSummary({
    bookingType: props.bookingType,
    categoryLabel: categoryLabelForId(props.category),
    slotLabel: props.slotLabel,
    slotEndLabel: props.slotEndLabel,
    locationLabel: props.locationLabel,
    name: props.name,
    phone: props.phone,
    email: props.email,
    organisation: props.organisation,
    message: props.message,
    extendedJson: props.extendedJson,
  });

  return (
    <div className="booking-confirmation">
      <h3>{BOOKING_SUCCESS_TITLE}</h3>
      <p>{BOOKING_SUCCESS_MESSAGE}</p>
      <pre className="booking-summary">{summary}</pre>
      <p className="booking-confirmation__followup">{BOOKING_SUCCESS_FOLLOWUP}</p>
    </div>
  );
}
