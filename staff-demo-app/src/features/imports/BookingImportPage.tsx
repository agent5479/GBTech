import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Badge,
  Button,
  Card,
  Form,
  Modal,
  Nav,
  Spinner,
  Table,
} from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useTenantData } from '@/contexts/TenantDataContext';
import { labels } from '@/data/terminology';
import { recordActivity } from '@/services/activityLog';
import {
  fetchPendingBookings,
  importPlanPaths,
  isBookingImportConfigured,
  markBookingDismissed,
  markBookingImported,
  planRentalImport,
  type RentalImportPlan,
  type PendingBooking,
} from '@/services/bookingImport';
import { activityActorFromUser, mutate, tenantPath } from '@/services/mutations';
import type { ActivityEvent } from '@/types';

function formatWhen(booking: PendingBooking): string {
  const start = new Date(booking.appointmentStart);
  if (Number.isNaN(start.getTime())) return '—';
  return start.toLocaleString('en-NZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '—';
  return date.toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function planPreviewBadges(plan: RentalImportPlan | null) {
  if (!plan) {
    return <Badge bg="secondary">Already imported or missing required fields</Badge>;
  }
  return (
    <>
      <Badge bg={plan.renterIsNew ? 'success' : 'info'} className="me-1">
        {plan.renterIsNew ? 'New renter' : 'Match renter by contact'}
      </Badge>
      <Badge bg="light" text="dark" className="me-1">+ rental record</Badge>
      {plan.rental.depositAmount ? (
        <Badge bg="warning" text="dark" className="me-1">Deposit ${plan.rental.depositAmount}</Badge>
      ) : null}
    </>
  );
}

function extendedAssessmentBadges(booking: PendingBooking) {
  if (!booking.extendedJson?.trim()) return null;
  return (
    <Badge bg="warning" text="dark" className="me-1 mt-1">
      Add-ons
    </Badge>
  );
}

export default function BookingImportPage() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const canImport = can('OWNER_CREATE');
  const canDeleteHistory = can('ACTIVITY_DELETE');
  const { data, setData } = useTenantData();
  const [bookings, setBookings] = useState<PendingBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyRow, setBusyRow] = useState<number | null>(null);
  const [deletingHistoryId, setDeletingHistoryId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'handled'>('pending');
  const [reviewBooking, setReviewBooking] = useState<PendingBooking | null>(null);
  const [dismissBooking, setDismissBooking] = useState<PendingBooking | null>(null);
  const [dismissReason, setDismissReason] = useState('');
  const [importedRenterId, setImportedRenterId] = useState('');

  const configured = isBookingImportConfigured();
  const actor = user?.tenantId ? activityActorFromUser(user) : undefined;

  const reviewPlan = useMemo(
    () => (reviewBooking ? planRentalImport(reviewBooking, data) : null),
    [reviewBooking, data]
  );

  const handledBookings = useMemo(
    () => data.activityLog
      .filter((e) => e.action === 'booking_import' || e.action === 'booking_dismiss')
      .slice(0, 30),
    [data.activityLog]
  );

  const loadBookings = useCallback(async () => {
    if (!configured) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const rows = await fetchPendingBookings();
      setBookings(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const appendActivity = (event: Awaited<ReturnType<typeof recordActivity>>) => {
    if (!event) return;
    setData((prev) => ({
      ...prev,
      activityLog: [event, ...prev.activityLog].slice(0, 500),
    }));
  };

  const handleImport = async (booking: PendingBooking) => {
    if (!user?.tenantId || !actor) return;

    const plan = planRentalImport(booking, data);
    if (!plan) {
      setError('This booking is already imported or missing required fields.');
      return;
    }

    setBusyRow(booking.rowIndex);
    setError('');
    setMessage('');

    try {
      const paths = importPlanPaths(user.tenantId, plan);

      await mutate(paths.renterPath, plan.renter, 'booking_import_renter', 'set', () => {
        setData((prev) => {
          const renters = [...prev.renters];
          const index = renters.findIndex((r) => String(r.id) === String(plan.renter.id));
          if (index >= 0) renters[index] = plan.renter;
          else renters.push(plan.renter);
          return { ...prev, renters };
        });
      });

      await mutate(paths.rentalPath, plan.rental, 'booking_import_rental', 'set', () => {
        setData((prev) => ({
          ...prev,
          rentals: [...prev.rentals, plan.rental],
        }));
      });

      await markBookingImported(booking.rowIndex);

      const activityEvent = await recordActivity(actor, 'booking_import', paths.renterPath, 'set', plan.renter, {
        summary: `Imported booking: ${booking.name || booking.organisation || booking.phone} — ${booking.location}`,
        meta: {
          rowIndex: booking.rowIndex,
          email: booking.email,
          renterIsNew: plan.renterIsNew,
          renterId: plan.renter.id,
          rentalId: plan.rental.id,
        },
      });
      appendActivity(activityEvent);

      setBookings((prev) => prev.filter((row) => row.rowIndex !== booking.rowIndex));
      setReviewBooking(null);
      setImportedRenterId(String(plan.renter.id));
      setMessage(`Imported ${booking.name || booking.organisation || 'renter'} — ${booking.location}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusyRow(null);
    }
  };

  const handleDismiss = async () => {
    if (!dismissBooking || !actor) return;

    setBusyRow(dismissBooking.rowIndex);
    setError('');

    try {
      await markBookingDismissed(dismissBooking.rowIndex);

      const activityEvent = await recordActivity(
        actor,
        'booking_dismiss',
        `bookings/sheet/${dismissBooking.rowIndex}`,
        'set',
        dismissBooking,
        {
          summary: `Dismissed booking: ${dismissBooking.name || dismissBooking.organisation || dismissBooking.phone}`,
          meta: {
            rowIndex: dismissBooking.rowIndex,
            email: dismissBooking.email,
            reason: dismissReason.trim() || undefined,
          },
        }
      );
      appendActivity(activityEvent);

      setBookings((prev) => prev.filter((row) => row.rowIndex !== dismissBooking.rowIndex));
      setDismissBooking(null);
      setDismissReason('');
      setMessage(`Dismissed booking for ${dismissBooking.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dismiss failed');
    } finally {
      setBusyRow(null);
    }
  };

  const handleRemoveHistoryEntry = async (event: ActivityEvent) => {
    if (!user?.tenantId || !canDeleteHistory) return;

    setDeletingHistoryId(event.id);
    setError('');

    try {
      await mutate(
        tenantPath(user.tenantId, 'activityLog', event.id),
        null,
        'activity_delete',
        'remove',
        () => {
          setData((prev) => ({
            ...prev,
            activityLog: prev.activityLog.filter((entry) => entry.id !== event.id),
          }));
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove history entry');
    } finally {
      setDeletingHistoryId(null);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2><i className="bi bi-cloud-download me-2" />{labels.bookingImport}</h2>
          <p className="text-muted mb-0">{labels.bookingImportHint}</p>
        </div>
        <Button variant="outline-secondary" onClick={() => void loadBookings()} disabled={!configured || loading}>
          Refresh
        </Button>
      </div>

      {!canImport && (
        <Alert variant="info">View-only access — booking import requires trainer or admin role.</Alert>
      )}

      {!configured && (
        <Alert variant="warning">
          Booking import is not configured. Add <code>VITE_BOOKING_API_URL</code> and <code>VITE_BOOKING_IMPORT_KEY</code> to your environment, redeploy Apps Script with the matching key, and ensure column O <strong>Staff Processed</strong> exists on the Submissions sheet.
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}
      {message && (
        <Alert variant="success">
          {message}
          {importedRenterId && (
            <Link to={`/renters/${importedRenterId}`} className="alert-link ms-1">
              View renter
            </Link>
          )}
        </Alert>
      )}

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
            {labels.bookingPending} ({bookings.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === 'handled'} onClick={() => setActiveTab('handled')}>
            {labels.bookingRecentlyHandled}
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <Card className="hub-panel">
        <Card.Body>
          {activeTab === 'pending' ? (
            loading ? (
              <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : bookings.length === 0 ? (
              <p className="text-muted mb-0">{configured ? 'No pending website bookings to import.' : 'Configure booking import to load submissions.'}</p>
            ) : (
              <Table responsive hover className="align-middle mb-0">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Contact</th>
                    <th>Organisation</th>
                    <th>Facility</th>
                    <th>Preview</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const plan = planRentalImport(booking, data);
                    return (
                      <tr key={booking.rowIndex}>
                        <td>{formatWhen(booking)}</td>
                        <td>
                          <div className="fw-semibold">{booking.name}</div>
                          <div className="small text-muted">{booking.email}</div>
                          <div className="small text-muted">{booking.phone}</div>
                        </td>
                        <td>
                          <div>{booking.organisation || '—'}</div>
                          <div className="small text-muted">{booking.facilityType}</div>
                        </td>
                        <td>
                          <div>{booking.location || '—'}</div>
                          {booking.category && (
                            <Badge bg="secondary" className="mt-1">{booking.category}</Badge>
                          )}
                        </td>
                        <td><div className="d-flex flex-wrap gap-1">{planPreviewBadges(plan)}{extendedAssessmentBadges(booking)}</div></td>
                        <td className="text-end text-nowrap">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="me-1"
                            disabled={!canImport || busyRow === booking.rowIndex}
                            onClick={() => setReviewBooking(booking)}
                          >
                            {labels.bookingReview}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            disabled={!canImport || busyRow === booking.rowIndex}
                            onClick={() => setDismissBooking(booking)}
                          >
                            {labels.bookingDismiss}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )
          ) : handledBookings.length === 0 ? (
            <p className="text-muted mb-0">No import or dismiss actions recorded yet.</p>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Trainer</th>
                  <th>Action</th>
                  <th>Summary</th>
                  {canDeleteHistory && <th className="text-end" style={{ width: '2.5rem' }}></th>}
                </tr>
              </thead>
              <tbody>
                {handledBookings.map((event) => (
                  <tr key={event.id}>
                    <td>{formatTimestamp(event.timestamp)}</td>
                    <td>{event.actorUsername}</td>
                    <td>
                      <Badge bg={event.action === 'booking_import' ? 'success' : 'secondary'}>
                        {event.action === 'booking_import' ? 'Imported' : 'Dismissed'}
                      </Badge>
                    </td>
                    <td>
                      {event.summary}
                      {event.meta?.reason ? (
                        <div className="small text-muted">Reason: {String(event.meta.reason)}</div>
                      ) : null}
                      {event.meta?.ownerId ? (
                        <div className="small">
                          <Link to={`/households/${String(event.meta.ownerId)}`}>View household</Link>
                        </div>
                      ) : null}
                    </td>
                    {canDeleteHistory && (
                      <td className="text-end">
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0 border-0"
                          title={labels.bookingRemoveHistory}
                          aria-label={labels.bookingRemoveHistory}
                          disabled={deletingHistoryId === event.id}
                          onClick={() => void handleRemoveHistoryEntry(event)}
                        >
                          {deletingHistoryId === event.id ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <i className="bi bi-x-lg" aria-hidden="true" />
                          )}
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={Boolean(reviewBooking)} onHide={() => setReviewBooking(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{labels.bookingImportConfirm}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewBooking && (
            <>
              <div className="mb-3">{planPreviewBadges(reviewPlan)}</div>
              <dl className="row mb-0 small">
                <dt className="col-sm-3">Submitted</dt>
                <dd className="col-sm-9">{formatTimestamp(reviewBooking.timestamp)}</dd>
                <dt className="col-sm-3">Appointment</dt>
                <dd className="col-sm-9">
                  {formatWhen(reviewBooking)}
                  {reviewBooking.appointmentEnd && (
                    <span className="text-muted"> → {formatTimestamp(reviewBooking.appointmentEnd)}</span>
                  )}
                </dd>
                <dt className="col-sm-3">Contact</dt>
                <dd className="col-sm-9">{reviewBooking.name} · {reviewBooking.email} · {reviewBooking.phone}</dd>
                <dt className="col-sm-3">Organisation</dt>
                <dd className="col-sm-9">
                  {reviewBooking.organisation || '—'} · {reviewBooking.facilityType || '—'}
                </dd>
                <dt className="col-sm-3">Facility</dt>
                <dd className="col-sm-9">
                  {reviewBooking.location || '—'}
                  {reviewBooking.category ? (
                    <span className="text-muted"> · {reviewBooking.category}</span>
                  ) : null}
                </dd>
                {reviewBooking.addons ? (
                  <>
                    <dt className="col-sm-3">Add-ons</dt>
                    <dd className="col-sm-9">{reviewBooking.addons}</dd>
                  </>
                ) : null}
                <dt className="col-sm-3">Notes</dt>
                <dd className="col-sm-9">{reviewBooking.message?.trim() || '—'}</dd>
                <dt className="col-sm-3">Calendar ID</dt>
                <dd className="col-sm-9"><code>{reviewBooking.calendarEventId || '—'}</code></dd>
              </dl>
              {reviewBooking.extendedJson ? (
                <div className="mt-3 pt-3 border-top">
                  <h6 className="text-muted mb-2">Extended details</h6>
                  <pre className="small mb-0">{reviewBooking.extendedJson}</pre>
                </div>
              ) : null}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setReviewBooking(null)}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!reviewBooking || !reviewPlan || !canImport || busyRow === reviewBooking?.rowIndex}
            onClick={() => reviewBooking && void handleImport(reviewBooking)}
          >
            {busyRow === reviewBooking?.rowIndex ? 'Importing…' : labels.bookingImportConfirm}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Boolean(dismissBooking)} onHide={() => setDismissBooking(null)}>
        <Modal.Header closeButton>
          <Modal.Title>{labels.bookingDismiss}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Dismiss this booking without creating a household? It will be removed from the pending queue.
          </p>
          {dismissBooking && (
            <p className="fw-semibold">{dismissBooking.name} · {dismissBooking.email}</p>
          )}
          <Form.Group>
            <Form.Label>{labels.bookingDismissReason}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              placeholder="Duplicate, spam, cancelled by client…"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDismissBooking(null)}>Cancel</Button>
          <Button
            variant="danger"
            disabled={!dismissBooking || !canImport || busyRow === dismissBooking?.rowIndex}
            onClick={() => void handleDismiss()}
          >
            {busyRow === dismissBooking?.rowIndex ? 'Dismissing…' : labels.bookingDismiss}
          </Button>
        </Modal.Footer>
      </Modal>

      <p className="small text-muted mt-3">
        Review each confirmed booking — import creates or updates a household by email, adds the dog, and links the scheduled session.
        Dismiss clears the row from the queue without importing. Open households from <Link to="/households">Households</Link>.
      </p>
    </div>
  );
}
