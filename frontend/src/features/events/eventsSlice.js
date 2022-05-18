import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import eventsService from './eventsService';

export const getNextMatch = createAsyncThunk(
  'events/getNextMatch',
  async (_, thunkAPI) => {
    try {
      return await eventsService.getNextMatch(thunkAPI.getState().auth.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const initialState = {
  nextMatch: null,
  status: 'idle',
  message: '',
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      state.nextMatch = null;
      state.status = 'idle';
      state.message = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNextMatch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNextMatch.fulfilled, (state, action) => {
        state.status = 'success';
        state.nextMatch = action.payload;
      })
      .addCase(getNextMatch.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
      });
  },
});

export const { reset } = eventsSlice.actions;
export default eventsSlice.reducer;
