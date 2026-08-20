import { Link } from 'react-router-dom';
import { Card, Table, Badge } from 'react-bootstrap';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';

export default function RentersPage() {
  const { data } = useTenantData();
  const renters = [...data.renters].sort((a, b) =>
    String(a.name || '').localeCompare(String(b.name || ''))
  );

  return (
    <div>
      <h2 className="mb-3">{labels.renters}</h2>
      <Card className="hub-panel">
        <Card.Body>
          {renters.length === 0 ? (
            <p className="text-muted mb-0">No renters yet — import a booking to create one.</p>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Organisation</th>
                  <th>Rentals</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {renters.map((renter) => {
                  const rentalCount = data.rentals.filter((r) => r.renterId === renter.id).length;
                  const unpaid = data.rentals.filter(
                    (r) => r.renterId === renter.id && r.paymentStatus !== 'paid'
                  ).length;
                  return (
                    <tr key={renter.id}>
                      <td className="fw-semibold">{renter.name}</td>
                      <td>
                        <div>{renter.phone || '—'}</div>
                        <div className="small text-muted">{renter.email || '—'}</div>
                      </td>
                      <td>{renter.organisation || '—'}</td>
                      <td>
                        {rentalCount}
                        {unpaid > 0 && (
                          <Badge bg="warning" text="dark" className="ms-2">{unpaid} unpaid</Badge>
                        )}
                      </td>
                      <td className="text-end">
                        <Link to={`/renters/${renter.id}`} className="btn btn-sm btn-outline-primary">
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
