import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from './authService';

const user = JSON.parse(localStorage.getItem('user')) || null;

const initialState = {
  user,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
