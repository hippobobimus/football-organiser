import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import eventsService from "./eventsService";

const eventsAdapter = createEntityAdapter();

const initialState = eventsAdapter.getInitialState({
  eventDetails: null,
  fetchStatus: "idle",
  fetchMessage: "",
  deleteStatus: "idle",
  deleteMessage: "",
  updateStatus: "idle",
  updateMessage: "",
  pagination: null,
});

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (queryParams, thunkAPI) => {
    try {
      return await eventsService.getEvents(
        thunkAPI.getState().auth.token,
        queryParams
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchOneEvent = createAsyncThunk(
  "events/fetchOneEvent",
  async (eventId, thunkAPI) => {
    try {
      return await eventsService.getOneEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchNextMatch = createAsyncThunk(
  "events/fetchNextMatch",
  async (_, thunkAPI) => {
    try {
      return await eventsService.getNextMatch(thunkAPI.getState().auth.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/createMatch",
  async (eventData, thunkAPI) => {
    try {
      return await eventsService.createEvent(
        thunkAPI.getState().auth.token,
        eventData
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (eventData, thunkAPI) => {
    try {
      return await eventsService.updateEvent(
        thunkAPI.getState().auth.token,
        eventData
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (eventId, thunkAPI) => {
    try {
      return await eventsService.deleteEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addAuthUserToEvent = createAsyncThunk(
  "events/addAuthUserToEvent",
  async (eventId, thunkAPI) => {
    try {
      return await eventsService.addAuthUserToEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const removeAuthUserFromEvent = createAsyncThunk(
  "events/removeAuthUserFromEvent",
  async (eventId, thunkAPI) => {
    try {
      return await eventsService.removeAuthUserFromEvent(
        thunkAPI.getState().auth.token,
        eventId
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateAuthUserEventAttendee = createAsyncThunk(
  "events/updateAuthUserEventAttendee",
  async (attendeeParams, thunkAPI) => {
    try {
      return await eventsService.updateAuthUserEventAttendee(
        thunkAPI.getState().auth.token,
        attendeeParams
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createAttendee = createAsyncThunk(
  "events/createAttendee",
  async (attendeeParams, thunkAPI) => {
    try {
      return await eventsService.createAttendee(
        thunkAPI.getState().auth.token,
        attendeeParams
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateAttendee = createAsyncThunk(
  "events/updateAttendee",
  async (attendeeParams, thunkAPI) => {
    try {
      return await eventsService.updateAttendee(
        thunkAPI.getState().auth.token,
        attendeeParams
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteAttendee = createAsyncThunk(
  "events/deleteAttendee",
  async (attendeeParams, thunkAPI) => {
    try {
      return await eventsService.deleteAttendee(
        thunkAPI.getState().auth.token,
        attendeeParams
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    reset: (state) => {
      eventsAdapter.removeAll(state);
      state.eventDetails = null;
      state.fetchStatus = "idle";
      state.fetchMessage = "";
      state.updateStatus = "idle";
      state.updateMessage = "";
      state.deleteStatus = "idle";
      state.deleteMessage = "";
      state.pagination = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        const { docs, ...pagination } = action.payload;
        eventsAdapter.setAll(state, docs);
        state.pagination = pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.fetchMessage = action.payload;
      })

      .addCase(fetchOneEvent.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchOneEvent.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.eventDetails = action.payload;
      })
      .addCase(fetchOneEvent.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.fetchMessage = action.payload;
      })

      .addCase(fetchNextMatch.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchNextMatch.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.eventDetails = action.payload;
      })
      .addCase(fetchNextMatch.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.fetchMessage = action.payload;
      })

      .addCase(createEvent.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(updateEvent.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(deleteEvent.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        state.eventDetails = null;
        state.fetchStatus = "idle";
        eventsAdapter.removeOne(state, action.payload.id);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleteStatus = "error";
        state.deleteMessage = action.payload;
      })

      .addCase(addAuthUserToEvent.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(addAuthUserToEvent.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(addAuthUserToEvent.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(removeAuthUserFromEvent.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(removeAuthUserFromEvent.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(removeAuthUserFromEvent.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(updateAuthUserEventAttendee.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateAuthUserEventAttendee.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateAuthUserEventAttendee.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(createAttendee.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(createAttendee.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(createAttendee.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(updateAttendee.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateAttendee.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateAttendee.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
      })

      .addCase(deleteAttendee.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(deleteAttendee.fulfilled, (state, action) => {
        state.updateStatus = "success";
        state.eventDetails = action.payload;
        eventsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteAttendee.rejected, (state, action) => {
        state.updateStatus = "error";
        state.updateMessage = action.payload;
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
