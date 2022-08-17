import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from './authService';
import { apiSlice } from '../../api/apiSlice';

const initialState = {
  accessToken: null,
  isLoggedIn: false,

  authUser: null,
  token: null,
  authUserStatus: 'idle',
  authUserMessage: '',
  updateStatus: 'idle',
  updateMessage: '',
  status: 'idle',
  message: '',
};

export const updateAuthUser = createAsyncThunk(
  'auth/updateAuthUser',
  async (user, thunkAPI) => {
    try {
      return await authService.updateAuthUser(
        thunkAPI.getState().auth.token,
        user
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.isLoggedIn = true;
    },
    loggedOut: () => initialState,

    reset: (state) => {
      state.authUser = null;
      state.authUserStatus = 'idle';
      state.authUserMessage = '';
      state.updateStatus = 'idle';
      state.updateMessage = '';
      state.status = 'idle';
      state.message = '';
    },
    resetUpdate: (state) => {
      state.updateStatus = 'idle';
      state.updateMessage = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(updateAuthUser.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateAuthUser.fulfilled, (state, action) => {
        state.updateStatus = 'success';
        state.authUser = action.payload;
      })
      .addCase(updateAuthUser.rejected, (state, action) => {
        state.updateStatus = 'error';
        state.updateMessage = action.payload;
      })

      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.accessToken = payload.accessToken;
          state.isLoggedIn = true;
        }
      )
      .addMatcher(apiSlice.endpoints.logout.matchFulfilled, () => initialState)
      .addMatcher(
        apiSlice.endpoints.getAuthUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.authUser = payload;
        }
      );
  },
});

export const { setAccessToken, loggedOut, reset, resetUpdate } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
