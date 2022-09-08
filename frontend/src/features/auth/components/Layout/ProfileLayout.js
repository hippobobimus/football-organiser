import { Outlet } from 'react-router-dom';

import { Subtitle } from '../../../../components/styles';
import { useGetAuthUserQuery } from '../../api/authApiSlice';

export const ProfileLayout = () => {
  const { data: user } = useGetAuthUserQuery();

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
