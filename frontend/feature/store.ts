import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import selectedCustomerReducer from './selectedCustomerSlice';
import { listenerMiddleware, loadCache } from './cacheMiddleware';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    selectedCustomer: selectedCustomerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .prepend(listenerMiddleware.middleware),
  preloadedState: loadCache(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 