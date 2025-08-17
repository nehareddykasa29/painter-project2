import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import reviewsReducer from './reviewsSlice';
import galleryReducer from './gallerySlice';
import faqReducer from './faqSlice';
import usersReducer from './usersSlice';
import bookingReducer from './bookingSlice';

// Root persist config
const persistConfig = {
  key: 'painterguys-root',
  storage,
  whitelist: ['auth', 'reviews', 'gallery', 'faq'],
  timeout: 0
};

// Create root reducer
const rootReducer = {
  auth: authReducer,
  reviews: reviewsReducer,
  gallery: galleryReducer,
  faq: faqReducer,
  users: usersReducer,
  booking: bookingReducer // use merged slice
};

// Persist the entire root reducer
const persistedReducer = persistReducer(persistConfig, (state = {}, action) => {
  const newState = {};
  Object.keys(rootReducer).forEach(key => {
    newState[key] = rootReducer[key](state[key], action);
  });
  return newState;
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER', 'persist/FLUSH'],
      },
    }),
});

export const persistor = persistStore(store);
