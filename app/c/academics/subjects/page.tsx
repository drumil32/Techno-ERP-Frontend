import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import CourseLayout from '@/components/layout/course-layout';
import { AllSubjectsPage } from '@/components/layout/courses/subjects-page';

export default function SubjectsPage() {
  return (
    <CourseLayout>
      <TechnoFilterProvider key="subjects" sectionKey="subjects">
        <AllSubjectsPage />
      </TechnoFilterProvider>
    </CourseLayout>
  );
}
