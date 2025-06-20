import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { Admission } from '@/types/admissions';

export const getEnquiry = async (enquiry_id: string) => {
    if (!enquiry_id) {
        throw new Error('Enquiry ID is required');
    }

    const response = await apiRequest<Admission>(
        API_METHODS.GET,
        API_ENDPOINTS.getEnquiry(enquiry_id)
    );

    if (!response) {
        throw new Error('Failed to fetch enquiry data');
    }

    return response;
};


export const createEnquiry = async (data: any) => {
    return apiRequest(
        API_METHODS.POST,
        API_ENDPOINTS.createEnquiry,
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
    const response = await fetch(
        API_ENDPOINTS.updateEnquiryStatus,
        {
            method: API_METHODS.PUT,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch other fees");
    }
    return response.json();
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