export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7295',
} as const;

// Type for our API configuration
export type ApiConfig = typeof API_CONFIG; 