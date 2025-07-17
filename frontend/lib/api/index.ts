export * from './types';
export * from './client';
export * from './endpoints/customers';
export * from './endpoints/products';

// Re-export the APIs for store configuration
import { customersApi } from './endpoints/customers';
import { productsApi } from './endpoints/products';

export const apis = [customersApi, productsApi]; 