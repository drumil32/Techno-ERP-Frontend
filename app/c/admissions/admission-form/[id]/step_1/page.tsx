import EnquiryFormStage1 from "@/components/custom-ui/enquiry-form/stage-1/enquiry-form-stage1";
import AdmissionFormLayout from "@/components/layout/admission-form-layout";

export default async function AdmissionsPage({
    params,
  }: {
    params: Promise<{ id: string }>
  }){

    const { id } = await params;
    return (
    <AdmissionFormLayout>
        <EnquiryFormStage1 id={id} />
    </AdmissionFormLayout>
    );
}