import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { API_METHODS } from "@/common/constants/apiMethods";
import { apiRequest } from "@/lib/apiClient";
import { CourseDues } from "@/types/finance";

import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchCourseDues = async (
  context: QueryFunctionContext<readonly [string, any]>
): Promise<CourseDues[]> => {
  const [, params] = context.queryKey;
  const res = await apiRequest<CourseDues[]>(
    API_METHODS.POST,
    API_ENDPOINTS.getCourseDues,
    params
  );
  if (!res) throw new Error('Failed to fetch course dues');
  return res;
};

export const updateCourseDues = async (
  context: QueryFunctionContext<readonly [string, any]>
) : Promise<null> => {
  const [, params] = context.queryKey;
  const res = await apiRequest<null>(
    API_METHODS.POST,
    API_ENDPOINTS.updateCourseDues,
    params
  )
  return res
}
