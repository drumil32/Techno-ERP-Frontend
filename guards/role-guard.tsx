'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SITE_MAP } from '@/common/constants/frontendRouting';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRoles[];
  fallbackPath?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallbackPath = SITE_MAP.HOME.DEFAULT
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(SITE_MAP.AUTH.LOGIN);
      return;
    }

    const hasPermission = user?.roles?.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      router.push(fallbackPath);
    }
  }, [allowedRoles, fallbackPath, isAuthenticated, router, user]);

  if (!isAuthenticated) {
    return null;
  }

  const hasPermission = user?.roles?.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
