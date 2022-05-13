import { Routes, Route } from 'react-router-dom';

import App from './App';
import {
  Faq,
  Home,
  MatchLineup,
  MatchLocation,
  MatchWeather,
  PageNotFound,
} from './routes';
import Protect from './features/auth/Protect';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Profile from './features/currentUser/Profile';
import EditProfile from './features/currentUser/EditProfile';
import EditPassword from './features/currentUser/EditPassword';

const RouteSwitch = () => {
  return (
    <Routes>
      <Route path='/' element={<App />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />

        {/* Private routes that require authentication */}
        <Route element={<Protect />}>
          <Route path='profile' element={<Profile />} />
          <Route path='edit-profile' element={<EditProfile />} />
          <Route path='edit-password' element={<EditPassword />} />
        </Route>

        <Route path='lineup' element={<MatchLineup />} />
        <Route path='weather' element={<MatchWeather />} />
        <Route path='location' element={<MatchLocation />} />
        <Route path='faq' element={<Faq />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default RouteSwitch;
