"use client"
import { SITE_MAP } from '@/common/constants/frontendRouting';
import AdmissionLayout from '@/components/layout/admission-layout';
import AdmissionAdminTrackerPage from '@/components/layout/admissions/admission-admin-tracker-page';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { useEffect } from 'react';
import { useHomeContext } from '../../HomeRouteContext';

export default function Page() {
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
    <RoleGuard allowedRoles={[UserRoles.ADMIN]} fallbackPath={homeRoute}>
      <AdmissionLayout>
        <AdmissionAdminTrackerPage />
      </AdmissionLayout>
    </RoleGuard>
  );
}
