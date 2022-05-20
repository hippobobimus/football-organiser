import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import currentUserService from './currentUserService';

const initialState = {
  data: null,
  status: 'idle',
  message: '',
};

export const getCurrentUser = createAsyncThunk(
  'currentUser/getCurrentUser',
  async (_, thunkAPI) => {
    try {
      return await currentUserService.getCurrentUser(
        thunkAPI.getState().auth.token
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateCurrentUser = createAsyncThunk(
  'currentUser/updateCurrentUser',
  async (user, thunkAPI) => {
    try {
      return await currentUserService.updateCurrentUser(
        thunkAPI.getState().auth.token,
        user
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle';
      state.message = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
      });
  },
});

export const selectCurrentUserId = ({ currentUser }) => {
  return currentUser.data?.id;
};

export const { reset } = currentUserSlice.actions;
export default currentUserSlice.reducer;
