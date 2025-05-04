import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { StudentData, StudentListData } from './interface';

export const fetchStudents = async ({ queryKey }: any) => {
  const res = await apiRequest<StudentListData>(API_METHODS.POST, API_ENDPOINTS.getStudentRepository);

  console.log('Response from fetchStudents:', res);

  if (!res) {
    throw new Error('Failed to fetch students');
  }

  return res;
};

export const fetchStudent = async (id: string) => {
  const res = await apiRequest<StudentData>(API_METHODS.GET, API_ENDPOINTS.getSingleStudent(id));

  if (!res) {
    throw new Error('Failed to fetch student');
  }

  return res;
};

export const updateStudent = async (data: any) => {
  const res = await apiRequest<StudentData>(API_METHODS.PUT, API_ENDPOINTS.updateStudentRepository, data);

  if (!res) {
    throw new Error('Failed to update student');
  }

  return res;
}

export const updateStudentDocuments = async (data: any) => {
  const res = await apiRequest<StudentData>(API_METHODS.PUT, API_ENDPOINTS.updateStudentDocuments, data);

  if (!res) {
    throw new Error('Failed to update student documents');
  }

  return res;
}