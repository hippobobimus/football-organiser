import { Navigate, Outlet } from 'react-router-dom';

import { MainLayout } from '../components/Layout';

import Profile from '../features/auth/Profile';
import EditProfile from '../features/auth/EditProfile';
import EditPassword from '../features/auth/EditPassword';
import Event from '../features/events/Event';
import EditEvent from '../features/events/EditEvent';
import AddAttendee from '../features/events/AddAttendee';
import Calendar from '../features/events/Calendar';
import PageNotFound from '../components/PageNotFound';

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const privateRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      // redirect since already logged in
      { path: 'login', element: <Navigate replace to="/profile" /> },
      { path: 'register', element: <Navigate replace to="/profile" /> },

      { path: 'profile', element: <Profile /> },
      { path: 'edit-profile', element: <EditProfile /> },
      { path: 'edit-password', element: <EditPassword /> },
      { path: 'calendar', element: <Calendar /> },
      { path: 'events/:id', element: <Event /> },
      { path: 'events/:id/edit', element: <EditEvent /> },
      { path: 'events/:id/add-user', element: <AddAttendee /> },
      { path: 'next-match', element: <Event nextMatch /> },
      { path: '*', element: <PageNotFound /> },
    ],
  },
];
