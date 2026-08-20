import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { APP_VERSION } from '@/services/config';
import { labels } from '@/data/terminology';
import { IS_SHOWCASE_MODE } from '@/config/showcaseMode';

export default function LoginPage() {
  const { login, user, usesFirebaseAuth, authError } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const enterShowcase = async () => {
    const result = await login('demo', 'demo');
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <Card className="shadow login-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <i className="bi bi-building text-primary" style={{ fontSize: '3rem' }} />
                  <h2 className="mt-2">{labels.appName}</h2>
                  <p className="text-muted">{labels.appTagline}</p>
                  <span className="badge bg-primary">v{APP_VERSION}</span>
                </div>
                {IS_SHOWCASE_MODE ? (
                  <>
                    <p className="small text-muted text-center mb-3">
                      Import bookings from the public demo, manage renters, and track payments — all with sample data.
                    </p>
                    {authError && <Alert variant="warning">{authError}</Alert>}
                    <Button variant="primary" className="w-100" onClick={enterShowcase}>
                      Enter staff demo
                    </Button>
                  </>
                ) : (
                  <>
                    {usesFirebaseAuth ? (
                      <p className="small text-muted text-center mb-3">
                        Sign in with your Firebase account. Database access requires authentication.
                      </p>
                    ) : (
                      <p className="small text-warning text-center mb-3">
                        Firebase not configured — offline dev login only.
                      </p>
                    )}
                    {authError && <Alert variant="warning">{authError}</Alert>}
                    <p className="small text-center text-muted">Use configured admin credentials for live mode.</p>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
