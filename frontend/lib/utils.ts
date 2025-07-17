import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiError } from "./api/types";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') return false;
  
  const potentialApiError = error as Partial<ApiError>;
  return (
    typeof potentialApiError.type === 'string' &&
    typeof potentialApiError.title === 'string' &&
    typeof potentialApiError.status === 'number' &&
    typeof potentialApiError.detail === 'string'
  );
}
