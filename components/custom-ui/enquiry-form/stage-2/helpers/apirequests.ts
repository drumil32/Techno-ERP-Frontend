import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { json } from 'stream/consumers';

export const getOtherFees = async (courseCode: string): Promise<any[]> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.getOtherFees}/${courseCode}`, {
      method: API_METHODS.GET,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch other fees: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.DATA)) {
      throw new Error('Expected array data but received something else');
    }

    return data.DATA;
  } catch (error) {
    throw error;
  }
};

export const getFeesByCourseName = async (course_name: string) => {
  const response = await fetch(API_ENDPOINTS.getFeesByCourse(course_name), {
    method: API_METHODS.GET,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });

  const data = await response.json();

  if (!Array.isArray(data.DATA)) {
    throw new Error('Expected array data but received something else');
  }

  return data.DATA;
};

export const createStudentFees = async (data: any) => {
  return apiRequest(API_METHODS.POST, API_ENDPOINTS.createStudentFees, data);
};

export const updateStudentFees = async (data: any) => {
  return apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateStudentFees, data);
};

export const createStudentFeesDraft = async (data: any) => {
  return apiRequest(API_METHODS.POST, API_ENDPOINTS.createStudentFeesDraft, data);
};

export const updateStudentFeesDraft = async (data: any) => {
  return apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateStudentFeesDraft, data);
};

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
    throw new Error('Failed to fetch other fees');
  }

  return response.json();
};
