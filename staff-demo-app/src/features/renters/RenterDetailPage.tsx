import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Alert, Badge, Button, Card, Form, Table } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';
import { mutate, tenantPath } from '@/services/mutations';
import type { Payment, PaymentMethod, PaymentStatus, Rental } from '@/types';

function formatWhen(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function computePaymentStatus(amountDue: number, amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) return 'unpaid';
  if (amountDue > 0 && amountPaid >= amountDue) return 'paid';
  return 'partial';
}

export default function RenterDetailPage() {
  const { renterId = '' } = useParams();
  const { user } = useAuth();
  const { data, setData } = useTenantData();
  const renter = data.renters.find((r) => String(r.id) === renterId);
  const rentals = data.rentals.filter((r) => r.renterId === renterId);
  const payments = data.payments.filter((p) => p.renterId === renterId);

  const [selectedRentalId, setSelectedRentalId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const selectedRental = useMemo(
    () => rentals.find((r) => String(r.id) === selectedRentalId),
    [rentals, selectedRentalId]
  );

  if (!renter) {
    return (
      <Alert variant="warning">
        Renter not found. <Link to="/renters">Back to renters</Link>
      </Alert>
    );
  }

  async function recordPayment(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.tenantId || !selectedRental || !renter) return;
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter a valid payment amount.');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    const paymentId = `payment_${Date.now()}`;
    const now = new Date().toISOString();
    const payment: Payment = {
      id: paymentId,
      renterId: String(renter.id),
      rentalId: String(selectedRental.id),
      amount: parsedAmount,
      method,
      date: now.slice(0, 10),
      notes: notes.trim() || undefined,
      recordedBy: user.uid,
      createdAt: now,
    };

    const updatedRental: Rental = {
      ...selectedRental,
      amountPaid: (selectedRental.amountPaid || 0) + parsedAmount,
      paymentStatus: computePaymentStatus(selectedRental.amountDue || 0, (selectedRental.amountPaid || 0) + parsedAmount),
      updatedAt: now,
    };

    try {
      await mutate(
        tenantPath(user.tenantId, 'payments', paymentId),
        payment,
        'payment_record',
        'set',
        () => setData((prev) => ({ ...prev, payments: [...prev.payments, payment] }))
      );
      await mutate(
        tenantPath(user.tenantId, 'rentals', String(selectedRental.id)),
        updatedRental,
        'rental_payment_update',
        'set',
        () =>
          setData((prev) => ({
            ...prev,
            rentals: prev.rentals.map((r) => (String(r.id) === String(selectedRental.id) ? updatedRental : r)),
          }))
      );
      setMessage(`Recorded $${parsedAmount.toFixed(2)} payment.`);
      setAmount('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setBusy(false);
    }
  }

  async function markDepositReturned(rental: Rental) {
    if (!user?.tenantId) return;
    const updated: Rental = { ...rental, depositStatus: 'returned', updatedAt: new Date().toISOString() };
    await mutate(tenantPath(user.tenantId, 'rentals', String(rental.id)), updated, 'deposit_return', 'set', () =>
      setData((prev) => ({
        ...prev,
        rentals: prev.rentals.map((r) => (String(r.id) === String(rental.id) ? updated : r)),
      }))
    );
    setMessage('Deposit marked as returned.');
  }

  return (
    <div>
      <div className="mb-3">
        <Link to="/renters" className="text-muted small">← {labels.renters}</Link>
        <h2 className="mt-2 mb-0">{renter.name}</h2>
        <p className="text-muted mb-0">
          {renter.phone} · {renter.email || 'no email'}
          {renter.organisation ? ` · ${renter.organisation}` : ''}
        </p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Card className="hub-panel mb-4">
        <Card.Header>Rentals</Card.Header>
        <Card.Body>
          {rentals.length === 0 ? (
            <p className="text-muted mb-0">No rentals imported for this renter.</p>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Facility</th>
                  <th>Due</th>
                  <th>Paid</th>
                  <th>Status</th>
                  <th>Deposit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>{formatWhen(rental.start)}</td>
                    <td>{rental.facility}</td>
                    <td>{rental.amountDue != null ? `$${rental.amountDue}` : 'TBD'}</td>
                    <td>${rental.amountPaid || 0}</td>
                    <td>
                      <Badge bg={rental.paymentStatus === 'paid' ? 'success' : rental.paymentStatus === 'partial' ? 'warning' : 'secondary'}>
                        {rental.paymentStatus || 'unpaid'}
                      </Badge>
                    </td>
                    <td>
                      {rental.depositAmount ? (
                        <Badge bg={rental.depositStatus === 'returned' ? 'success' : 'warning'} text="dark">
                          ${rental.depositAmount} · {rental.depositStatus || 'held'}
                        </Badge>
                      ) : '—'}
                    </td>
                    <td className="text-end">
                      {rental.depositAmount && rental.depositStatus !== 'returned' ? (
                        <Button size="sm" variant="outline-secondary" onClick={() => void markDepositReturned(rental)}>
                          Return deposit
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="hub-panel mb-4">
        <Card.Header>Record payment</Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => void recordPayment(e)}>
            <Form.Group className="mb-3">
              <Form.Label>Rental</Form.Label>
              <Form.Select value={selectedRentalId} onChange={(e) => setSelectedRentalId(e.target.value)} required>
                <option value="">Select rental…</option>
                {rentals.map((rental) => (
                  <option key={rental.id} value={String(rental.id)}>
                    {formatWhen(rental.start)} — {rental.facility}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (NZD)</Form.Label>
              <Form.Control type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Method</Form.Label>
              <Form.Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                <option value="cash">Cash</option>
                <option value="bank">Bank transfer</option>
                <option value="invoice">Invoice</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control value={notes} onChange={(e) => setNotes(e.target.value)} />
            </Form.Group>
            <Button type="submit" disabled={busy || !selectedRentalId}>
              {busy ? 'Saving…' : 'Record payment'}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {payments.length > 0 && (
        <Card className="hub-panel">
          <Card.Header>Payment history</Card.Header>
          <Card.Body>
            <Table responsive size="sm" className="mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.date}</td>
                    <td>${payment.amount}</td>
                    <td>{payment.method}</td>
                    <td>{payment.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}
