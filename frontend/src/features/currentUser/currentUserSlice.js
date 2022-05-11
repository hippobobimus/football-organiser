import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import currentUserService from './currentUserService';

const initialState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getCurrentUser = createAsyncThunk('currentUser/getCurrentUser', async (_, thunkAPI) => {
  try {
    return await currentUserService.getCurrentUser(thunkAPI.getState().auth.token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

const currentUserSlice = createSlice({
  name: 'currentUser',
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
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = currentUserSlice.actions;
export default currentUserSlice.reducer;
