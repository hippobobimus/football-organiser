import { Outlet } from 'react-router-dom';

import { Tabs } from './Tabs';
import { EventAdminPanel } from '../Admin';

export const EventTabLayout = ({ navItems }) => {
  return (
    <>
      <Tabs navItems={navItems}>
        <Outlet />
      </Tabs>
      <EventAdminPanel />
    </>
  );
};
