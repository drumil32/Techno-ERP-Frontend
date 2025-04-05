import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { UserRoles } from '@/types/enum';

export const fetchLeads = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getAllLeads, params);
  return res;
};

export const fetchLeadsAnalytics = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getAllLeadsAnalytics, params);
  return res;
};

export const fetchAssignedToDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchAssignedToDropdown);
  return result;
};