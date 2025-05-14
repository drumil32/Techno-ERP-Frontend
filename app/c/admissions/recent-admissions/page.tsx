import AdmissionLayout from '@/components/layout/admission-layout';
import RecentAdmissionsPage from '@/components/layout/admissions/recent-admission-page';

export default function AdmissionsPage() {
  return (
    <AdmissionLayout>
      <RecentAdmissionsPage />
    </AdmissionLayout>
  );
}
