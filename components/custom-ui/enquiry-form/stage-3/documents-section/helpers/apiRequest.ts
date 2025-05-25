import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const uploadDocumentAPI = async (data: any) => {
  return apiRequest(API_METHODS.PUT, API_ENDPOINTS.uploadDocument, data);
};

export const verifyOtp = async (enquiryId: string, otp: string) => {
  return apiRequest(API_METHODS.POST, API_ENDPOINTS.verifyOtpSection, {
    id: enquiryId,
    otp: otp
  });
};
