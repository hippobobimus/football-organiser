import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { setupStore } from '../app/store';
import { userGenerator } from './dataGenerators';
import { db } from './server/db';
import { hash } from './server/utils';

export const createUser = (userProperties) => {
  const user = userGenerator(userProperties);
  db.user.create({ ...user, password: hash(user.password) });
  return user;
};

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
