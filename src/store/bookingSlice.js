import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BACKEND_URL } from './backend';

// Thunk for appointment availability
export const fetchAvailability = createAsyncThunk(
  'booking/fetchAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/availability`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for submitting a quote
export const submitQuote = createAsyncThunk(
  'booking/submitQuote',
  async (quoteBody, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteBody)
      });
      if (!response.ok) throw new Error('Failed to submit quote');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for fetching quotes (admin)
export const fetchQuotes = createAsyncThunk(
  'booking/fetchQuotes',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      const response = await fetch(`${BACKEND_URL}/api/admin/quotes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch quotes');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for updating a quote (PUT)
export const updateQuote = createAsyncThunk(
  'booking/updateQuote',
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      const response = await fetch(`${BACKEND_URL}/api/admin/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update quote');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk for deleting a quote (DELETE)
export const deleteQuote = createAsyncThunk(
  'booking/deleteQuote',
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      const response = await fetch(`${BACKEND_URL}/api/admin/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete quote');
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    availability: null,
    appointmentLoading: false,
    appointmentError: null,
    quoteSubmitting: false,
    quoteSuccess: false,
    quoteError: null,
    quoteData: null,
    quotes: [],
    quotesLoading: false,
    quotesError: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Appointment availability
      .addCase(fetchAvailability.pending, state => {
        state.appointmentLoading = true;
        state.appointmentError = null;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.appointmentLoading = false;
        state.availability = action.payload;
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.appointmentLoading = false;
        state.appointmentError = action.payload;
      })
      // Quote submission
      .addCase(submitQuote.pending, state => {
        state.quoteSubmitting = true;
        state.quoteSuccess = false;
        state.quoteError = null;
      })
      .addCase(submitQuote.fulfilled, (state, action) => {
        state.quoteSubmitting = false;
        state.quoteSuccess = true;
        state.quoteData = action.payload;
      })
      .addCase(submitQuote.rejected, (state, action) => {
        state.quoteSubmitting = false;
        state.quoteSuccess = false;
        state.quoteError = action.payload;
      })
      // Quotes fetching
      .addCase(fetchQuotes.pending, state => {
        state.quotesLoading = true;
        state.quotesError = null;
      })
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.quotesLoading = false;
        state.quotes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchQuotes.rejected, (state, action) => {
        state.quotesLoading = false;
        state.quotesError = action.payload;
        state.quotes = [];
      })
      // Update quote
      .addCase(updateQuote.pending, state => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(updateQuote.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      })
      // Delete quote
      .addCase(deleteQuote.pending, state => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
      })
      .addCase(deleteQuote.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      });
  }
});

export default bookingSlice.reducer;
