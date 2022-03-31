import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import uniqid from 'uniqid';
import Navbar from './components/Navbar';
import theme from './theme.js';

function App() {
  const menuItems = [
    { uid: uniqid(), text: 'Home', path: '/' },
    { uid: uniqid(), text: 'Lineup', path: '/lineup' },
    { uid: uniqid(), text: 'Weather', path: '/weather' },
    { uid: uniqid(), text: 'Location', path: '/location' },
    { uid: uniqid(), text: 'FAQ', path: '/faq' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Navbar title='Bib Game Players' menuItems={menuItems}/>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
