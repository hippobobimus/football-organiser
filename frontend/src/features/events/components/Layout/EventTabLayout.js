import { Outlet } from 'react-router-dom';

import { Tabs } from './Tabs';
import { EventAdminPanel } from '../Admin';
import { useGetAuthUserQuery } from '../../../auth/api/authApiSlice';

export const EventTabLayout = ({ navItems }) => {
  const { data: user } = useGetAuthUserQuery();

  return (
    <>
      <Tabs navItems={navItems}>
        <Outlet />
      </Tabs>
      {user?.isAdmin && <EventAdminPanel />}
    </>
  );
};
