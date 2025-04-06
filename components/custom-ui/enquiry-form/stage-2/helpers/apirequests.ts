import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { API_METHODS } from "@/common/constants/apiMethods";
import { apiRequest } from "@/lib/apiClient";

export const getOtherFees = async () => {
  const response = await fetch(API_ENDPOINTS.getOtherFees, {
    method: API_METHODS.GET,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error("Failed to fetch other fees");
  }

  return response.json();
}


export const getFeesByCourseName = async (course_name: string) => {
  const response = await fetch(API_ENDPOINTS.getFeesByCourse(course_name), {
    method: API_METHODS.GET,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error("Failed to fetch other fees");
  }

  return response.json();
}

export const createStudentFees = async (data: any) => {
  return apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.createStudentFees,
    data
  );
}

export const updateStudentFees = async (data: any) => {
  return apiRequest(
    API_METHODS.PUT,
    API_ENDPOINTS.updateStudentFees,
    data
  );
}

export const createStudentFeesDraft = async (data: any) => {
  return apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.createStudentFeesDraft,
    data
  );
}

export const updateStudentFeesDraft = async (data: any) => {
  return apiRequest(
    API_METHODS.PUT,
    API_ENDPOINTS.updateStudentFeesDraft,
    data
  );
}

export const updateEnquiryStatus = async (payload: { id: string; newStatus: string }) => {
  const response = await fetch(API_ENDPOINTS.updateEnquiryStatus, {
    method: API_METHODS.PUT,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error("Failed to fetch other fees");
  }

  return response.json();
};