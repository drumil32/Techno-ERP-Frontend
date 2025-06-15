import CRMLayout from '@/components/layout/crm-layout';
import AdminTracker from '@/components/layout/admin-tracker/admin-tracker';
import { AdminTrackerProvider } from '@/components/layout/admin-tracker/admin-tracker-context';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import RoleGuard from '@/guards/role-guard';
import { UserRoles } from '@/types/enum';
import { SITE_MAP } from '@/common/constants/frontendRouting';

export default function AdminTrackerPage() {
  return (
    <RoleGuard allowedRoles={[UserRoles.ADMIN,UserRoles.LEAD_MARKETING]} fallbackPath={SITE_MAP.MARKETING.ALL_LEADS}>
      <CRMLayout>
        <TechnoFilterProvider key="admin-tracker" sectionKey="admin-tracker">
          <AdminTrackerProvider key="admin-tracker">
            <AdminTracker />
          </AdminTrackerProvider>
        </TechnoFilterProvider>
      </CRMLayout>
    </RoleGuard>
  );
}
