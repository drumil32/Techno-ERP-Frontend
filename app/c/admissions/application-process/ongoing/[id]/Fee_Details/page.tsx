import { StudentFeesForm } from "@/components/custom-ui/enquiry-form/stage-2/student-fees-form";
import AdmissionFormLayout from "@/components/layout/admission-form-layout";
import AdmissionLayout from "@/components/layout/admission-layout";

export default function StudentFeesPage() {
    return (
        // <AdmissionLayout>
            <AdmissionFormLayout>
                <StudentFeesForm />
            </AdmissionFormLayout>
        // </AdmissionLayout>
    );
}
