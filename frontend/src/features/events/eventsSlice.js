import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'idle',
  message: '',
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      state.status = 'idle';
      state.message = '';
    },
  },
  extraReducers: {},
});

export const { reset } = eventsSlice.actions;
export default eventsSlice.reducer;
