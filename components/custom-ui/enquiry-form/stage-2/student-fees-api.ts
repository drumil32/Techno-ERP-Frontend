import { API_ENDPOINTS } from "@/common/constants/apiEndpoints"
import { API_METHODS } from "@/common/constants/apiMethods"
import { apiRequest } from "@/lib/apiClient"


export const getFeesByCourseName = async (course_name: string) => {
  return apiRequest(
    API_METHODS.GET,
    API_ENDPOINTS.getFeesByCourse(course_name)
  )
}

export const createStudentFees = async (data: any) => {
  return apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.createStudentFees,
    data
  )
}

export const updateStudentFees = async (data: any) => {
  return apiRequest(
    API_METHODS.PUT,
    API_ENDPOINTS.updateStudentFees,
    data
  )
}

export const createStudentFeesDraft = async (data: any) => {
  return apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.createStudentFeesDraft,
    data
  )
}

export const updateStudentFeesDraft = async (data: any) => {
  return apiRequest(
    API_METHODS.PUT,
    API_ENDPOINTS.updateStudentFeesDraft,
    data
  )
}

