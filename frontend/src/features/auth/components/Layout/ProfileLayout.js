import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Subtitle } from '../../../../components/styles';

export const ProfileLayout = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  return (
    <>
      <Subtitle>Hi {user.firstName}!</Subtitle>
      <Outlet />
    </>
  );
};
