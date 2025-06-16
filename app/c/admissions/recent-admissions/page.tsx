import AdmissionLayout from '@/components/layout/admission-layout';
import RecentAdmissionsPage from '@/components/layout/admissions/recent-admission-page';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { useEffect } from 'react';
import { useHomeContext } from '../../HomeRouteContext';
import { UserRoles } from '@/types/enum';

export default function AdmissionsPage() {
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
    <RoleGuard allowedRoles={[UserRoles.ADMIN, UserRoles.REGISTAR, UserRoles.FINANCE, UserRoles.FRONT_DESK]} fallbackPath={homeRoute} >
    <AdmissionLayout>
      <RecentAdmissionsPage />
    </AdmissionLayout>
    </RoleGuard>
  );
}
