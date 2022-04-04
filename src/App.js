import { Outlet } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { Navbar } from './components';
import globals from './globals.js';
import theme from './theme.js';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
        <Navbar title={globals.title} menuItems={globals.menuItems} widthBreakpoint={globals.responsiveBreakpoint.width}/>
        <Outlet />
    </ThemeProvider>
  );
}

export default App;
