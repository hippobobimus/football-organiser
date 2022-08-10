import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from './authService';
import { apiSlice } from '../../api/apiSlice';

const token = JSON.parse(localStorage.getItem('token')) || null;
const isLoggedIn = Boolean(token);

const initialState = {
  user: null,
  token,
  isLoggedIn,

  authUserStatus: 'idle',
  authUserMessage: '',
  updateStatus: 'idle',
  updateMessage: '',
  status: 'idle',
  message: '',
};

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    // purge store state and logout.
    await authService.logout();
    thunkAPI.dispatch({ type: 'store/purge' });
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, thunkAPI) => {
    try {
      return await authService.getAuthUser(thunkAPI.getState().auth.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

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
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isLoggedIn = false;
      })

      .addCase(fetchAuthUser.pending, (state) => {
        state.authUserStatus = 'loading';
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.authUserStatus = 'success';
        state.authUser = action.payload;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.authUserStatus = 'error';
        state.authUserMessage = action.payload;
        state.authUser = null;
      })

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
          state.token = payload.token;
          state.isLoggedIn = true;
          localStorage.setItem('token', JSON.stringify(payload.token));
        }
      )
      .addMatcher(
        apiSlice.endpoints.getAuthUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.authUser = payload;
        }
      );
  },
});

export const selectAuthUser = (state) => state.auth.user;

export const { reset, resetUpdate } = authSlice.actions;
export const authReducer = authSlice.reducer;
