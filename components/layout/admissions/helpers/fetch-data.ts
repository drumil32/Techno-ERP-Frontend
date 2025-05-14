import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
type AdmissionsProp = {
  applicationStatus: string[];
};

export const fetchAdmissionsData = async (body?: AdmissionsProp) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.admissionData, body);
  return res;
};
