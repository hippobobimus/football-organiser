import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import eventsService from './eventsService';

const eventsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.time.start.localeCompare(a.time.start),
});

const initialState = eventsAdapter.getInitialState({
  eventDetails: null,
  eventDetailsStatus: 'idle',
  eventDetailsMessage: '',
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

export const fetchNextMatch = createAsyncThunk(
  'events/fetchNextMatch',
  async (_, thunkAPI) => {
    try {
      return await eventsService.getNextMatch(thunkAPI.getState().auth.token);
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
      state.eventDetails = null;
      state.eventDetailsStatus = 'idle';
      state.eventDetailsMessage = '';
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
      })

      .addCase(fetchNextMatch.pending, (state) => {
        state.eventDetailsStatus = 'loading';
      })
      .addCase(fetchNextMatch.fulfilled, (state, action) => {
        state.eventDetailsStatus = 'success';
        state.eventDetails = action.payload;
      })
      .addCase(fetchNextMatch.rejected, (state, action) => {
        state.eventDetailsStatus = 'error';
        state.eventDetailsMessage = action.payload;
      });
  },
});

export const {
  selectAll: selectAllEvents,
  selectById: selectEventById,
  selectIds: selectEventIds,
} = eventsAdapter.getSelectors((state) => state.events);

export const { reset } = eventsSlice.actions;
export default eventsSlice.reducer;
