import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';

export const getEnquiry = async (enquiry_id: string) => {
    return apiRequest(
        API_METHODS.GET,
        API_ENDPOINTS.getEnquiry(enquiry_id)
    );
}

export const createEnquiry = async (data: any) => {
    return apiRequest(
        API_METHODS.POST,
        API_ENDPOINTS.createEnquiry,
        data
    );
}

export const updateEnquiry = async (data: any) => {
    return apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateEnquiry,
        data
    );
}

export const createEnquiryDraft = async (data: any) => {
    return apiRequest(
        API_METHODS.POST,
        API_ENDPOINTS.createEnquiryDraft,
        data
    );
}

export const updateEnquiryDraft = async (data: any) => {
    return apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateEnquiryDraft,
        data
    );
}

export const updateEnquiryStatus = async (data: any) => {
    return apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateEnquiryStatus,
        data
    );
}

export const getTeleCallers = async () => {
    return apiRequest(
        API_METHODS.GET,
        API_ENDPOINTS.fetchTeleCallersDropdown
    );
}

export const getCounsellors = async () => {
    return apiRequest(
        API_METHODS.GET,
        API_ENDPOINTS.fetchCounsellorsDropdown
    );
}