import type { BookingFacility } from '../data/bookingFacilities';

interface FacilityPickerProps {
  facilities: BookingFacility[];
  selectedId: string | null;
  onSelect: (facilityId: string) => void;
}

export default function FacilityPicker({ facilities, selectedId, onSelect }: FacilityPickerProps) {
  return (
    <div className="facility-grid" role="list">
      {facilities.map((facility) => (
        <button
          key={facility.id}
          type="button"
          role="listitem"
          className={`facility-card${selectedId === facility.id ? ' facility-card--selected' : ''}`}
          onClick={() => onSelect(facility.id)}
          aria-pressed={selectedId === facility.id}
        >
          <strong>{facility.label}</strong>
          <span>{facility.description}</span>
          <span className="facility-card__category">
            {facility.category === 'equipment' ? 'Equipment hire' : 'Facility hire'}
          </span>
        </button>
      ))}
    </div>
  );
}
