import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { apiRequest } from '@/lib/apiClient';
import { UserRoles } from '@/static/enum';

export const fetchLeads = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getAllLeads, params);
  return res;
};

export const fetchLeadsAnalytics = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.getAllLeadsAnalytics, params);
  return res;
};


interface UserData {
  userData: {
    id: string;
    name: string;
    email: string;
    roles: UserRoles[];
  };
}

const ROLE_PRIORITY: UserRoles[] = [
  UserRoles.ADMIN,
  UserRoles.LEAD_MARKETING,
  UserRoles.EMPLOYEE_MARKETING,
  UserRoles.COUNSELOR,
  UserRoles.BASIC_USER
];

export const fetchAssignedToDropdown = async () => {
  const profile: UserData | null = await apiRequest(API_METHODS.GET, API_ENDPOINTS.profile);
  
  if (!profile?.userData?.roles?.length) {
    throw new Error('No roles found for user');
  }

  const userRole = ROLE_PRIORITY.find(role => profile.userData.roles.includes(role)) 
                  || profile.userData.roles[0];

  const url = `${API_ENDPOINTS.fetchAssignedToDropdown}?role=${userRole}&moduleName=MARKETING`;

  return await apiRequest(API_METHODS.GET, url);
};