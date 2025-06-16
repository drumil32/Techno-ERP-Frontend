"use client"
import CRMLayout from '@/components/layout/crm-layout';
import AllLeadsPage from '@/components/layout/allLeads/all-leads-page';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import RoleGuard from '@/guards/role-guard';
import { UserRoles } from '@/types/enum';
import { useHomeContext } from '../../HomeRouteContext';
import { useEffect } from 'react';
import useAuthStore from '@/stores/auth-store';
import { getHomePage } from '@/lib/enumDisplayMapper';

export default function AllLeads() {

  const { user } = useAuthStore()
  const {setHomeRoute, homeRoute} = useHomeContext();

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
    <RoleGuard allowedRoles={[UserRoles.ADMIN, UserRoles.LEAD_MARKETING, UserRoles.FRONT_DESK]} fallbackPath={homeRoute}>
      <CRMLayout>
        <TechnoFilterProvider key="all-leads" sectionKey="all-leads">
          <AllLeadsPage />
        </TechnoFilterProvider>
      </CRMLayout>
    </RoleGuard>
  );
}
