import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Spinner } from '../../../components/spinner';
import { DisplayError } from '../../../components/DisplayError';
import { DisplayUnauthorised } from './DisplayUnauthorised';
import { useGetAuthUserQuery } from '../api/authApiSlice';

export const Protect = ({ allowedRoles }) => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useGetAuthUserQuery(null, {
    skip: !isLoggedIn,
    pollingInterval: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <DisplayError error={error} />;
  }

  if (isLoggedIn && user) {
    return allowedRoles.includes(user?.role) ? (
      <Outlet />
    ) : (
      <DisplayUnauthorised />
    );
  }

  // store intended destination to return to after authentication is completed.
  return <Navigate to="/login" state={{ from: location }} replace />;
};
