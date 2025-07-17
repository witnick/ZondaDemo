import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

interface SelectedCustomerState {
  customerId: string | null;
}

const initialState: SelectedCustomerState = {
  customerId: null,
};

export const selectedCustomerSlice = createSlice({
  name: 'selectedCustomer',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<string | null>) => {
      state.customerId = action.payload;
    },
  },
});

export const { setSelectedCustomer } = selectedCustomerSlice.actions;

// Selector
export const selectSelectedCustomerId = (state: RootState) => state.selectedCustomer.customerId;

export default selectedCustomerSlice.reducer; 