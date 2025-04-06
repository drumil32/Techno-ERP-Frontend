import EnquiryFormStage1 from "@/components/custom-ui/enquiry-form/stage-1/enquiry-form-stage1";
import AdmissionFormLayout from "@/components/layout/admission-form-layout";
import AdmissionLayout from "@/components/layout/admission-layout";

export default async function AdmissionsPage() {

    return (
        <AdmissionFormLayout>
            <EnquiryFormStage1 />
        </AdmissionFormLayout>
    );
}