import { Navigate, Route, Routes } from 'react-router-dom';

import { Protect } from '../../auth';
import { EventLayout } from '../components/Layout';
import { Calendar } from './Calendar';
import { CreateEvent } from './CreateEvent';
import { AuthUserAttendance } from './AuthUserAttendance';
import { EventLocation } from './EventLocation';

// TODO port to rtk query
//import EditEvent from '../EditEvent';
//import AddAttendee from '../AddAttendee';

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

        <Route
          path=":eventId"
          element={<EventLayout navItems={eventNavItems} />}
        >
          <Route index element={<Navigate to="me" replace={true} />} />
          <Route path="me" element={<AuthUserAttendance />} />
          <Route path="location" element={<EventLocation />} />
          {/* TODO
          <Route path='lineup' element={<UserAttendanceSummary />} />
          <Route path="edit" element={<EditEvent />} />
          <Route path="add-user" element={<AddAttendee />} />
          <Route path="*" element={<p>not found</p>} />
          */}
        </Route>

        {/* TODO
        <Route path="next-match" element={<Event nextMatch />} />
          */}
      </Route>

      <Route element={<Protect allowedRoles={['admin']} />}>
        <Route path="create-match" element={<CreateEvent category="match" />} />
        <Route
          path="create-social"
          element={<CreateEvent category="social" />}
        />
      </Route>
    </Routes>
  );
};
