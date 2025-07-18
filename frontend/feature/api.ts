import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/lib/config';
import type { ApiResponse, Customer, ProductDetail, PagedDataResult } from '@/lib/api/types';

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// Cache lifetime in seconds (1 hour)
const CACHE_LIFETIME = 60 * 60;

// Helper function to create list and individual tags
const providesList = <R extends { id: number | string }, T extends string>(
  resultsWithIds: R[] | undefined,
  tagType: T
) => {
  return resultsWithIds
    ? [
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id } as const)),
        { type: tagType, id: 'LIST' } as const,
      ]
    : [{ type: tagType, id: 'LIST' } as const];
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_CONFIG.baseUrl }),
  tagTypes: ['Customer', 'ProductDetail', 'CustomerProducts'],
  keepUnusedDataFor: CACHE_LIFETIME,
  endpoints: (builder) => ({
    // Customer endpoints
    getCustomers: builder.query<PagedDataResult<Customer>, PaginationParams>({
      query: (params = {}) => ({
        url: '/api/Customer',
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      }),
      transformResponse: (response: ApiResponse<PagedDataResult<Customer>>) => response.data,
      providesTags: (result) => providesList(result?.items, 'Customer'),
    }),
    getCustomer: builder.query<Customer, number>({
      query: (id) => `/api/Customer/${id}`,
      transformResponse: (response: ApiResponse<Customer>) => response.data,
      providesTags: (result, error, id) => [
        { type: 'Customer', id },
        { type: 'CustomerProducts', id }
      ],
    }),

    // Product endpoints
    getProducts: builder.query<ProductDetail[], void>({
      query: () => '/api/Product',
      transformResponse: (response: ApiResponse<ProductDetail[]>) => response.data,
      providesTags: (result) => providesList(result, 'ProductDetail'),
    }),
    createProduct: builder.mutation<ProductDetail, Partial<ProductDetail>>({
      query: (body) => ({
        url: '/api/Product',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<ProductDetail>) => response.data,
      invalidatesTags: [
        { type: 'ProductDetail', id: 'LIST' },
        { type: 'Customer', id: 'LIST' }
      ],
    }),
    updateProduct: builder.mutation<ProductDetail, { id: number; data: Partial<ProductDetail> }>({
      query: ({ id, data }) => ({
        url: `/api/Product/${id}`,
        method: 'PUT',
        body: {
          id,
          ...data,
        },
      }),
      transformResponse: (response: ApiResponse<ProductDetail>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ProductDetail', id },
        { type: 'ProductDetail', id: 'LIST' },
        { type: 'Customer', id: 'LIST' }
      ],
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/Product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'ProductDetail', id },
        { type: 'ProductDetail', id: 'LIST' },
        { type: 'Customer', id: 'LIST' }
      ],
    }),

    // Customer-Product relationship endpoints
    addProductToCustomer: builder.mutation<void, { customerId: number; productId: number }>({
      query: ({ customerId, productId }) => ({
        url: `/api/Customer/${customerId}/products/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Customer', id: 'LIST' },
        { type: 'CustomerProducts', id: customerId },
        { type: 'ProductDetail', id: 'LIST' }
      ],
    }),
    removeProductFromCustomer: builder.mutation<void, { customerId: number; productId: number }>({
      query: ({ customerId, productId }) => ({
        url: `/api/Customer/${customerId}/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Customer', id: 'LIST' },
        { type: 'CustomerProducts', id: customerId },
        { type: 'ProductDetail', id: 'LIST' }
      ],
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
  useAddProductToCustomerMutation,
  useRemoveProductFromCustomerMutation,
} = api; 