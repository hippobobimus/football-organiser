import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from './GlobalStyle';
import { Navbar } from './components';
import { Card, Content } from './components/styles.js';
import globals from './globals.js';
import theme from './theme.js';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Navbar
        title={globals.title}
        menuItems={globals.menuItems}
        widthBreakpoint={globals.responsiveBreakpoint.width}
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
