import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

import { Subtitle } from '../../components/styles';
import { Spinner } from '../../components/spinner';
import { fetchAuthUser } from './authSlice';

const ProtectAdmin = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isLoggedIn, authUser, authUserStatus, authUserMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn && authUserStatus === 'idle') {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, authUserStatus, isLoggedIn]);

  if (authUserStatus === 'error') {
    return (
      <>
        <Subtitle>Something went wrong...</Subtitle>
        <p>{authUserMessage}</p>
      </>
    );
  }

  if (!isLoggedIn) {
    // redirect to login, storing intended destination to return to after
    // authentication is completed.
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (authUserStatus === 'loading' || authUserStatus === 'idle') {
    return <Spinner />;
  }

  if (authUser?.role === 'admin') {
    return <Outlet />;
  }

  return (
    <>
      <Subtitle>Access denied</Subtitle>
      <p>You must be an admin to view this resource</p>
    </>
  );
};

export default ProtectAdmin;
