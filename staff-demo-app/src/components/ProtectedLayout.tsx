import { Navigate, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useAuth } from '@/contexts/AuthContext';
import { TenantDataProvider } from '@/contexts/TenantDataContext';
import { AppNavbar } from '@/components/AppNavbar';
import { SyncStatusOverlay } from '@/components/SyncStatusOverlay';
import { SyncQueueBanner } from '@/components/SyncQueueBanner';
import { ShowcaseBanner, ShowcaseStaffPitchBar } from '@/components/ShowcaseChrome';
import { IS_SHOWCASE_MODE } from '@/config/showcaseMode';

export function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <TenantDataProvider>
      {IS_SHOWCASE_MODE && <ShowcaseBanner />}
      <AppNavbar />
      {IS_SHOWCASE_MODE && <ShowcaseStaffPitchBar />}
      <Container fluid className="pb-5">
        <SyncQueueBanner />
        <Outlet />
      </Container>
      <SyncStatusOverlay />
    </TenantDataProvider>
  );
}
