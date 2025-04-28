import { UserRoles } from './enum';

export type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRoles[];
  accessToken?: string;
};

export type AuthResponse = {
  token: string;
  roles: UserRoles[];
  userData: {
    name: string;
    email: string;
  };
};
