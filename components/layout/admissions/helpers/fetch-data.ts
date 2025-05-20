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

export const fetchDataForAdmissionReceipt = async (data: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.admissionReceipt, data)
  return res;
}

export const fetchDataForAdmissionFeeReceipt = async (data: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.admissionFeeReceipt, data)
  return res;
}