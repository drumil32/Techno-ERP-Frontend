import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { YellowLeadAnalytics } from './refine-data';



export const fetchAssignedToDropdown = async () => {
  const result= await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchAssignedToDropdown);
  return result;
};

export const fetchYellowLeads = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getYellowLeads, params);
  return res;
};

export const fetchYellowLeadsAnalytics = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest<YellowLeadAnalytics>(API_METHODS.POST, API_ENDPOINTS.getYellowLeadsAnalytics, params);

  if (!res) {
    throw new Error('Failed to fetch analytics');
  }

  return res;
};
