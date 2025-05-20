import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { DailyCollectionData, MonthlyCollectionData } from '@/types/finance';
import { QueryFunctionContext } from '@tanstack/react-query';

export const fetchDailyCollections = async (
    context: QueryFunctionContext<readonly [string, any]>
): Promise<DailyCollectionData> => {
    const [, params] = context.queryKey;
    const res = await apiRequest<DailyCollectionData>(
        API_METHODS.POST,
        API_ENDPOINTS.getDailyCollections,
        params
    );
    if (!res) throw new Error('Failed to fetch daily collections');
    return res;
};

export const fetchMonthlyCollections = async (
    context: QueryFunctionContext<readonly [string, any]>
): Promise<MonthlyCollectionData> => {
    const [, params] = context.queryKey;
    const res = await apiRequest<MonthlyCollectionData>(
        API_METHODS.POST,
        API_ENDPOINTS.getMonthlyCollections,
        params
    );
    if (!res) throw new Error('Failed to fetch monthly collections');
    return res;
};
