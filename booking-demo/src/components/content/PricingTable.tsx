interface PricingRow {
  label: string;
  price: string;
}

interface PricingTableProps {
  rows: PricingRow[];
}

export default function PricingTable({ rows }: PricingTableProps) {
  return (
    <ul className="pricing-table">
      {rows.map((row) => (
        <li key={row.label}>
          <span>{row.label}</span>
          <strong>{row.price}</strong>
        </li>
      ))}
    </ul>
  );
}
