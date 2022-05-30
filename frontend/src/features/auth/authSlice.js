import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import authService from './authService';

const token = JSON.parse(localStorage.getItem('token')) || null;
const isLoggedIn = Boolean(token);

const initialState = {
  authUser: null,
  authUserStatus: 'idle',
  authUserMessage: '',
  token,
  isLoggedIn,
  status: 'idle',
  message: '',
};

export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    // purge store state and logout.
    await authService.logout();
    thunkAPI.dispatch({type: 'store/purge'});
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const fetchAuthUser = createAsyncThunk('auth/fetchAuthUser', async (_, thunkAPI) => {
  try {
    return await authService.getAuthUser(thunkAPI.getState().auth.token);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message);
  }
});

export const updateAuthUser = createAsyncThunk(
  'auth/updateAuthUser',
  async (user, thunkAPI) => {
    try {
      return await authService.updateAuthUser(
        thunkAPI.getState().auth.token,
        user
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.authUser = null;
      state.authUserStatus = 'idle';
      state.authUserMessage = '';
      state.status = 'idle';
      state.message = '';
    },
  },
  extraReducers(builder) {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
        state.token = null;
      })

      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.message = action.payload;
        state.token = null;
      })

      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isLoggedIn = false;
      })

      .addCase(fetchAuthUser.pending, (state) => {
        state.authUserStatus = 'loading';
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.authUserStatus = 'success';
        state.authUser = action.payload;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.authUserStatus = 'error';
        state.authUserMessage = action.payload;
        state.authUser = null;
      })

      .addCase(updateAuthUser.pending, (state) => {
        state.authUserStatus = 'loading';
      })
      .addCase(updateAuthUser.fulfilled, (state, action) => {
        state.authUserStatus = 'success';
        state.authUser = action.payload;
      })
      .addCase(updateAuthUser.rejected, (state, action) => {
        state.authUserStatus = 'error';
        state.authUserMessage = action.payload;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
