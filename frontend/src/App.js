import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import uniqid from 'uniqid';

import GlobalStyle from './GlobalStyle';
import { Navbar } from './components';
import { Card, Content } from './components/styles.js';
import theme from './theme.js';

const App = () => {
  const title = 'Bib Game Players';
  
  const menuItems = [
    { uid: uniqid(), text: 'Next Match', path: '/next-match' },
    { uid: uniqid(), text: 'Calendar', path: '/calendar' },
    { uid: uniqid(), text: 'My Profile', path: '/profile' },
  ];

  const responsiveBreakpoint = {
    width: 900,
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar
        title={title}
        menuItems={menuItems}
        widthBreakpoint={responsiveBreakpoint.width}
      />
      <Content>
        <Card>
          <Outlet />
        </Card>
      </Content>
    </ThemeProvider>
  );
};

export default App;
