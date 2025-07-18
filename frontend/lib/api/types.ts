// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedDataResult<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Standard API Error format (RFC 9457)
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errorCode: string;
  errors?: Record<string, string>;
  traceId: string;
}

// Customer types
export interface CustomerDetail {
  id: number;
  address: string;
  phone: string;
  notes?: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  detail: CustomerDetail;
  products: ProductDetail[];
}

// Product types
export interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}