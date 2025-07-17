import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CustomerDetail {
  id: number;
  address: string;
  phone: string;
  notes: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  detail: CustomerDetail;
  productIds: number[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:7295' }),
  endpoints: (builder) => ({
    getCustomers: builder.query<Customer[], void>({
      query: () => '/Customer',
      transformResponse: (response: ApiResponse<Customer[]>) => response.data,
    }),
    getProducts: builder.query<Product[], void>({
      query: () => '/ProductDetail',
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/ProductDetail',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<Product>) => response.data,
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ProductDetail/${id}`,
        method: 'DELETE',
      }),
    }),
    getCustomer: builder.query<Customer, number>({
      query: (id) => `/Customer/${id}`,
      transformResponse: (response: ApiResponse<Customer>) => response.data,
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetCustomerQuery,
} = api; 