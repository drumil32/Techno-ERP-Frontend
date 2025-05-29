import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { SheetItem } from '@/types/marketing';
import { QueryFunctionContext } from '@tanstack/react-query';

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

export const fetchAvailableSheets = async (
  context: QueryFunctionContext<readonly [string, any]>
): Promise<SheetItem[]> => {
  const res = await apiRequest<SheetItem[]>(API_METHODS.GET, API_ENDPOINTS.getAvailableSheets);
  if (!res) throw new Error('Failed to fetch Student Fees Information');
  return res;
};

export const uploadSheetRequest = async (data: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.uploadMarketingData, data);
  return res;
};

export const downloadSheetRequest = async () => {
  const res = await apiRequest(API_METHODS.GET, API_ENDPOINTS.downloadMarketingData);
  return res;
};
