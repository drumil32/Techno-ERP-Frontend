import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { API_METHODS } from "@/common/constants/apiMethods";
import { apiRequest } from "@/lib/apiClient";

export const fetchAdmissionsData = async ({ queryKey }: any) => {
  const [, params] = queryKey;

  const res = await apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.admissionData,
    params
  );
  return res;
}
