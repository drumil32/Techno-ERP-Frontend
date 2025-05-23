'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { SITE_MAP } from '@/common/constants/frontendRouting';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { toast } from 'sonner';
import { isatty } from 'tty';

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
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (user && isAuthenticated !== undefined) {
      if (!isAuthenticated) {
        router.push(SITE_MAP.AUTH.LOGIN);
        return;
      }

      const hasPermission = user?.roles?.some((role) => allowedRoles.includes(role));
      if (!hasPermission) {
        toast.error('You do not have permission');
        router.push(fallbackPath);
      }

      setIsChecking(false);
    }
  }, [allowedRoles, fallbackPath, isAuthenticated, router, user]);

  if (isChecking || !isAuthenticated) {
    return null;
  }

  const hasPermission = user?.roles?.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
}
