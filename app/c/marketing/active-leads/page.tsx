"use client"
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import CRMLayout from '@/components/layout/crm-layout';
import YellowLeadsTracker from '@/components/layout/yellowLeads/yellow-leads-tracker';
import RoleGuard from '@/guards/role-guard';
import { UserRoles } from '@/types/enum';
import { useHomeContext } from '../../HomeRouteContext';
import useAuthStore from '@/stores/auth-store';
import { getHomePage } from '@/lib/enumDisplayMapper';
import { useEffect } from 'react';

export default function YellowLeads() {
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
    <RoleGuard allowedRoles={[UserRoles.FRONT_DESK, UserRoles.ADMIN, UserRoles.LEAD_MARKETING, UserRoles.EMPLOYEE_MARKETING]} fallbackPath={homeRoute}>
      <CRMLayout>
        <TechnoFilterProvider key="yellow-leads" sectionKey="yellow-leads">
          <YellowLeadsTracker />
        </TechnoFilterProvider>
      </CRMLayout>
    </RoleGuard>
  );
}
