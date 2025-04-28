import { UserRoles } from '@/types/enum';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type User = {
  name: string;
  email: string;
  roles: UserRoles[];
  accessToken?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasRole: (role: UserRoles) => boolean;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (userData: User) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      hasRole: (role: UserRoles) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

export default useAuthStore;
