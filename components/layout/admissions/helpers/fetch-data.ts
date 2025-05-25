import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import {
  AdmissionAggregationResponse,
  AdmissionCourseYearWiseResponse,
  AdmissionMonthCourseWiseResponse
} from '@/types/admissions';
import { AdmissionAggregationType } from '@/types/enum';
type AdmissionsProp = {
  applicationStatus: string[];
};

export const fetchAdmissionsData = async (body?: AdmissionsProp) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.admissionData, body);
  return res;
};

export const fetchDataForAdmissionReceipt = async (data: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.admissionReceipt, data);
  return res;
};

export const fetchDataForAdmissionFeeReceipt = async (data: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.admissionFeeReceipt, data);
  return res;
};

export const fetchAdmissionsAnalyticsData = async ({
  type,
  date
}: {
  type: AdmissionAggregationType;
  date: string;
}): Promise<AdmissionAggregationResponse> => {
  const res = await apiRequest(
    API_METHODS.GET,
    API_ENDPOINTS.admissionAnalyticsData({ type, date })
  );
  return res as AdmissionAggregationResponse;
};

export const fetchAdmissionsCourseYearAnalyticsData = async ({
  type,
  date
}: {
  type: AdmissionAggregationType;
  date: string;
}): Promise<AdmissionCourseYearWiseResponse> => {
  const res = await apiRequest(
    API_METHODS.GET,
    API_ENDPOINTS.admissionAnalyticsData({ type, date })
  );
  return res as AdmissionCourseYearWiseResponse;
};

export const fetchAdmissionsCourseMonthAnalyticsData = async ({
  type,
  date
}: {
  type: AdmissionAggregationType;
  date: string;
}): Promise<AdmissionMonthCourseWiseResponse> => {
  const res = await apiRequest(
    API_METHODS.GET,
    API_ENDPOINTS.admissionAnalyticsData({ type, date })
  );
  return res as AdmissionMonthCourseWiseResponse;
};
