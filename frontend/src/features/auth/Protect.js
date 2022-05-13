import { useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const Protect = () => {
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Outlet />;
  }

  // redirect to login, storing intended destination to return to after
  // authentication is completed.
  return <Navigate to='/login' state={{ from: location }} replace />;
};

export default Protect;
