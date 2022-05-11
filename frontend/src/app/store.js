import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice';
import currentUserReducer from '../features/currentUser/currentUserSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    currentUser: currentUserReducer,
  },
});
