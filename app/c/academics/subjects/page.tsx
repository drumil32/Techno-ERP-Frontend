"use client"
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import CourseLayout from '@/components/layout/course-layout';
import { AllSubjectsPage } from '@/components/layout/courses/subjects-page';
import RoleGuard from '@/guards/role-guard';
import useAuthStore from '@/stores/auth-store';
import { useHomeContext } from '../../HomeRouteContext';
import { useEffect } from 'react';
import { getHomePage } from '@/lib/enumDisplayMapper';
import { UserRoles } from '@/types/enum';

export default function SubjectsPage() {
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
    <RoleGuard allowedRoles={[UserRoles.ADMIN]} fallbackPath={homeRoute}>
    <CourseLayout>
      <TechnoFilterProvider key="subjects" sectionKey="subjects">
        <AllSubjectsPage />
      </TechnoFilterProvider>
    </CourseLayout>
    </RoleGuard>
  );
}
