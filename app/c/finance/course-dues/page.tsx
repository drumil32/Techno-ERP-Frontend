'use client';

import { FinanceLayout } from '@/components/layout/finance-layout';
import CourseDuesDetails from '@/components/layout/finance-course-dues/course-dues-page';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { useEffect } from 'react';
import { useHomeContext } from '../../HomeRouteContext';

export default function CourseDuesPage() {
  const { user } = useAuthStore()
  const { setHomeRoute, homeRoute } = useHomeContext();

  useEffect(() => {
    if (user && user.roles) {
      for (const role of user.roles) {
        const homePage = getHomePage(role);
        if (homePage) {
          setHomeRoute(homePage)
          return;
        }
      }
    }

  }, [user])
  return (
    <RoleGuard allowedRoles={[UserRoles.ADMIN, UserRoles.FINANCE]} fallbackPath={homeRoute} >
    <TechnoFilterProvider key="college-name" sectionKey="college-name">
      <FinanceLayout>
        <CourseDuesDetails />
      </FinanceLayout>
    </TechnoFilterProvider>
    </RoleGuard>
  );
}
