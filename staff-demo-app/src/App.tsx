import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { IS_SHOWCASE_MODE } from '@/config/showcaseMode';

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const BookingImportPage = lazy(() => import('@/features/imports/BookingImportPage'));
const RentersPage = lazy(() => import('@/features/renters/RentersPage'));
const RenterDetailPage = lazy(() => import('@/features/renters/RenterDetailPage'));

const HouseholdsPage = lazy(() => import('@/features/households/HouseholdsPage'));
const HouseholdDetailPage = lazy(() => import('@/features/households/HouseholdDetailPage'));
const DogFormPage = lazy(() => import('@/features/dogs/DogFormPage'));
const DogsPage = lazy(() => import('@/features/dogs/DogsPage'));
const DogRedirectPage = lazy(() => import('@/features/dogs/DogRedirectPage'));
const LogsPage = lazy(() => import('@/features/logs/LogsPage'));
const LogSessionPage = lazy(() => import('@/features/logs/LogSessionPage'));
const SessionReportPage = lazy(() => import('@/features/logs/SessionReportPage'));
const SchedulePage = lazy(() => import('@/features/schedule/SchedulePage'));
const FocusPage = lazy(() => import('@/features/focus/FocusPage'));
const ReportsPage = lazy(() => import('@/features/reports/ReportsPage'));
const IntegrityPage = lazy(() => import('@/features/integrity/IntegrityPage'));
const ActivityPage = lazy(() => import('@/features/activity/ActivityPage'));

function PageLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
}

function ShowcaseRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/imports/bookings" element={<BookingImportPage />} />
        <Route path="/renters" element={<RentersPage />} />
        <Route path="/renters/:renterId" element={<RenterDetailPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function LiveRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/households" element={<HouseholdsPage />} />
        <Route path="/households/new" element={<HouseholdDetailPage />} />
        <Route path="/households/:ownerId/dogs/new" element={<DogFormPage />} />
        <Route path="/households/:ownerId/dogs/:dogId" element={<DogFormPage />} />
        <Route path="/households/:id" element={<HouseholdDetailPage />} />
        <Route path="/dogs" element={<DogsPage />} />
        <Route path="/dogs/:dogId" element={<DogRedirectPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/logs/new" element={<LogSessionPage />} />
        <Route path="/logs/report" element={<SessionReportPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/integrity" element={<IntegrityPage />} />
        <Route path="/imports/bookings" element={<BookingImportPage />} />
        <Route path="/renters" element={<RentersPage />} />
        <Route path="/renters/:renterId" element={<RenterDetailPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          {IS_SHOWCASE_MODE ? <ShowcaseRoutes /> : <LiveRoutes />}
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
