import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const fetchCourses = async ({ queryKey }: any) => {
    console.log("Fetching courses : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getCourseDetails, params);
    console.log("Response is : ", res);
    return res;
};

export const fetchUniqueCourses = async ({ queryKey }: any) => {
    console.log("Fetching Unique courses : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.GET, API_ENDPOINTS.getUniqueCourseDetails, params);
    console.log("Response is : ", res);
    return res;
};

export const createCourse = async ({ queryKey }: any) => {
    console.log("Creating courses : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.createCourse, params);
    console.log("Response is : ", res)
    return res;
};

export const updateCourse = async ({ queryKey }: any) => {
    console.log("Updating courses : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateCourse, params);
    console.log("Response is : ", res)
    return res;
};


export const fetchSubjects = async ({ queryKey }: any) => {
    console.log("Fetching subjects : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getSubjectDetails, params);
    console.log("Response is : ", res);
    return res;
};

export const fetchFilteredSubjects = async ({ queryKey }: any) => {
    console.log("Fetching subjects : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getFilteredSubjectDetails, params);
    console.log("Response is : ", res);
    return res;
};


export const createSubject = async ({ queryKey }: any) => {
    console.log("Creating subject : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.createSubject, params);
    console.log("Response is : ", res)
    return res;
};

export const updateSubject = async ({ queryKey }: any) => {
    console.log("Updating subjects : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateSubject, params);
    console.log("Response is : ", res)
    return res;
};


export const deleteSubject = async ({ queryKey }: any) => {
    console.log("Deleting subjects : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.DELETE, API_ENDPOINTS.deleteSubject, params);
    console.log("Response is : ", res)
    return res;
};


export const fetchSchedule = async ({ queryKey }: any) => {
    console.log("Fetching schedule : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getScheduleDetails, params);
    console.log("Response is : ", res);
    return res;
};

export const createPlan = async ({ queryKey }: any) => {
    console.log("Creating plan : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.createPlan, params);
    console.log("Response is : ", res)
    return res;
};

export const batchUpdatePlan = async ({ queryKey }: any) => {
    console.log("Batch Update plan : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.batchUpdatePlan, params);
    console.log("Response is : ", res)
    return res;
};


export const deletePlan = async ({ queryKey }: any) => {
    console.log("Deleting plan : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.DELETE, API_ENDPOINTS.deletePlan, params);
    console.log("Response is : ", res)
    return res;
};

export const deleteFileUsingURL = async ({ queryKey }: any) => {
    console.log("Deleting file using URL : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.DELETE, API_ENDPOINTS.deleteFileUsingURL, params);
    console.log("Response is : ", res)
    return res;
};

export const uploadAdditionalResources = async ({ queryKey }: any) => {
    console.log("Upload additional Resource : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.uploadAdditionalResources, params);
    console.log("Response is : ", res)
    return res;
};

export const uploadPlanDocument = async ({ queryKey }: any) => {
    console.log("Upload plan document : ");
    console.log("Query key is : ", queryKey);
    const [, params] = queryKey;  
    console.log("Params are : ", params);
    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.uploadPlan, params);
    console.log("Response is : ", res)
    return res;
};

export const fetchDepartmentDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.getDepartmentMetaData);
  return result;
};