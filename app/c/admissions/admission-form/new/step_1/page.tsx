import EnquiryFormStage1 from "@/components/custom-ui/enquiry-form/stage-1/enquiry-form-stage1";
import AdmissionLayout from "@/components/layout/admission-layout";

export default async function AdmissionsPage(){

    return (
    <AdmissionLayout>
        <EnquiryFormStage1 />
    </AdmissionLayout>
    );
}