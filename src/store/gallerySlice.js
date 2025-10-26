import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BACKEND_URL } from "./backend"; // <-- Import from backend.js

// Thunk to fetch images from backend
export const fetchGalleryImages = createAsyncThunk(
  "gallery/fetchGalleryImages",
  async (_, thunkAPI) => {
    const res = await fetch(`${BACKEND_URL}/api/gallery`);
    const data = await res.json();
    console.log("Fetched gallery images:", data); // Print to console
    return data;
  }
);

export const uploadImage = createAsyncThunk(
  "gallery/uploadImage",
  async ({ imageUrl, caption, serviceType, category, token }, thunkAPI) => {
    const res = await fetch(`${BACKEND_URL}/api/admin/gallery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ imageUrl, caption, serviceType, category })
    });
    const data = await res.json();
    if (res.ok) {
      // Optionally refetch images after upload
      thunkAPI.dispatch(fetchGalleryImages());
      return data;
    } else {
      throw new Error(data.message || "Upload failed");
    }
  }
);

export const deleteImage = createAsyncThunk(
  "gallery/deleteImage",
  async ({ id, token }, thunkAPI) => {
    const res = await fetch(`${BACKEND_URL}/api/admin/gallery/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (res.ok) {
      // Refetch images after delete
      thunkAPI.dispatch(fetchGalleryImages());
      return id;
    } else {
      const data = await res.json();
      throw new Error(data.message || "Delete failed");
    }
  }
);

export const editImage = createAsyncThunk(
  "gallery/editImage",
  async ({ id, updates, token }, thunkAPI) => {
    const res = await fetch(`${BACKEND_URL}/api/admin/gallery/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (res.ok) {
      thunkAPI.dispatch(fetchGalleryImages());
      return data;
    } else {
      throw new Error(data.message || "Edit failed");
    }
  }
);

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    activeImages: [],
    showUploadModal: false,
    uploadLoading: false,
    uploadError: null,
    deleteLoading: false,
    deleteError: null,
    editLoading: false,
    editError: null
  },
  reducers: {
    toggleUploadModal: (state) => {
      state.showUploadModal = !state.showUploadModal;
    },
    addImage: (state, action) => {
      const newImage = {
        id: Date.now(),
        url: action.payload.url,
        alt: action.payload.alt || `Project ${state.activeImages.length + 1}`,
        uploadedAt: new Date().toISOString()
      };
      state.activeImages.push(newImage);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGalleryImages.fulfilled, (state, action) => {
        state.activeImages = action.payload;
      })
      .addCase(uploadImage.pending, (state) => {
        state.uploadLoading = true;
        state.uploadError = null;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.uploadLoading = false;
        state.uploadError = null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.uploadError = action.error.message;
      })
      .addCase(deleteImage.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteImage.fulfilled, (state) => {
        state.deleteLoading = false;
        state.deleteError = null;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.error.message;
      })
      .addCase(editImage.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editImage.fulfilled, (state) => {
        state.editLoading = false;
        state.editError = null;
      })
      .addCase(editImage.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.error.message;
      });
  }
});

export const { 
  toggleUploadModal,
  addImage 
} = gallerySlice.actions;

// Only export fetchGalleryImages, uploadImage, deleteImage, editImage once
// export { fetchGalleryImages, uploadImage, deleteImage };

export default gallerySlice.reducer;
