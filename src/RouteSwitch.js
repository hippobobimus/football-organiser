import { Routes, Route } from 'react-router-dom';
import App from './App';
import Faq from './routes/Faq';
import Home from './routes/Home';
import MatchLineup from './routes/MatchLineup';
import MatchLocation from './routes/MatchLocation';
import MatchWeather from './routes/MatchWeather';
import PageNotFound from './routes/PageNotFound';

function RouteSwitch() {
  return (
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Home />} />
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
