import { Routes, Route } from 'react-router-dom';
import App from './App';
import {
  Faq,
  Home,
  Login,
  MatchLineup,
  MatchLocation,
  MatchWeather,
  PageNotFound,
  Profile,
  Register,
} from './routes';

function RouteSwitch() {
  return (
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='profile' element={<Profile />} />
        <Route path='lineup' element={<MatchLineup />} />
        <Route path='weather' element={<MatchWeather />} />
        <Route path='location' element={<MatchLocation />} />
        <Route path='faq' element={<Faq />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}

export default RouteSwitch;
