import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import attendeesService from './attendeesService';

const attendeesAdapter = createEntityAdapter();

const initialState = attendeesAdapter.getInitialState({
  attendeeDetails: null,
  attendeeDetailsStatus: 'idle',
  attendeeDetailsMessage: '',
  status: 'idle',
  message: '',
});

export const fetchEventAttendees = createAsyncThunk(
  'attendees/fetchEventAttendees',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.getEventAttendees(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchCurrentUserEventAttendeeDetails = createAsyncThunk(
  'attendees/fetchCurrentUserEventAttendeeDetails',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.getCurrentUserEventAttendeeDetails(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const joinEvent = createAsyncThunk(
  'attendees/joinEvent',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.joinEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const leaveEvent = createAsyncThunk(
  'attendees/leaveEvent',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.leaveEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const attendeesSlice = createSlice({
  name: 'attendees',
  initialState,
  reducers: {
    reset: (state) => {
      state.attendeeDetails = null;
      state.attendeeDetailsStatus = 'idle';
      state.attendeeDetailsMessage = '';
      attendeesAdapter.removeAll();
      state.status = 'idle';
      state.message = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEventAttendees.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEventAttendees.fulfilled, (state, action) => {
        state.status = 'success';
        attendeesAdapter.upsertMany(state, action.payload);
      })
      .addCase(fetchEventAttendees.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
      })

      .addCase(fetchCurrentUserEventAttendeeDetails.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(
        fetchCurrentUserEventAttendeeDetails.fulfilled,
        (state, action) => {
          state.attendeeDetailsStatus = 'success';
          state.attendeeDetails = action.payload;
        }
      )
      .addCase(
        fetchCurrentUserEventAttendeeDetails.rejected,
        (state, action) => {
          state.attendeeDetailsStatus = 'error';
          state.attendeeDetailsMessage = action.payload;
        }
      )

      .addCase(joinEvent.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.attendeeDetailsStatus = 'success';
        state.attendeeDetails = action.payload;
        attendeesAdapter.upsertOne(state, action.payload);
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.attendeeDetailsStatus = 'error';
        state.attendeeDetailsMessage = action.payload;
      })

      .addCase(leaveEvent.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.attendeeDetailsStatus = 'success';
        state.attendeeDetails = null;
        attendeesAdapter.removeOne(state, action.payload.id);
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.attendeeDetailsStatus = 'error';
        state.attendeeDetailsMessage = action.payload;
      });
  },
});

export const {
  selectAll: selectAllAttendees,
  selectById: selectAttendeeById,
  selectIds: selectAttendeeIds,
} = attendeesAdapter.getSelectors((state) => state.attendees);

export const { reset } = attendeesSlice.actions;
export default attendeesSlice.reducer;
