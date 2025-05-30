'use client';

import { FinanceLayout } from '@/components/layout/finance-layout';
import CourseDuesDetails from '@/components/layout/finance-course-dues/course-dues-page';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';

export default function CourseDuesPage() {
  return (
    <TechnoFilterProvider key="college-name" sectionKey="college-name">
      <FinanceLayout>
        <CourseDuesDetails />
      </FinanceLayout>
    </TechnoFilterProvider>
  );
}
