"use client"
import CRMLayout from '@/components/layout/crm-layout';
import AdminTracker from '@/components/layout/admin-tracker/admin-tracker';
import { AdminTrackerProvider } from '@/components/layout/admin-tracker/admin-tracker-context';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import RoleGuard from '@/guards/role-guard';
import { UserRoles } from '@/types/enum';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import useAuthStore from '@/stores/auth-store';
import { useHomeContext } from '../../HomeRouteContext';
import { getHomePage } from '@/lib/enumDisplayMapper';
import { useEffect } from 'react';

export default function AdminTrackerPage() {
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
    <RoleGuard allowedRoles={[UserRoles.ADMIN,UserRoles.LEAD_MARKETING]} fallbackPath={homeRoute}>
      <CRMLayout>
        <TechnoFilterProvider key="admin-tracker" sectionKey="admin-tracker">
          <AdminTrackerProvider key="admin-tracker">
            <AdminTracker />
          </AdminTrackerProvider>
        </TechnoFilterProvider>
      </CRMLayout>
    </RoleGuard>
  );
}
