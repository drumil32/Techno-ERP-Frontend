import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

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

  if (response.status === 401 && !isAuthRequest) {
    toast.error('Your session has expired. Please login again.');
    //FOR YOUR INFORMATION,
    // We are handling is-authenticated cookie to track auth status in frontend and below line handles the case where if user will remove token manually we will have to remove this as well so we can get redirection to login
    document.cookie =
      'is-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
    window.location.href = SITE_MAP.AUTH.LOGIN;
    return null;
  }

  const responseBody: Response = await response.json();

  if(responseBody.ERROR === "Invalid token"){
     toast.error('Your session has expired. Please login again.');
    //FOR YOUR INFORMATION,
    // We are handling is-authenticated cookie to track auth status in frontend and below line handles the case where if user will remove token manually we will have to remove this as well so we can get redirection to login
    document.cookie =
      'is-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
    window.location.href = SITE_MAP.AUTH.LOGIN;
    return null;
  }

  if (!response.ok || !responseBody.SUCCESS) {
    toast.error(responseBody.ERROR || responseBody.MESSAGE || `HTTP Error: ${response.status}`);
    const errorMessage = responseBody.ERROR || responseBody.MESSAGE|| 'Something went wrong'
    throw Error(errorMessage);
  }

  return responseBody.DATA as T;
};
