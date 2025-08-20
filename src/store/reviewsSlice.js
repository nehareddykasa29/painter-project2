import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "./backend"; // Import backend URL

// Async thunk to fetch reviews from backend
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reviews/approved`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to edit a review
export const editReview = createAsyncThunk(
  "reviews/editReview",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to edit review");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk to delete a review
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete review");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk to submit a new review
export const submitReview = createAsyncThunk(
  "reviews/submitReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to submit review");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    activeReviews: [],
    deletedReviews: [], // Can be removed if not needed elsewhere
    showJunk: false,
    loading: false,
    error: null,
    editLoading: false,
    editError: null,
    deleteLoading: false,
    deleteError: null,
    submitLoading: false,
    submitError: null,
    submitSuccess: false
  },
  reducers: {
    toggleJunkView: (state) => {
      state.showJunk = !state.showJunk;
    },
    addReview: (state, action) => {
      const newReview = {
        ...action.payload,
        id: Date.now()
      };
      state.activeReviews.push(newReview);
    }
    // Removed: deleteReview, restoreReview, permanentlyDeleteReview
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.activeReviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editReview.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        state.editLoading = false;
        state.editError = null;
        // Update the review in activeReviews
        const idx = state.activeReviews.findIndex(r => r._id === action.payload._id);
        if (idx !== -1) {
          state.activeReviews[idx] = action.payload;
        }
      })
      .addCase(editReview.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload;
      })
      .addCase(deleteReview.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        // Remove the deleted review from activeReviews
        state.activeReviews = state.activeReviews.filter(r => r._id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })
      .addCase(submitReview.pending, (state) => {
        state.submitLoading = true;
        state.submitError = null;
        state.submitSuccess = false;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitSuccess = true;
        // Optionally add the new review to activeReviews
        // state.activeReviews.push(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError = action.payload;
        state.submitSuccess = false;
      });
  }
});

export const { 
  toggleJunkView,
  addReview 
} = reviewsSlice.actions;

export default reviewsSlice.reducer;



