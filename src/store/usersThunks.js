import { createAsyncThunk } from '@reduxjs/toolkit';
import { BACKEND_URL } from './backend';

// Fetch users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ token }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return data;
    } catch (err) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);

// Add user
export const addUser = createAsyncThunk(
  'users/addUser',
  async ({ token, form }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data); // data.message will be shown
      return data;
    } catch (err) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async ({ token, userId, userRole }, { rejectWithValue }) => {
    if (userRole === 'Owner') return rejectWithValue({ message: 'Cannot delete Owner user' });
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data);
      return { userId };
    } catch (err) {
      return rejectWithValue({ message: 'Network error' });
    }
  }
);
