import { Outlet } from 'react-router-dom';
import uniqid from 'uniqid';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from '../navbar';
import { Content } from '../styles';
import { RESPONSIVE_BREAKPOINT } from '../../config';

export const MainLayout = ({ title, navbarEntries }) => {
  const menuItems = navbarEntries.map((entry) => ({ uid: uniqid(), ...entry }));

  return (
    <>
      <Navbar
        title={title}
        menuItems={menuItems}
        widthBreakpoint={RESPONSIVE_BREAKPOINT.width}
      />
      <Content>
        <ToastContainer position="bottom-center" />
        <Outlet />
      </Content>
    </>
  );
};
