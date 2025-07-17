import { api } from '../client';
import type { ApiResponse, Product } from '../types';

export const productsApi = {
  getAll: () => 
    api.get<ApiResponse<Product[]>>('/api/products'),
    
  getById: (id: number) =>
    api.get<ApiResponse<Product>>(`/api/products/${id}`),
    
  create: (product: Omit<Product, 'id'>) =>
    api.post<ApiResponse<Product>>('/api/products', product),
    
  update: (id: number, product: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/api/products/${id}`, product),
    
  delete: (id: number) =>
    api.delete<void>(`/api/products/${id}`),
    
  getByCustomer: (customerId: number) =>
    api.get<ApiResponse<Product[]>>(`/api/customers/${customerId}/products`),
}; 