import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { StudentDuesApiResponse } from '@/types/finance';

import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchActiveDues = async (
  context: QueryFunctionContext<readonly [string, any]>
): Promise<StudentDuesApiResponse> => {
  const [, params] = context.queryKey;
  const res = await apiRequest<StudentDuesApiResponse>(
    API_METHODS.POST,
    API_ENDPOINTS.getStudentActiveDues,
    params
  );
  if (!res) throw new Error('Failed to fetch student dues');
  return res;
};

