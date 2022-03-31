import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouteSwitch from './RouteSwitch';

const container = document.getElementById('root');

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RouteSwitch />
    </BrowserRouter>
  </React.StrictMode>,
);
