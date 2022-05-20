import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import isFuture from 'date-fns/isFuture';

import eventsService from './eventsService';

const eventsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.time.start.localeCompare(a.time.start),
});

const initialState = eventsAdapter.getInitialState({
  status: 'idle',
  message: '',
});

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, thunkAPI) => {
    try {
      return await eventsService.getEvents(thunkAPI.getState().auth.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    reset: (state) => {
      eventsAdapter.removeAll();
      state.status = 'idle';
      state.message = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'success';
        eventsAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
      });
  },
});

export const {
  selectAll: selectAllEvents,
  selectById: selectEventById,
  selectIds: selectEventIds,
} = eventsAdapter.getSelectors((state) => state.events);

export const selectNextMatchId = createSelector(selectAllEvents, (events) => {
  // find the first match event that occurs in the future, or is in progress.
  return events.find((event) => isFuture(Date.parse(event.time.end)))?.id;
});

export const selectEventAttendees = createSelector(selectEventById, (event) => {
  if (!event) {
    return null;
  }

  // TODO sorting
  //let result = [...event.attendees];
  //result.sort((a, b) => a.user.name.localeCompare(b.user.name));

  return event.attendees;
});

export const { reset } = eventsSlice.actions;
export default eventsSlice.reducer;
