import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Spinner } from '../../../components/spinner';
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
    return <p>{`Error: ${error.message || error.data?.message || error}`}</p>;
  }

  if (isLoggedIn && user) {
    return allowedRoles.includes(user?.role) ? (
      <Outlet />
    ) : (
      <p>unauthorised...</p>
    );
  }

  // store intended destination to return to after authentication is completed.
  return <Navigate to="/login" state={{ from: location }} replace />;
};
