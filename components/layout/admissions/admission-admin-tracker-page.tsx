import { Label } from '@/components/ui/label';
import AdmissionTrend from './admin-tracker/admissions-trend';
import CourseWiseAdmissionTrend from './admin-tracker/course-wise-trend';

export default function AdmissionAdminTrackerPage() {
  return (
    <div className="flex flex-col gap-5 pb-8">
      <Label className="font-[700]  text-3xl text-[#4E4E4E]">Admissions Tracker</Label>
      <AdmissionTrend />
      <CourseWiseAdmissionTrend />
    </div>
  );
}
