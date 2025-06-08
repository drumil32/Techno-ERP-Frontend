import { StudentFeesForm } from "@/components/custom-ui/enquiry-form/stage-2/student-fees-form";
import EnquiryFormStage3 from "@/components/custom-ui/enquiry-form/stage-3/enquiry-form-stage-3";
import AdmissionFormLayout from "@/components/layout/admission-form-layout";
import AdmissionLayout from "@/components/layout/admission-layout";

export default function RegistarPage() {
    return (
    <AdmissionFormLayout>
        <EnquiryFormStage3 />
    </AdmissionFormLayout>
    );
}
