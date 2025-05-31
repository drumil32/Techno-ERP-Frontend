'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useHoverContext } from './hover-context';
import TechnoSidebarItem from './techno-sidebar-item';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/auth-store';

export default function TechnoSidebarFooter() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const hovered = useHoverContext();

  const handleLogout = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.logout, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      document.cookie =
        'is-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

      localStorage.clear();
      const data = await res.json();
      if (data && data.SUCCESS === true) {
        useAuthStore.getState().logout();
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      document.cookie =
        'is-authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
      useAuthStore.getState().logout();
      router.replace('/auth/login');
    }
  };

  return (
    <>
      {!hovered && (
        <Avatar className="transition-transform duration-300 ease-in-out">
          {/* TODO: Avatar will replace by the College Logo */}
          <AvatarImage
            className="rounded-full w-[33px] h-[33px]  object-contain p-1 bg-white"
            src="/images/techno-logo.webp"
            alt="User Avatar"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      )}
      <TechnoSidebarItem icon={LogOut} text="Logout" onClick={handleLogout} />
    </>
  );
}
