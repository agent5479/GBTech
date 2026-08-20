export const EXTENDED_DETAILS_SCHEMA_VERSION = 1;

export interface BookingExtendedDetailsState {
  firewood: boolean;
  cleaningFeeAck: boolean;
  equipmentDeposit: boolean;
  depositAck: boolean;
  addonNotes: string;
}

export const emptyExtendedDetailsState = (): BookingExtendedDetailsState => ({
  firewood: false,
  cleaningFeeAck: false,
  equipmentDeposit: false,
  depositAck: false,
  addonNotes: '',
});

export interface BuildExtendedDetailsOptions {
  bookingType: string;
  durationPackage: string;
  priceLabel: string;
  category: 'facility' | 'equipment';
}

export function buildExtendedDetailsPayload(
  state: BookingExtendedDetailsState,
  options: BuildExtendedDetailsOptions
): string | undefined {
  const hasData =
    state.firewood ||
    state.cleaningFeeAck ||
    state.depositAck ||
    state.equipmentDeposit ||
    state.addonNotes.trim() ||
    options.category === 'equipment';

  if (!hasData && !options.bookingType) return undefined;

  const payload = {
    v: EXTENDED_DETAILS_SCHEMA_VERSION,
    bookingType: options.bookingType,
    durationPackage: options.durationPackage,
    priceLabel: options.priceLabel,
    firewood: state.firewood,
    cleaningFeeAck: state.cleaningFeeAck,
    equipmentDeposit: options.category === 'equipment' || state.equipmentDeposit,
    depositAck: state.depositAck,
    addonNotes: state.addonNotes.trim() || undefined,
  };

  return JSON.stringify(payload);
}
