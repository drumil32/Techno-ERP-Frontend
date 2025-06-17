"use client"
import { useHomeContext } from '@/app/c/HomeRouteContext';
import EnquiryFormStage1 from '@/components/custom-ui/enquiry-form/stage-1/enquiry-form-stage1';
import AdmissionFormLayout from '@/components/layout/admission-form-layout';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AdmissionsPage() {
  const { user } = useAuthStore()
  const { setHomeRoute, homeRoute } = useHomeContext();
  const params = useParams();
  const id = params.id as string;

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
      <AdmissionFormLayout>
        <EnquiryFormStage1 id={id} />
      </AdmissionFormLayout>
    </RoleGuard>
  );
}
