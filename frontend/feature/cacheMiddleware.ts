import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { api } from './api';

const CACHE_KEY = 'rtk-api-cache';
const CACHE_TIME_KEY = 'rtk-api-cache-timestamp';

// Create the middleware
export const listenerMiddleware = createListenerMiddleware();

// Save cache to localStorage whenever it changes
listenerMiddleware.startListening({
  matcher: isAnyOf(
    api.endpoints.getCustomers.matchFulfilled,
    api.endpoints.getCustomer.matchFulfilled,
    api.endpoints.getProducts.matchFulfilled
  ),
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();
    const timestamp = Date.now();
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(state[api.reducerPath]));
    localStorage.setItem(CACHE_TIME_KEY, timestamp.toString());
  },
});

// Function to load cache from localStorage
export const loadCache = () => {
  try {
    const cache = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIME_KEY);
    
    if (!cache || !timestamp) {
      return undefined;
    }

    // Check if cache is older than 1 hour
    const cacheTime = parseInt(timestamp, 10);
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    if (now - cacheTime > hourInMs) {
      localStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_TIME_KEY);
      return undefined;
    }

    return {
      [api.reducerPath]: JSON.parse(cache)
    };
  } catch (error) {
    console.error('Error loading cache:', error);
    return undefined;
  }
}; 