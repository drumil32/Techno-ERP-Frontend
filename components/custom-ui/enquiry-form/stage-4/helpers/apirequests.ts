import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const updateEnquiryStep4 = async (data: any) => {
  return apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateEnquiryStep4, data);
};

export const createEnquiryStep4 = async (data: any) => {
  return apiRequest(API_METHODS.POST, API_ENDPOINTS.createEnquiryStep4, data);
};
export const approveEnquiry = async (data: any) => {
  return apiRequest(API_METHODS.POST, API_ENDPOINTS.approveEnquiry, data);
};
