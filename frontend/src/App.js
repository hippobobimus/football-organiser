import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import uniqid from 'uniqid';

import GlobalStyle from './GlobalStyle';
import { Navbar } from './components';
import { Spinner } from './components/spinner';
import { Content, Subtitle } from './components/styles.js';
import theme from './theme.js';
import { fetchAuthUser } from './features/auth/authSlice';

const App = () => {
  const dispatch = useDispatch();

  const title = 'Bib Game Players';

  const menuItems = [
    { uid: uniqid(), text: 'Next Match', path: '/next-match' },
    { uid: uniqid(), text: 'Calendar', path: '/calendar' },
    { uid: uniqid(), text: 'My Profile', path: '/profile' },
  ];

  const responsiveBreakpoint = {
    width: 900,
  };

  const { isLoggedIn, authUserStatus, authUserMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn && authUserStatus === 'idle') {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, authUserStatus, isLoggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar
        title={title}
        menuItems={menuItems}
        widthBreakpoint={responsiveBreakpoint.width}
      />
      <Content>
        {authUserStatus === 'error' && (
          <>
            <Subtitle>Something went wrong...</Subtitle>
            <p>{authUserMessage}</p>
          </>
        )}
        {authUserStatus === 'loading' && <Spinner />}
        {(authUserStatus === 'success' || authUserStatus === 'idle') && (
          <Outlet />
        )}
      </Content>
    </ThemeProvider>
  );
};

export default App;
