import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_ROUTES } from '@/common/constants/apiRoutes';
import { toast } from 'sonner';
import logger from './logger';

type RequestParams = Record<string, string | number | boolean | undefined>;

export interface Response {
  SUCCESS: boolean;
  MESSAGE: string;
  DATA?: unknown;
  ERROR?: string;
}

export const apiRequest = async <T>(
  method: string,
  url: string,
  data: unknown = {},
  params: RequestParams = {},
  extraHeaders: Record<string, string> = {}
): Promise<T | null> => {
  const isAuthRequest =
    url.includes(API_ENDPOINTS.login) ||
    url.includes(API_ENDPOINTS.register) ||
    url.includes(API_ENDPOINTS.send_otp) ||
    url.includes(API_ENDPOINTS.verify_otp) ||
    url.includes(API_ENDPOINTS.forgot_password) ||
    url.includes(API_ENDPOINTS.update_password) ||
    url.includes(API_ENDPOINTS.logout);

  const isFormData = data instanceof FormData;

  // Construct query parameters
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  const requestUrl = queryString ? `${url}?${queryString}` : url;

  const response = await fetch(requestUrl, {
    method,
    ...(method !== 'GET' && { body: isFormData ? (data as FormData) : JSON.stringify(data) }),
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...extraHeaders
    },
    credentials: 'include'
  });

  const responseBody: Response = await response.json();

  if (!response.ok || !responseBody.SUCCESS) {
    toast.error(responseBody.ERROR || responseBody.MESSAGE || `HTTP Error: ${response.status}`);
    if (response.status === 401 && !isAuthRequest) {
      window.location.href = API_ROUTES.login;
    }
    return null;
  }

  return responseBody.DATA as T;
};
