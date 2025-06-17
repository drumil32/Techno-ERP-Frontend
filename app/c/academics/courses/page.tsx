"use client"
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import CourseLayout from '@/components/layout/course-layout';
import AllCoursesPage from '@/components/layout/courses/all-courses-page';
import useAuthStore from '@/stores/auth-store';
import { useHomeContext } from '../../HomeRouteContext';
import { getHomePage } from '@/lib/enumDisplayMapper';
import { useEffect } from 'react';
import RoleGuard from '@/guards/role-guard';
import { UserRoles } from '@/types/enum';

export default function CoursePage() {
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
    <CourseLayout>
      <TechnoFilterProvider key="courses" sectionKey="courses">
        <AllCoursesPage />
      </TechnoFilterProvider>
    </CourseLayout>
    </RoleGuard>
  );
}
