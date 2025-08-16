import { createSlice } from "@reduxjs/toolkit";

const gallerySlice = createSlice({
  name: "gallery",
  initialState: {
    activeImages: [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 1',
        uploadedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 2',
        uploadedAt: new Date('2024-01-02').toISOString()
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 3',
        uploadedAt: new Date('2024-01-03').toISOString()
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 4',
        uploadedAt: new Date('2024-01-04').toISOString()
      },
      {
        id: 5,
        url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 5',
        uploadedAt: new Date('2024-01-05').toISOString()
      },
      {
        id: 6,
        url: 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 6',
        uploadedAt: new Date('2024-01-06').toISOString()
      },
      {
        id: 7,
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 7',
        uploadedAt: new Date('2024-01-07').toISOString()
      },
      {
        id: 8,
        url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 8',
        uploadedAt: new Date('2024-01-08').toISOString()
      },
      {
        id: 9,
        url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 9',
        uploadedAt: new Date('2024-01-09').toISOString()
      },
      {
        id: 10,
        url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 10',
        uploadedAt: new Date('2024-01-10').toISOString()
      },
      {
        id: 11,
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 11',
        uploadedAt: new Date('2024-01-11').toISOString()
      },
      {
        id: 12,
        url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        alt: 'Project 12',
        uploadedAt: new Date('2024-01-12').toISOString()
      }
    ],
    deletedImages: [], // Junk/trash for deleted images
    showJunk: false,
    showUploadModal: false
  },
  reducers: {
    deleteImage: (state, action) => {
      const imageId = action.payload;
      const imageToDelete = state.activeImages.find(image => image.id === imageId);
      if (imageToDelete) {
        state.activeImages = state.activeImages.filter(image => image.id !== imageId);
        state.deletedImages.push({
          ...imageToDelete,
          deletedAt: new Date().toISOString()
        });
      }
    },
    restoreImage: (state, action) => {
      const imageId = action.payload;
      const imageToRestore = state.deletedImages.find(image => image.id === imageId);
      if (imageToRestore) {
        state.deletedImages = state.deletedImages.filter(image => image.id !== imageId);
        const { deletedAt, ...imageWithoutDeletedAt } = imageToRestore;
        state.activeImages.push(imageWithoutDeletedAt);
      }
    },
    permanentlyDeleteImage: (state, action) => {
      const imageId = action.payload;
      state.deletedImages = state.deletedImages.filter(image => image.id !== imageId);
    },
    toggleJunkView: (state) => {
      state.showJunk = !state.showJunk;
    },
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
  }
});

export const { 
  deleteImage, 
  restoreImage, 
  permanentlyDeleteImage, 
  toggleJunkView,
  toggleUploadModal,
  addImage 
} = gallerySlice.actions;

export default gallerySlice.reducer;

