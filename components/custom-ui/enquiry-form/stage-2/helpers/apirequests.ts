import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { API_METHODS } from "@/common/constants/apiMethods";

export const getOtherFees = async () => {
    const response = await fetch(API_ENDPOINTS.getOtherFees, {
      method: API_METHODS.GET,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error("Failed to fetch other fees");
    }
  
    return response.json();
  }
  
  