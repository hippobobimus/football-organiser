import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';

import GlobalStyle from '../GlobalStyle';
import { setupStore } from '../app/store';
import theme from '../theme';

export const AppProvider = ({ children }) => {
  return (
    <Provider store={setupStore()}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>{children}</Router>
      </ThemeProvider>
    </Provider>
  );
};
