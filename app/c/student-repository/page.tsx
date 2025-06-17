"use client"
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import StudentRepositoryPage from '@/components/custom-ui/student-repository/student-repo';
import StudentRepositoryLayout from '@/components/layout/student-repository-layout';
import RoleGuard from '@/guards/role-guard';
import { getHomePage } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import React, { useEffect } from 'react';
import { useHomeContext } from '../HomeRouteContext';

const StudentRepository = () => {
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
      <StudentRepositoryLayout>
        <TechnoFilterProvider key="student-repository" sectionKey="student-repository">
          <StudentRepositoryPage />
        </TechnoFilterProvider>
      </StudentRepositoryLayout>
    </RoleGuard>
  );
};

export default StudentRepository;
