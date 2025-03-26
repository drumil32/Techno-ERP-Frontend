import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { API_METHODS } from "@/common/constants/apiMethods";
import { apiRequest } from "@/lib/apiClient";

export const fetchProfileData = async () => {
    const res = await apiRequest(
        API_METHODS.GET,
        API_ENDPOINTS.profile
    );
    return res;
}
