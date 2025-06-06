import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const districtDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchDistricts);
  return result;
};

export const fixCourseCodeDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchFixCourseCodesDropdown);
  return result;
};
