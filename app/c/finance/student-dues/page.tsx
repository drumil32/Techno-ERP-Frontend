'use client';

import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import { FinanceLayout } from '@/components/layout/finance-layout';
import StudentDuesPage from '@/components/layout/finance-student-dues/finance-student-dues-page';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { useEffect } from 'react';
import { useHomeContext } from '../../HomeRouteContext';

export default function FinancePage() {
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
      <FinanceLayout>
        <TechnoFilterProvider key="student-dues" sectionKey="student-dues">
          <StudentDuesPage />
        </TechnoFilterProvider>
      </FinanceLayout>
    </RoleGuard>
  );
}
