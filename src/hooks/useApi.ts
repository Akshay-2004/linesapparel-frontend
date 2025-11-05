import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useState, useCallback } from "react";

// Improved error type definition
interface ApiError {
  message?: string;
  data?: {
    message?: string;
  };
}

// Enhanced API response type
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  uploadProgress: number;
}

// Define the hook's return type
interface UseApiReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  uploadProgress: number;
  fetchData: (
    url: string,
    options?: AxiosRequestConfig & { timeout?: number }
  ) => Promise<T | undefined>;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  timeout: 300000, // 5 minutes default timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  },
  // Enable sending cookies with requests
  withCredentials: true,
});

export function useApi<T>(): UseApiReturn<T> {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    error: null,
    loading: false,
    uploadProgress: 0,
  });

  const fetchData = useCallback(
    async (
      url: string,
      options?: AxiosRequestConfig & { timeout?: number }
    ) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        uploadProgress: 0,
      }));

      try {
        const requestConfig: AxiosRequestConfig = {
          ...options,
          withCredentials: true,
          timeout: options?.timeout || 300000, // 5 minutes for file uploads
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setState((prev) => ({ ...prev, uploadProgress: progress }));
            }
          },
        };

        const response: AxiosResponse = await api.request({
          url,
          ...requestConfig,
        });

        setState({
          data: response.data.data !== undefined ? response.data.data : response.data,
          error: null,
          loading: false,
          uploadProgress: 100,
        });

        return response.data.data !== undefined ? response.data.data : response.data;
      } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        const errorMessage =
          axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred";

        setState({
          data: null,
          error: errorMessage,
          loading: false,
          uploadProgress: 0,
        });

        throw axiosError; // Throwing the typed error
      }
    },
    [] // Empty dependency array to prevent re-creation
  );

  return {
    ...state,
    fetchData,
  };
}

// Export the axios instance in case it's needed elsewhere
export { api };
