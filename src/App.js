import { Outlet } from 'react-router-dom';
import uniqid from 'uniqid';
import Navbar from './components/Navbar';

function App() {
  const menuItems = [
    { uid: uniqid(), text: 'Home', path: '/' },
    { uid: uniqid(), text: 'Lineup', path: '/lineup' },
    { uid: uniqid(), text: 'Weather', path: '/weather' },
    { uid: uniqid(), text: 'Location', path: '/location' },
    { uid: uniqid(), text: 'FAQ', path: '/faq' },
  ];

  return (
    <div>
      <Navbar menuItems={menuItems}/>
      <Outlet />
    </div>
  );
}

export default App;
