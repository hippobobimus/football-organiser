import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from './authService';

const token = JSON.parse(localStorage.getItem('token')) || null;
const isLoggedIn = Boolean(token);

const initialState = {
  token,
  isLoggedIn,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    return await authService.logout();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.token = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.token = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isLoggedIn = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
