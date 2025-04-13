import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const updateEnquiryDraftStep3 = async (data: any) => {
    return apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateEnquiryDraftStep3,
        data
    );
}

export const updateEnquiryStep3 = async (data: any) => {
    return apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateEnquiryStep3,
        data
    );
}