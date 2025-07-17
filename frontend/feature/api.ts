import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/lib/config';
import type { ApiResponse, Customer, ProductDetail } from '@/lib/api/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  tagTypes: ['Customer', 'ProductDetail'],
  endpoints: (builder) => ({
    // Customer endpoints
    getCustomers: builder.query<Customer[], void>({
      query: () => '/Customer',
      transformResponse: (response: ApiResponse<Customer[]>) => response.data,
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query<Customer, number>({
      query: (id) => `/Customer/${id}`,
      transformResponse: (response: ApiResponse<Customer>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),

    // Product endpoints
    getProducts: builder.query<ProductDetail[], void>({
      query: () => '/ProductDetail',
      transformResponse: (response: ApiResponse<ProductDetail[]>) => response.data,
      providesTags: ['ProductDetail'],
    }),
    createProduct: builder.mutation<ProductDetail, Partial<ProductDetail>>({
      query: (body) => ({
        url: '/ProductDetail',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<ProductDetail>) => response.data,
      invalidatesTags: ['ProductDetail'],
    }),
    updateProduct: builder.mutation<ProductDetail, { id: number; data: Partial<ProductDetail> }>({
      query: ({ id, data }) => ({
        url: `/ProductDetail/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ProductDetail>) => response.data,
      invalidatesTags: ['ProductDetail'],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ProductDetail/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ProductDetail'],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = api; 