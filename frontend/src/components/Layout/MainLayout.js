import { Outlet } from 'react-router-dom';
import uniqid from 'uniqid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from '../navbar';
import { Content } from '../styles';

const TITLE = 'Bib Game Players';
const MENU_ITEMS = [
  { uid: uniqid(), text: 'Next Match', path: '/next-match' },
  { uid: uniqid(), text: 'Calendar', path: '/calendar' },
  { uid: uniqid(), text: 'My Profile', path: '/profile' },
];
const RESPONSIVE_BREAKPOINT = {
  width: 900,
};

export const MainLayout = () => {
  return (
    <>
      <Navbar
        title={TITLE}
        menuItems={MENU_ITEMS}
        widthBreakpoint={RESPONSIVE_BREAKPOINT.width}
      />
      <Content>
        <ToastContainer position="bottom-center" />
        <Outlet />
      </Content>
    </>
  );
};
