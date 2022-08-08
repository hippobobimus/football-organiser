import { Route, Routes, Navigate } from 'react-router-dom';

import { MainLayout } from '../components/Layout';
import { AuthRoutes, Protect } from '../features/auth';

import CreateEvent from '../features/events/CreateEvent';
import Event from '../features/events/Event';
import EditEvent from '../features/events/EditEvent';
import AddAttendee from '../features/events/AddAttendee';
import Calendar from '../features/events/Calendar';
import PageNotFound from '../components/PageNotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate replace to="/next-match" />} />
        <Route path="*" element={<AuthRoutes />} />

        {/* Private routes that require authentication */}
        <Route element={<Protect allowedRoles={['admin', 'user']} />}>
          <Route path="calendar" element={<Calendar />} />
          <Route path="events/:id" element={<Event />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="events/:id/add-user" element={<AddAttendee />} />
          <Route path="next-match" element={<Event nextMatch />} />
        </Route>

        {/* Private routes that require admin privileges */}
        <Route element={<Protect allowedRoles={['admin']} />}>
          <Route
            path="create-match"
            element={<CreateEvent category="match" />}
          />
          <Route
            path="create-social"
            element={<CreateEvent category="social" />}
          />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};
