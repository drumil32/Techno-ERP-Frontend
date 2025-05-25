import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { UserRoles } from '@/types/enum';
import { DailyStatsResponse, DurationUserStats, StatsDuration } from '../interfaces';
interface UserData {
  userData: {
    id: string;
    name: string;
    email: string;
    roles: UserRoles[];
  };
}
// TODO Fix role to employee marketing
const ROLE_PRIORITY: UserRoles[] = [
  UserRoles.ADMIN,
  UserRoles.LEAD_MARKETING,
  UserRoles.EMPLOYEE_MARKETING,
  UserRoles.COUNSELOR,
  UserRoles.BASIC_USER
];

export const fetchAssignedToDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchAssignedToDropdown);
  return result;
};

export const marketingSourcesDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchMarketingSourcesDropdown);
  return result;
};

export const cityDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchCityDropdown);
  return result;
};

export const fixCityDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchFixCityDropdown);
  return result;
};

export const courseDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchCourseDropdown);
  return result;
};
export const fixCourseDropdown = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.fetchFixCourseDropdown);
  return result;
};

export const sourceAnalytics = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.sourceAnalytics);
  return result;
};

export const durationBasedSourceAnalytics = async (duration: StatsDuration) => {
  const result = await apiRequest(
    API_METHODS.POST,
    API_ENDPOINTS.durationBasedSourceAnalytics,
    duration
  );
  return result as DurationUserStats[];
};
export const todaySourceAnalytics = async () => {
  const result = await apiRequest(API_METHODS.GET, API_ENDPOINTS.todaySourceAnalytics);
  return result as DailyStatsResponse;
};
