import { Route, Routes } from 'react-router-dom';

import { Protect } from '../../auth';
import { EventLayout } from '../components/Layout';
import { Calendar } from './Calendar';

// TODO port to rtk query
import Event from '../Event';
import EditEvent from '../EditEvent';
import AddAttendee from '../AddAttendee';
import CreateEvent from '../CreateEvent';

export const EventsRoutes = () => {
  return (
    <Routes>
      <Route element={<Protect allowedRoles={['admin', 'user']} />}>
        <Route index element={<Calendar />} />

        <Route path=":eventId" element={<EventLayout />}>
          <Route index element={<Event />} />
          <Route path="edit" element={<EditEvent />} />
          <Route path="add-user" element={<AddAttendee />} />
          <Route path="*" element={<p>not found</p>} />
        </Route>

        <Route path="next-match" element={<Event nextMatch />} />
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
