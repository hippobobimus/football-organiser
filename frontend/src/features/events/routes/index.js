import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { useGetAuthUserQuery } from '../../auth/api/authApiSlice';
import { Protect } from '../../auth';
import { EventMainLayout, EventTabLayout } from '../components/Layout';
import { Calendar } from './Calendar';
import { CreateEvent } from './CreateEvent';
import { AuthUserAttendance } from './AuthUserAttendance';
import { EventLocation } from './EventLocation';
import { Attendance } from './Attendance';
import { AddAttendee } from './AddAttendee';
import { EditEvent } from './EditEvent';
import { PageNotFound } from '../../../components/PageNotFound';
import { AnimatePresence } from 'framer-motion';

const EventTabRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path="me" element={<AuthUserAttendance />} />
        <Route path="location" element={<EventLocation />} />
        <Route path="lineup" element={<Attendance />} />
        <Route element={<Protect allowedRoles={['admin']} />}>
          <Route path="edit" element={<EditEvent />} />
          <Route path="lineup/add-user" element={<AddAttendee />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export const EventsRoutes = () => {
  const { data: authUser } = useGetAuthUserQuery();

  const eventNavItems = [
    { text: 'Me', path: 'me' },
    { text: 'Lineup', path: 'lineup' },
    { text: 'Location', path: 'location' },
  ];

  if (authUser?.isAdmin) {
    eventNavItems.push({ text: 'Edit', path: 'edit' });
  }

  return (
    <Routes>
      <Route element={<Protect allowedRoles={['admin', 'user']} />}>
        <Route index element={<Calendar />} />

        <Route path=":eventId" element={<EventMainLayout />}>
          <Route element={<EventTabLayout navItems={eventNavItems} />}>
            <Route index element={<Navigate to="me" replace={true} />} />
            <Route path="*" element={<EventTabRoutes />} />
          </Route>
        </Route>
      </Route>

      <Route element={<Protect allowedRoles={['admin']} />}>
        <Route path="create-match" element={<CreateEvent category="match" />} />
        <Route
          path="create-social"
          element={<CreateEvent category="social" />}
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
