import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IS_SHOWCASE_MODE } from '@shared/showcaseMode';
import ScrollToAnchor from './components/ScrollToAnchor';
import HomePage from './pages/HomePage';
import RentalsPage from './pages/RentalsPage';
import BookPage from './pages/BookPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EventsPage from './pages/EventsPage';
import CoursesPage from './pages/CoursesPage';
import EducationPage from './pages/EducationPage';
import CompostPage from './pages/CompostPage';
import KaiResiliencePage from './pages/KaiResiliencePage';
import VolunteeringPage from './pages/VolunteeringPage';
import TeamPage from './pages/TeamPage';

export default function App() {
  if (IS_SHOWCASE_MODE) {
    return (
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
        <ScrollToAnchor />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/rentals/book" element={<BookPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
      <ScrollToAnchor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/bespoke-education" element={<EducationPage />} />
        <Route path="/rentals" element={<RentalsPage />} />
        <Route path="/rentals/book" element={<BookPage />} />
        <Route path="/compost" element={<CompostPage />} />
        <Route path="/kai-resilience" element={<KaiResiliencePage />} />
        <Route path="/getting-involved" element={<VolunteeringPage />} />
        <Route path="/our-team" element={<TeamPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
