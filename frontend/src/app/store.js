import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { authReducer } from '../features/auth';
import eventsReducer from '../features/events/eventsSlice';
import usersReducer from '../features/users/usersSlice';
import { apiSlice } from '../features/api/apiSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  events: eventsReducer,
  users: usersReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'store/purge') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState,
  });
};
