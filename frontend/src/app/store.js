import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import currentUserReducer from '../features/currentUser/currentUserSlice';
import eventsReducer from '../features/events/eventsSlice';
import attendeesReducer from '../features/events/attendees/attendeesSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currentUser: currentUserReducer,
    events: eventsReducer,
    attendees: attendeesReducer,
    users: usersReducer,
  },
});
