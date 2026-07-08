import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/lib/store/auth";

interface ClientConfig {
  baseURL: string;
  timeout?: number;
}

export function createApiClient(config: ClientConfig): AxiosInstance {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 15000,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "ar",
    },
  });

  client.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        const refreshed = await useAuthStore.getState().refreshSession();
        if (refreshed && error.config) {
          const token = useAuthStore.getState().accessToken;
          error.config.headers.Authorization = `Bearer ${token}`;
          return client.request(error.config);
        }
        useAuthStore.getState().logout();
      }
      return Promise.reject(normalizeError(error));
    }
  );

  return client;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

function normalizeError(error: AxiosError): ApiError {
  const response = error.response;
  const data = response?.data as Record<string, unknown> | undefined;
  return {
    message: (data?.message as string) ?? error.message ?? "حدث خطأ غير متوقع",
    code: (data?.code as string) ?? "UNKNOWN_ERROR",
    statusCode: response?.status ?? 0,
    details: data?.details,
  };
}
