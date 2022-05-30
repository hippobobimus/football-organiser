import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import currentUserReducer from '../features/currentUser/currentUserSlice';
import eventsReducer from '../features/events/eventsSlice';
import attendeesReducer from '../features/events/attendees/attendeesSlice';
import usersReducer from '../features/users/usersSlice';

const combinedReducer = combineReducers({
  auth: authReducer,
  currentUser: currentUserReducer,
  events: eventsReducer,
  attendees: attendeesReducer,
  users: usersReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'store/purge') {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
