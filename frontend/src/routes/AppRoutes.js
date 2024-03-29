import { Route, Routes, Navigate } from 'react-router-dom';

import { MainLayout } from '../components/Layout';
import { AuthRoutes } from '../features/auth';
import { EventsRoutes } from '../features/events';
import { PageNotFound } from '../components/PageNotFound';

const title = 'Bib Game Players';

const navbarEntries = [
  { text: 'Next Match', path: '/events/next-match' },
  { text: 'Events', path: '/events', end: true },
  { text: 'My Profile', path: '/auth/profile' },
];

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainLayout title={title} navbarEntries={navbarEntries} />}
      >
        <Route index element={<Navigate replace to="/events/next-match" />} />

        {/* Redirects for convenient access to common pages. */}
        <Route path="login" element={<Navigate replace to="/auth/login" />} />
        <Route
          path="register"
          element={<Navigate replace to="/auth/register" />}
        />
        <Route
          path="profile"
          element={<Navigate replace to="/auth/profile" />}
        />
        <Route
          path="next-match"
          element={<Navigate replace to="/events/next-match" />}
        />

        <Route path="auth/*" element={<AuthRoutes />} />
        <Route path="events/*" element={<EventsRoutes />} />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};
