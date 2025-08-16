import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "./backend";

// Async thunk to fetch FAQs from backend
export const fetchFaqs = createAsyncThunk(
  "faq/fetchFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/faqs`);
      if (!response.ok) throw new Error("Failed to fetch FAQs");
      return await response.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addFaqAsync = createAsyncThunk(
  "faq/addFaqAsync",
  async ({ faq, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/faqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(faq)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add FAQ");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const editFaqAsync = createAsyncThunk(
  "faq/editFaqAsync",
  async ({ id, updates, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/faqs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update FAQ");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteFaqAsync = createAsyncThunk(
  "faq/deleteFaqAsync",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/faqs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete FAQ");
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faqs: [], // <-- Remove hardcoded FAQ data
    showAddModal: false,
    showEditModal: false,
    editingFaq: null,
    loading: false,
    error: null
  },
  reducers: {
    addFaq: (state, action) => {
      const newFaq = {
        id: Date.now(),
        question: action.payload.question,
        answer: action.payload.answer
      };
      state.faqs.push(newFaq);
    },
    updateFaq: (state, action) => {
      const { id, question, answer } = action.payload;
      const faqIndex = state.faqs.findIndex(faq => faq.id === id);
      if (faqIndex !== -1) {
        state.faqs[faqIndex] = { id, question, answer };
      }
    },
    deleteFaq: (state, action) => {
      const faqId = action.payload;
      state.faqs = state.faqs.filter(faq => faq.id !== faqId);
    },
    toggleAddModal: (state) => {
      state.showAddModal = !state.showAddModal;
    },
    toggleEditModal: (state) => {
      state.showEditModal = !state.showEditModal;
    },
    setEditingFaq: (state, action) => {
      state.editingFaq = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFaqAsync.fulfilled, (state, action) => {
        state.faqs.push(action.payload);
      })
      .addCase(editFaqAsync.fulfilled, (state, action) => {
        const idx = state.faqs.findIndex(faq => faq._id === action.payload._id);
        if (idx !== -1) {
          state.faqs[idx] = action.payload;
        }
      })
      .addCase(deleteFaqAsync.fulfilled, (state, action) => {
        state.faqs = state.faqs.filter(faq => (faq._id || faq.id) !== action.payload);
      });
  }
});

export const { 
  addFaq, 
  updateFaq, 
  deleteFaq, 
  toggleAddModal, 
  toggleEditModal, 
  setEditingFaq 
} = faqSlice.actions;

export default faqSlice.reducer;




