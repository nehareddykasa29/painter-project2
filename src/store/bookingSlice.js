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

// Thunk for saving blocked slots (admin)
export const saveBlockedSlots = createAsyncThunk(
  'booking/saveBlockedSlots',
  async (blockedMap, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (!token) return rejectWithValue('Missing admin token');
      // POST per day as { date, slots } to /api/admin/blocker
      for (const [date, slots] of Object.entries(blockedMap)) {
        const resp = await fetch(`${BACKEND_URL}/api/admin/blocker`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date, slots })
        });
        if (!(resp.ok || resp.status === 201)) {
          let text = '';
          try { text = await resp.text(); } catch (_) {}
          throw new Error(text || `Failed to update blocks for ${date}`);
        }
        try {
          const json = await resp.clone().json();
          console.log('[booking/saveBlockedSlots] Updated', date, '->', json);
        } catch (_) {
          try {
            const text = await resp.clone().text();
            console.log('[booking/saveBlockedSlots] Updated', date, '->', text);
          } catch (_) {}
        }
      }
      // Caller will refetch availability; return success summary
      return { success: true };
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

// Thunk for marking a quote as seen (no body required)
export const markQuoteSeen = createAsyncThunk(
  'booking/markQuoteSeen',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth?.token;
    if (!token) {
      return rejectWithValue('Missing admin token');
    }
    const endpoint = `${BACKEND_URL}/api/admin/quotes/${id}/mark-seen`;
    // Some backends expect a body (e.g., { seen: true }) even if docs say none; we try minimal first then fallback.
    try {
      let response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const status = response.status;
        let errText = '';
        try { errText = await response.text(); } catch (_) {}
        // Fallback attempt with JSON body if 400 Bad Request (common for validation expecting body)
        if (status === 400) {
          response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ seen: true })
          });
          if (!response.ok) {
            let secondText = '';
            try { secondText = await response.text(); } catch (_) {}
            // Try alternative body shapes one more time
            const altBodies = [
              { viewedByAdmin: true },
              { seenByAdmin: true },
              { unseen: false },
              { rescheduleRequest: { seenByAdmin: true } }
            ];
            for (const body of altBodies) {
              const altResp = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
              });
              if (altResp.ok) {
                try { return await altResp.json(); } catch (_) { return { _id: id, ...body }; }
              }
            }
            throw new Error(`Failed (400) mark-seen. First: ${errText || 'no body'} | Second: ${secondText || 'no body'} | Tried alt bodies`);
          }
        } else {
          throw new Error(`HTTP ${status} ${errText}`);
        }
      }
      // Try parse JSON; if fails, return empty object to avoid crashing
      try {
        return await response.json();
      } catch (_) {
        return { _id: id, seen: true };
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Unknown error while marking seen');
    }
  }
);

// Thunk for marking a quote as viewed (no body required by spec)
export const markQuoteViewed = createAsyncThunk(
  'booking/markQuoteViewed',
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth?.token;
    if (!token) {
      return rejectWithValue('Missing admin token');
    }
    const endpoint = `${BACKEND_URL}/api/admin/quotes/${id}/mark-viewed`;
    try {
      let response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const status = response.status;
        let errText = '';
        try { errText = await response.text(); } catch (_) {}
        if (status === 400) {
          // Some setups require an explicit body
          response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ viewedByAdmin: true })
          });
          if (!response.ok) {
            let secondText = '';
            try { secondText = await response.text(); } catch (_) {}
            throw new Error(`Failed (400) mark-viewed. First: ${errText || 'no body'} | Second: ${secondText || 'no body'}`);
          }
        } else {
          throw new Error(`HTTP ${status} ${errText}`);
        }
      }
      try { return await response.json(); } catch (_) { return { _id: id, viewedByAdmin: true }; }
    } catch (err) {
      return rejectWithValue(err.message || 'Unknown error while marking viewed');
    }
  }
);

// Thunk to handle reschedule requests (approve/deny)
export const handleReschedule = createAsyncThunk(
  'booking/handleReschedule',
  async ({ id, action }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      if (!token) return rejectWithValue('Missing admin token');
      const response = await fetch(`${BACKEND_URL}/api/admin/quotes/${id}/handle-reschedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });
      if (!response.ok) {
        let text = '';
        try { text = await response.text(); } catch (_) {}
        throw new Error(text || 'Failed to handle reschedule');
      }
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
      // Save blocked slots
      .addCase(saveBlockedSlots.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(saveBlockedSlots.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        // If API returned a full availability map, update it; otherwise do nothing here
        if (action.payload && typeof action.payload === 'object' && !action.payload.success) {
          state.availability = action.payload;
        }
      })
      .addCase(saveBlockedSlots.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
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
      // Mark quote seen
    builder
      .addCase(markQuoteSeen.pending, state => {
        // reuse updateLoading flags minimally
        state.updateError = null;
      })
      .addCase(markQuoteSeen.fulfilled, (state, action) => {
        // Optimistically update the specific quote's unseen/seen fields if included
        const updated = action.payload;
        if (updated && updated._id) {
          state.quotes = state.quotes.map(q => q._id === updated._id ? { ...q, ...updated } : q);
        }
      })
      .addCase(markQuoteSeen.rejected, (state, action) => {
        state.updateError = action.payload;
      });
      // Mark quote viewed
    builder
      .addCase(markQuoteViewed.pending, state => {
        state.updateError = null;
      })
      .addCase(markQuoteViewed.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated && updated._id) {
          state.quotes = state.quotes.map(q => q._id === updated._id ? { ...q, ...updated } : q);
        }
      })
      .addCase(markQuoteViewed.rejected, (state, action) => {
        state.updateError = action.payload;
      });
      // Handle reschedule approve/deny
    builder
      .addCase(handleReschedule.pending, state => {
        state.updateError = null;
        state.updateSuccess = false;
        state.updateLoading = true;
      })
      .addCase(handleReschedule.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const updated = action.payload;
        if (updated && updated._id) {
          state.quotes = state.quotes.map(q => q._id === updated._id ? { ...q, ...updated } : q);
        }
      })
      .addCase(handleReschedule.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      });
  }
});

export default bookingSlice.reducer;
