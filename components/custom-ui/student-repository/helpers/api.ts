import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { StudentData, StudentListData } from './interface';

export const fetchStudents = async (params: any) => {
  const res = await apiRequest<StudentListData>(
    API_METHODS.POST,
    API_ENDPOINTS.getStudentRepository,
    params
  );

  if (!res) {
    throw new Error('Failed to fetch students');
  }

  return res;
};

export const fetchStudent = async (id: string) => {
  if (!id) {
    throw new Error('Student ID is required');
  }

  const res = await apiRequest<StudentData>(API_METHODS.GET, API_ENDPOINTS.getSingleStudent(id));

  if (!res) {
    throw new Error('Failed to fetch student');
  }

  return res;
};

export const updateStudent = async (data: any) => {
  const res = await apiRequest<StudentData>(
    API_METHODS.PUT,
    API_ENDPOINTS.updateStudentRepository,
    data
  );

  if (!res) {
    throw new Error('Failed to update student');
  }

  return res;
};

export const updateStudentDocuments = async (data: any) => {
  const res = await apiRequest<StudentData>(
    API_METHODS.PUT,
    API_ENDPOINTS.updateStudentDocuments,
    data
  );

  if (!res) {
    throw new Error('Failed to update student documents');
  }

  return res;
};

export const updateDocument = async (data: any) => {
  const res = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateDocument, data);

  if (!res) {
    throw new Error('Failed to update documents');
  }

  return res;
};

export const courseDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchFixCourseCodesDropdown);
  return result;
};