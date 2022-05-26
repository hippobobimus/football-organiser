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

export const fetchAuthUserEventAttendee = createAsyncThunk(
  'attendees/fetchAuthUserEventAttendee',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.getAuthUserEventAttendee(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addAuthUserToEvent = createAsyncThunk(
  'attendees/addAuthUserToEvent',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.addAuthUserToEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeAuthUserFromEvent = createAsyncThunk(
  'attendees/removeAuthUserFromEvent',
  async (eventId, thunkAPI) => {
    try {
      return await attendeesService.removeAuthUserFromEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateAuthUserEventAttendee = createAsyncThunk(
  'attendees/updateAuthUserEventAttendee',
  async (attendeeParams, thunkAPI) => {
    try {
      return await attendeesService.updateAuthUserEventAttendee(
        thunkAPI.getState().auth.token,
        attendeeParams
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

      .addCase(fetchAuthUserEventAttendee.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(fetchAuthUserEventAttendee.fulfilled, (state, action) => {
        state.attendeeDetailsStatus = 'success';
        state.attendeeDetails = action.payload;
      })
      .addCase(fetchAuthUserEventAttendee.rejected, (state, action) => {
        state.attendeeDetailsStatus = 'error';
        state.attendeeDetailsMessage = action.payload;
      })

      .addCase(addAuthUserToEvent.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(addAuthUserToEvent.fulfilled, (state, action) => {
        state.attendeeDetailsStatus = 'success';
        state.attendeeDetails = action.payload;
        attendeesAdapter.upsertOne(state, action.payload);
      })
      .addCase(addAuthUserToEvent.rejected, (state, action) => {
        state.attendeeDetailsStatus = 'error';
        state.attendeeDetailsMessage = action.payload;
      })

      .addCase(removeAuthUserFromEvent.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(removeAuthUserFromEvent.fulfilled, (state, action) => {
        state.attendeeDetailsStatus = 'success';
        state.attendeeDetails = null;
        attendeesAdapter.removeOne(state, action.payload.id);
      })
      .addCase(removeAuthUserFromEvent.rejected, (state, action) => {
        state.attendeeDetailsStatus = 'error';
        state.attendeeDetailsMessage = action.payload;
      })

      .addCase(updateAuthUserEventAttendee.pending, (state) => {
        state.attendeeDetailsStatus = 'loading';
      })
      .addCase(updateAuthUserEventAttendee.fulfilled, (state, action) => {
        state.attendeeDetailsStatus = 'success';
        state.attendeeDetails = action.payload;
        attendeesAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateAuthUserEventAttendee.rejected, (state, action) => {
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
