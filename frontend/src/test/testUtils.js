import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { setupStore } from '../app/store';
import { eventGenerator, userGenerator } from './dataGenerators';
import { db } from './server/db';
import { authenticate, hash } from './server/utils';

export const createUser = (userProperties) => {
  const userInput = userGenerator(userProperties);
  const user = db.user.create({
    ...userInput,
    password: hash(userInput.password),
  });
  return { ...user, password: userInput.password };
};

export const createEvent = (eventProperties) => {
  const eventInput = eventGenerator(eventProperties);
  const event = db.event.create(eventInput);
  return event;
};

export const loginAsUser = (user) => {
  return authenticate({ ...user, currentPassword: user.password });
};

const customRender = (
  ui,
  {
    preloadedState = {},
    store,
    initialRouterEntries = ['/'],
    user,
    ...renderOptions
  } = {}
) => {
  // if user is provided, login
  if (user) {
    const { accessToken } = loginAsUser(user);

    if (preloadedState?.auth) {
      preloadedState.auth.accessToken = accessToken;
      preloadedState.auth.isLoggedIn = true;
    } else {
      preloadedState = {
        ...preloadedState,
        auth: { accessToken, isLoggedIn: true },
      };
    }
  }

  if (!store) {
    store = setupStore(preloadedState);
  }

  const Wrapper = ({ children }) => {
    return (
      <MemoryRouter initialEntries={initialRouterEntries}>
        <Provider store={store}>{children}</Provider>
      </MemoryRouter>
    );
  };

  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export * from '@testing-library/react';

export { customRender as render, userEvent };
