'use client';

import { FinanceLayout } from '@/components/layout/finance-layout';
import SelectedCourseDuesDetails from '@/components/layout/finance-course-dues/selected-course-dues-details';

export default function SelectedCourseYearDues() {
  return (
    <FinanceLayout>
      <SelectedCourseDuesDetails />
    </FinanceLayout>
  );
}
