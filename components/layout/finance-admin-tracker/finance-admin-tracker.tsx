import { SITE_MAP } from '@/common/constants/frontendRouting';
import AdvancedTechnoBreadcrumb from '@/components/custom-ui/breadcrump/advanced-techno-breadcrumb';
import { FinanceSummary } from './finance-summary-details';
import CourseWiseRevenue from './course-wise-revenue';
import Collections from './collections';

export default function FinanceAdminTrackerPage() {
  const breadcrumbItems = [
    { title: 'Finance', route: SITE_MAP.FINANCE.DEFAULT },
    { title: 'Admin Tracker', route: SITE_MAP.FINANCE.ADMIN_TRACKER }
  ];
  return (
    <>
      <AdvancedTechnoBreadcrumb items={breadcrumbItems} />
      {/* <FinanceSummary /> */}
      {/* <CourseWiseRevenue /> */}
      <Collections />
      {/* <CourseWiseRevenue/>   */}
    </>
  );
}
