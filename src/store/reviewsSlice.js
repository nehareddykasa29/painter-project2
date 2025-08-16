import { createSlice } from "@reduxjs/toolkit";

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    activeReviews: [
      {
        id: 1,
        name: "Michael",
        project: "Exterior Painting",
        rating: 5,
        text: "Excellent work. Did exterior paint for condo association and did interior work,also would recommend them to anyone.Very neat, will use them again."
      },
      {
        id: 2,
        name: "Kelly",
        project: "Interior Painting",
        rating: 5,
        text: "Sami and his crew were awesome! sami and christy were very responsive and answered all of our questions and concerns. the paint crew was respectable,efficient and showed pride in their work. The cost was reasonable and fair. The entire process was seamless and a pleasure. Thanks Painter guys!"
      },
      {
        id: 3,
        name: "Jennifer D",
        project: "Exterior Painting",
        rating: 5,
        text: "The painter guys delivered amazing quality work faster than we could have hoped fori sami was very professional, personable and easy to work with. Working with painter guys was a postivie experience and we're thankful we found them!"
      },
      {
        id: 4,
        name: "Donald S",
        project: "Exterior Painting",
        rating: 5,
        text: "They did an awesome job on our house and shed painting project. Sami was extremely knowledgeable, gave us all info about what they were using, and would give us the best results. his crew was very polite and cleaned up ater every shift. We would recommend them for any painting project."
      }
    ],
    deletedReviews: [], // Junk/trash for deleted reviews
    showJunk: false
  },
  reducers: {
    deleteReview: (state, action) => {
      const reviewId = action.payload;
      const reviewToDelete = state.activeReviews.find(review => review.id === reviewId);
      if (reviewToDelete) {
        state.activeReviews = state.activeReviews.filter(review => review.id !== reviewId);
        state.deletedReviews.push({
          ...reviewToDelete,
          deletedAt: new Date().toISOString()
        });
      }
    },
    restoreReview: (state, action) => {
      const reviewId = action.payload;
      const reviewToRestore = state.deletedReviews.find(review => review.id === reviewId);
      if (reviewToRestore) {
        state.deletedReviews = state.deletedReviews.filter(review => review.id !== reviewId);
        const { deletedAt, ...reviewWithoutDeletedAt } = reviewToRestore;
        state.activeReviews.push(reviewWithoutDeletedAt);
      }
    },
    permanentlyDeleteReview: (state, action) => {
      const reviewId = action.payload;
      state.deletedReviews = state.deletedReviews.filter(review => review.id !== reviewId);
    },
    toggleJunkView: (state) => {
      state.showJunk = !state.showJunk;
    },
    addReview: (state, action) => {
      const newReview = {
        ...action.payload,
        id: Date.now() // Simple ID generation
      };
      state.activeReviews.push(newReview);
    }
  }
});

export const { 
  deleteReview, 
  restoreReview, 
  permanentlyDeleteReview, 
  toggleJunkView,
  addReview 
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
