import { api } from '../client';
import type { ApiResponse, Customer } from '../types';

export const customersApi = {
  getAll: () => 
    api.get<ApiResponse<Customer[]>>('/api/customers'),
    
  getById: (id: number) =>
    api.get<ApiResponse<Customer>>(`/api/customers/${id}`),
    
  create: (customer: Omit<Customer, 'id'>) =>
    api.post<ApiResponse<Customer>>('/api/customers', customer),
    
  update: (id: number, customer: Partial<Customer>) =>
    api.put<ApiResponse<Customer>>(`/api/customers/${id}`, customer),
    
  delete: (id: number) =>
    api.delete<void>(`/api/customers/${id}`),
}; 