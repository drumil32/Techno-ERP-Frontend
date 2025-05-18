import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { FeeHistoryItemType, FeeHistoryResponse, StudentDuesApiResponse, StudentFeeInformationResponse } from '@/types/finance';

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

export const fetchStudentFeeInformation = async (
  context: QueryFunctionContext<readonly [string, any]>
): Promise<StudentFeeInformationResponse> => {
  const [, params] = context.queryKey;
  const res = await apiRequest<StudentFeeInformationResponse>(
    API_METHODS.GET,
    API_ENDPOINTS.getStudentFeeInformation(params),
    params
  )
  if (!res) throw new Error('Failed to fetch Student Fees Information');
  return res;
}


export const recordPayment = async (data: any) => {
    return apiRequest(
        API_METHODS.POST,
        API_ENDPOINTS.recordPayment,
        data
    );
}

export const updateFeeBreakUp = async (data:any) => {
  return apiRequest(
    API_METHODS.PUT,
    API_ENDPOINTS.updateFeeBreakup,
    data
  )
}

export const fetchFeeBreakUpHistory = async (
  context: QueryFunctionContext<readonly [string, any]>
): Promise<FeeHistoryResponse> => {
  const [, params] = context.queryKey;
  const res = await apiRequest<FeeHistoryResponse>(
    API_METHODS.POST,
    API_ENDPOINTS.fetchFeeBreakUpHistory,
    params
  );
  if (!res) throw new Error('Failed to fetch student dues');
  return res;
};


export const fetchTransactionReceiptData = async (data:any) => {
  const res = await apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.transactionSlip,
    data
  );
  if (!res) throw new Error('Failed to fetch transaction receipt data');
  return res;
}