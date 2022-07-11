import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './app/store';
import RouteSwitch from './RouteSwitch';

const container = document.getElementById('root');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <RouteSwitch />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
