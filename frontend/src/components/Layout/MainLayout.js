import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import uniqid from 'uniqid';

import { Navbar } from '../navbar';
import { Content, Subtitle } from '../styles';
import { Spinner } from '../spinner';

import { fetchAuthUser } from '../../features/auth';

const TITLE = 'Bib Game Players';
const MENU_ITEMS = [
  { uid: uniqid(), text: 'Next Match', path: '/next-match' },
  { uid: uniqid(), text: 'Calendar', path: '/calendar' },
  { uid: uniqid(), text: 'My Profile', path: '/profile' },
];
const RESPONSIVE_BREAKPOINT = {
  width: 900,
};

const ErrorDisplay = ({ status, msg }) => {
  if (status !== 'error') {
    return null;
  }
  return (
    <>
      <Subtitle>Something went wrong...</Subtitle>
      <p>{msg}</p>
    </>
  );
};

const Loading = ({ status }) => {
  if (status !== 'loading') {
    return null;
  }
  return <Spinner />;
};

export const MainLayout = ({ children }) => {
  const dispatch = useDispatch();

  const { isLoggedIn, authUserStatus, authUserMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn && authUserStatus === 'idle') {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, authUserStatus, isLoggedIn]);

  return (
    <>
      <Navbar
        title={TITLE}
        menuItems={MENU_ITEMS}
        widthBreakpoint={RESPONSIVE_BREAKPOINT.width}
      />
      <Content>
        <ErrorDisplay status={authUserStatus} msg={authUserMessage} />
        <Loading status={authUserStatus} />
        {(authUserStatus === 'success' || authUserStatus === 'idle') &&
          children}
      </Content>
    </>
  );
};
