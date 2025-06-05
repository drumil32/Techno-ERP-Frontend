import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { SheetItem, UserAnalyticsData } from '@/types/marketing';
import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchLeads = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getAllLeads, params);
  console.log(res);
  return res;
};

export const fetchLeadsAnalytics = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getAllLeadsAnalytics, params);
  return res;
};

export const fetchAssignedToDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchAssignedToDropdown);
  // console.log(result)
  return result;
};

export const fetchAvailableSheets = async (
  context: QueryFunctionContext<readonly [string, any]>
): Promise<SheetItem[]> => {
  const res = await apiRequest<SheetItem[]>(API_METHODS.GET, API_ENDPOINTS.getAvailableSheets);
  // console.log(res)
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

export const fetchUserAnalytics = async (): Promise<UserAnalyticsData> => {
  const res = await apiRequest<UserAnalyticsData>(API_METHODS.GET, API_ENDPOINTS.getUserAnalytics);
  if (!res) throw new Error('Failed to fetch User Analytics');
  return res;
};

export const updateAnalyticsRemarks = async (data: any) => {
  const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateAnalyticsRemarks, data);
  return res;
};
