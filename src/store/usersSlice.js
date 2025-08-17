import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, addUser, deleteUser } from './usersThunks';

const initialState = {
  users: [],
  responseMessage: '',
  loading: false,
  error: ''
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.users = action.payload;
          state.responseMessage = '';
        } else if (Array.isArray(action.payload.users)) {
          state.users = action.payload.users;
          state.responseMessage = action.payload.message || '';
        } else {
          state.users = [];
          state.responseMessage = action.payload.message || '';
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.users = [];
        state.responseMessage = action.payload?.message || 'Failed to fetch users';
      })
      .addCase(addUser.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add user';
      })
      .addCase(deleteUser.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u._id !== action.payload.userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
      });
  }
});

export default usersSlice.reducer;
