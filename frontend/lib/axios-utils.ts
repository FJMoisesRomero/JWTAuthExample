import axios from 'axios';

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  );
};

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (isApiError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};
