import { AxiosError, create, isAxiosError } from 'axios';

import { secureSession } from '@/services/storage';

import type { AppError } from '@/types/domain';

const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com/v1',
  timeout: 12_000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async config => {
  const token = await secureSession.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function normalizeApiError(error: unknown): AppError {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return {
      code: axiosError.code ?? 'API_ERROR',
      message: axiosError.response?.data?.message ?? axiosError.message,
      status: axiosError.response?.status,
      retryable: !axiosError.response || (axiosError.response.status ?? 0) >= 500,
    };
  }
  return {
    code: 'UNKNOWN',
    message: error instanceof Error ? error.message : 'Something went wrong',
    retryable: false,
  };
}

export { apiClient, normalizeApiError };
