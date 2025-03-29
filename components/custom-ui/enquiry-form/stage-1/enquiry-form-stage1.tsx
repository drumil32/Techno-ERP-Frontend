// UI components
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { enquiryStep1RequestSchema } from './schema';
import {
  AdmissionMode,
  AdmissionReference,
  ApplicationStatus,
  Category,
  Course,
  EducationLevel,
  Gender
} from '@/static/enum';
import { Form } from '@/components/ui/form';

// Custom Components 
import EnquiryFormFooter from './enquiry-form-footer-section';
import StudentDetailsForm from './student-details-section';
import AddressDetailsSection from './address-details-section';
import AcademicDetailsSection from './academic-details-section';
import FilledByCollegeSection from './filled-by-college-section';
import ConfirmationCheckBox from './confirmation-check-box';
import { useQuery } from '@tanstack/react-query';
import { counsellorNames, createEnquiry, createEnquiryDraft, getEnquiry, teleCallerNames, updateEnquiryStatus } from './enquiry-form-api';
import { useSearchParams } from 'next/navigation';

// Form Schema
const formSchema = z.object(enquiryStep1RequestSchema.shape).extend({
  confirmation: z.boolean().refine(value => value === true, {
    message: "You must confirm to proceed."
  })
});

const EnquiryFormStage1 = () => {
  
  const searchParams = useSearchParams();
  const enquiry_id = searchParams.get('enquiry_id');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admissionMode: AdmissionMode.ONLINE,
      dateOfBirth: '',
      dateOfEnquiry: '',
      studentPhoneNumber: '',
      studentName: '',
      gender: Gender.NOT_TO_MENTION,
      fatherName: '',
      fatherPhoneNumber: '',
      fatherOccupation: '',
      motherName: '',
      motherPhoneNumber: '',
      motherOccupation: '',
      category: Category.GENERAL,
      address: {
        addressLine1: '',
        addressLine2: '',
        district: '',
        state: '',
        pincode: '',
        country: ''
      },
      emailId: '',
      reference: AdmissionReference.Advertising,
      course: Course.BCOM,
      counsellor: '',
      remarks: '',
      academicDetails: [
        {
          educationLevel: EducationLevel.Tenth,
          schoolCollegeName: '',
          universityBoardName: '',
          passingYear: 0,
          percentageObtained: 0,
          subjects: []
        },
        {
          educationLevel: EducationLevel.Twelfth,
          schoolCollegeName: '',
          universityBoardName: '',
          passingYear: 0,
          percentageObtained: 0,
          subjects: []
        },
        {
          educationLevel: EducationLevel.Graduation,
          schoolCollegeName: '',
          universityBoardName: '',
          passingYear: 0,
          percentageObtained: 0,
          subjects: []
        }
      ],
      applicationStatus: ApplicationStatus.STEP_1,
      approvedBy: '',
      telecallerName: '',
      confirmation: false
    }
  });

  const { data, isError, isLoading, isPending } = useQuery({
    queryKey: ['enquiryFormData', enquiry_id],
    queryFn: () => enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null'),
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const { data: telecallerNamesData } = useQuery({
    queryKey: ['telecallerNames'],
    queryFn: teleCallerNames,
  });

  const { data: counsellorNamesData } = useQuery({
    queryKey: ['counsellorNames'],
    queryFn: counsellorNames,
  });

  const commonFormItemClass = 'col-span-1 gap-y-0';
  const commonFieldClass = '';

  async function saveDraft() {
    console.log('Draft saved with values:', form.getValues());
    // await createEnquiryDraft(form.getValues());
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    await createEnquiry(values);
    await updateEnquiryStatus({
      enquiry_id: enquiry_id,
      status: ApplicationStatus.STEP_2
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-8 mr-[25px] space-y-8 flex flex-col w-full "
      >
        {/* Student Details */}
        <StudentDetailsForm
          form={form}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* Address details */}
        <AddressDetailsSection
          form={form}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* Academic Details */}
        <AcademicDetailsSection
          form={form}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* To be filled by College */}
        <FilledByCollegeSection
          form={form}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
          telecallerNames={Array.isArray(telecallerNamesData) ? telecallerNamesData : []}
          counsellorNames={Array.isArray(counsellorNamesData) ? counsellorNamesData : []}
        />

        {/* Confirmation Check box */}
        <ConfirmationCheckBox form={form} />

        {/* Sticky Footer */}
        <EnquiryFormFooter saveDraft={saveDraft} />
      </form>
    </Form>
  );
};

export default EnquiryFormStage1;
