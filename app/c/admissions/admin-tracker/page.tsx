import { SITE_MAP } from '@/common/constants/frontendRouting';
import AdmissionLayout from '@/components/layout/admission-layout';
import AdmissionAdminTrackerPage from '@/components/layout/admissions/admission-admin-tracker-page';
import { UserRoles } from '@/types/enum';

export default function Page() {
  return (
    <AdmissionLayout>
      <AdmissionAdminTrackerPage />
    </AdmissionLayout>
  );
}
