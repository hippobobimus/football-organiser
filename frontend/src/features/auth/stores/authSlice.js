import { createSlice } from '@reduxjs/toolkit';

import { apiSlice } from '../../api/apiSlice';

const initialState = {
  accessToken: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.isLoggedIn = true;
    },
    loggedOut: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.isLoggedIn = true;
        }
      )
      .addMatcher(
        apiSlice.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.isLoggedIn = true;
        }
      )
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, () => initialState);
  },
});

export const { setAccessToken, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
