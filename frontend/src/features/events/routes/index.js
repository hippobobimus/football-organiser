import { Navigate, Route, Routes } from 'react-router-dom';

import { Protect } from '../../auth';
import {
  EventMainLayout,
  EventTabLayout,
  EventEditLayout,
} from '../components/Layout';
import { Calendar } from './Calendar';
import { CreateEvent } from './CreateEvent';
import { AuthUserAttendance } from './AuthUserAttendance';
import { EventLocation } from './EventLocation';
import { Attendance } from './Attendance';
import { AddAttendee } from './AddAttendee';
import { EditEvent } from './EditEvent';
import { PageNotFound } from '../../../components/PageNotFound';

export const EventsRoutes = () => {
  const eventNavItems = [
    { text: 'Me', path: 'me' },
    { text: 'Lineup', path: 'lineup' },
    { text: 'Location', path: 'location' },
  ];

  return (
    <Routes>
      <Route element={<Protect allowedRoles={['admin', 'user']} />}>
        <Route index element={<Calendar />} />

        <Route path=":eventId" element={<EventMainLayout />}>
          <Route element={<EventTabLayout navItems={eventNavItems} />}>
            <Route index element={<Navigate to="me" replace={true} />} />
            <Route path="me" element={<AuthUserAttendance />} />
            <Route path="location" element={<EventLocation />} />
            <Route path="lineup" element={<Attendance />} />
          </Route>

          <Route element={<Protect allowedRoles={['admin']} />}>
            <Route element={<EventEditLayout />}>
              <Route path="lineup/add-user" element={<AddAttendee />} />
              <Route path="edit" element={<EditEvent />} />
            </Route>
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
