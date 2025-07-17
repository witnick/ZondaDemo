import { AlertTriangle, Ban, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { ApiError } from '@/lib/api/types';
import { isApiError } from '@/lib/utils';

interface ApiErrorProps {
  error: unknown;
  onRetry?: () => void;
  className?: string;
}

export function ApiError({ error, onRetry, className }: ApiErrorProps) {
  // Handle network errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return (
      <Alert variant="destructive" className={className}>
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>Unable to connect to the server. Please check your internet connection.</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="w-fit"
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle API errors (RFC 9457)
  if (isApiError(error)) {
    const apiError = error as ApiError;
    return (
      <Alert variant="destructive" className={className}>
        <Ban className="h-4 w-4" />
        <AlertTitle>{apiError.title || 'API Error'}</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col gap-2">
          <p>{apiError.detail || 'An error occurred while processing your request.'}</p>
          {apiError.errors && (
            <ul className="list-disc list-inside">
              {Object.entries(apiError.errors).map(([field, message]) => (
                <li key={field}>
                  <span className="font-medium">{field}:</span> {message}
                </li>
              ))}
            </ul>
          )}
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="w-fit"
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Handle unknown errors
  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-2">
        <p>
          {error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred.'}
        </p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="w-fit"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
} 