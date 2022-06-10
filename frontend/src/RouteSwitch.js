import { Routes, Route, Navigate } from 'react-router-dom';

import App from './App';
import PageNotFound from './components/PageNotFound';
import Protect from './features/auth/Protect';
import ProtectAdmin from './features/auth/ProtectAdmin';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Profile from './features/auth/Profile';
import EditProfile from './features/auth/EditProfile';
import EditPassword from './features/auth/EditPassword';
import NextMatch from './features/events/NextMatch';
import CreateEvent from './features/events/CreateEvent';
import Event from './features/events/Event';
import EditEvent from './features/events/EditEvent';
import Calendar from './features/events/Calendar';

const RouteSwitch = () => {
  return (
    <Routes>
      <Route path='/' element={<App />}>
        {/* Public routes */}
        <Route index element={<Navigate replace to='/next-match' />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />

        {/* Private routes that require authentication */}
        <Route element={<Protect />}>
          <Route path='profile' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='edit-password' element={<EditPassword />} />
          <Route path='calendar' element={<Calendar />} />
          <Route path='events/:id' element={<Event />} />
          <Route path='events/:id/edit' element={<EditEvent />} />
          <Route path='next-match' element={<NextMatch />} />
        </Route>

        {/* Private routes that require admin privileges */}
        <Route element={<ProtectAdmin />}>
          <Route path='create-match' element={<CreateEvent category='match' />} />
          <Route path='create-social' element={<CreateEvent category='social' />} />
        </Route>

        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default RouteSwitch;
