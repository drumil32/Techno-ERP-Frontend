import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { toast } from 'sonner';

export const fetchCourses = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getCourseDetails, params);
  return res;
};

export const fetchUniqueCourses = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.GET, API_ENDPOINTS.getUniqueCourseDetails, params);
  return res;
};

export const createCourse = async (params: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.createCourse, params);
  return res;
};

export const updateCourse = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateCourse, params);
  return res;
};

export const fetchSubjects = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getSubjectDetails, params);
  return res;
};

export const fetchFilteredSubjects = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getFilteredSubjectDetails, params);
  return res;
};

export const createSubject = async (params: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.createSubject, params);
  return res;
};

export const updateSubject = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateSubject, params);
  return res;
};

export const deleteSubject = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.DELETE, API_ENDPOINTS.deleteSubject, params);
  return res;
};

export const fetchSchedule = async ({ queryKey }: any) => {
  const toastId = toast.loading('Loading schedule data...');
  try {
    const [, params] = queryKey;

    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getScheduleDetails, params);

    toast.success('Schedule loaded successfully', { id: toastId });
    return res;
  } catch (error) {
    toast.error('Failed to load schedule data', { id: toastId });
    throw error;
  }
};
export const createPlan = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.createPlan, params);
  return res;
};

export const batchUpdatePlan = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.batchUpdatePlan, params);
  return res;
};

export const deletePlan = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.DELETE, API_ENDPOINTS.deletePlan, params);
  return res;
};

export const deleteFileUsingURL = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.DELETE, API_ENDPOINTS.deleteFileUsingURL, params);
  return res;
};

export const uploadAdditionalResources = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.uploadAdditionalResources, params);
  return res;
};

export const uploadPlanDocument = async (params: any) => {
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.uploadPlan, params);
  return res;
};

export const fetchDepartmentDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.getDepartmentMetaData);
  return result;
};

export const fetchInstructors = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.fetchInstructorsMetaData, params);
  return res;
};
