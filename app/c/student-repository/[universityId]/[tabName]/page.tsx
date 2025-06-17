"use client"
import { useHomeContext } from '@/app/c/HomeRouteContext';
import { MoreDetailsHeaderProvider } from '@/components/custom-ui/student-repository/more-details-header/more-details-header-context';
import SingleStudentRepositoryPage from '@/components/custom-ui/student-repository/single-student-repo';
import StudentRepositoryLayout from '@/components/layout/student-repository-layout';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import React, { useEffect } from 'react';

const SingleStudentRepository = () => {
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
    <RoleGuard allowedRoles={[UserRoles.ADMIN, UserRoles.REGISTAR, UserRoles.FINANCE, UserRoles.FRONT_DESK]} fallbackPath={homeRoute} >
    <MoreDetailsHeaderProvider>
      <StudentRepositoryLayout>
        <SingleStudentRepositoryPage />
      </StudentRepositoryLayout>
    </MoreDetailsHeaderProvider>
    </RoleGuard>
  );
};

export default SingleStudentRepository;
