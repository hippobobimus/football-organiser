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
      <div>
        <Navbar title={globals.title} menuItems={globals.menuItems}/>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
