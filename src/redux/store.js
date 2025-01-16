import { configureStore } from '@reduxjs/toolkit';
import inventoryReducer from './slices/inventorySlice';  // Import your slice

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,  // Add inventory slice to the store
  },
});