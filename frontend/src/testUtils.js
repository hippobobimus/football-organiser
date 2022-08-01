import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { setupStore } from './app/store';

export const render = (
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    initialRouterEntries = ['/'],
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return (
      <MemoryRouter initialEntries={initialRouterEntries}>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );
  };

  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
};
