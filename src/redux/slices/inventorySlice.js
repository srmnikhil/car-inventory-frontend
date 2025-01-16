import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchInventory = createAsyncThunk('inventory/fetch', async ({ make, duration }) => {
  const response = await axios.get('https://car-inventory-backend-g140.onrender.com/api/inventory', {
    params: {
      make: make || '',
      duration: duration || 'last_month',
    },
  });
  return response.data;
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true; })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default inventorySlice.reducer;
