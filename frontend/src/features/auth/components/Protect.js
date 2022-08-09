import { Spinner } from '../../../components/spinner';
import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useGetAuthUserQuery } from '../api/authApiSlice';

export const Protect = ({ allowedRoles }) => {
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const {
    data: user,
    isLoading,
    isError,
  } = useGetAuthUserQuery(null, { skip: !isLoggedIn });

  if (isLoading) {
    return <Spinner />;
  }
  if (isLoggedIn && user) {
    return allowedRoles.includes(user?.role) ? (
      <Outlet />
    ) : (
      <p>unauthorised...</p>
    );
  }
  if (isError) {
    return <p>Error</p>;
  }

  // redirect to login, storing intended destination to return to after
  // authentication is completed.
  return <Navigate to="/login" state={{ from: location }} replace />;
};
