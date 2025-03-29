import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const fetchAssignedToDropdown = async ({ queryKey }: any) => {
  const res = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchAssignedToDropdown);
  return res;
};

export const fetchYellowLeads = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getYellowLeads, params);
  return res;
};

export const fetchYellowLeadsAnalytics = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getYellowLeadsAnalytics, params);
  return res;
};
