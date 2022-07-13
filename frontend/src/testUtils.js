import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './app/store';

export const appRender = (initialRouterEntries, component) => {
  const initialEntries =
    initialRouterEntries?.length > 0 ? initialRouterEntries : ['/'];

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Provider store={store}>{component}</Provider>
    </MemoryRouter>
  );
};
