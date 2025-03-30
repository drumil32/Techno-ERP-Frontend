// UI components
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { enquiryDraftStep1RequestSchema, enquiryStep1RequestSchema } from './schema';
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
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  createEnquiry,
  createEnquiryDraft,
  getCounsellors,
  getEnquiry,
  getTeleCallers,
  updateEnquiryStatus
} from './enquiry-form-api';
import { useSearchParams } from 'next/navigation';

// Form Schema
const formSchema = z.object(enquiryStep1RequestSchema.shape).extend({
  confirmation: z.boolean().refine((value) => value === true, {
    message: 'You must confirm to proceed.'
  })
});

const EnquiryFormStage1 = () => {
  // Get the enquiry / draft id from the URL
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

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
      telecaller: '',
      confirmation: false,
      dateOfCounselling: ''
    }
  });

  const { data, isError, isLoading, isPending } = useQuery({
    queryKey: ['enquiryFormData', id],
    queryFn: () => getEnquiry(id ? id : ''),
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      // Automatically remove extra fields not defined in the schema
      const parsedData = enquiryStep1RequestSchema.parse(data);
      form.reset(parsedData);
    }
  }, [data, form]);

  const results = useQueries({
    queries: [
      {
        queryKey: ['telecallers'],
        queryFn: getTeleCallers
      },
      {
        queryKey: ['counsellors'],
        queryFn: getCounsellors
      }
    ]
  });

  const telecallersData = results[0].data ?? [];
  const counsellorsData = results[1].data ?? [];

  const commonFormItemClass = 'col-span-1 gap-y-0';
  const commonFieldClass = '';

  async function saveDraft() {
    const values = form.getValues();

    // Validate values against enquiryDraftStep1RequestSchema
    const validationResult = enquiryDraftStep1RequestSchema.safeParse(values);

    if (!validationResult.success) {
      
      const errors = validationResult.error.format();
      form.setError('root', {
        type: 'manual',
        message: 'Validation failed. Please check the form fields.'
      });

      Object.keys(errors).forEach((key) => {
        if (key !== '_errors') {
          if (key in errors) {
            form.setError(key as keyof typeof values, {
              type: 'manual',
              message: errors[key]?.["_errors"][0] || 'Invalid value'
            });
          }
        }
      });

      return;
    }

    // remove confirmation field from values
    const { confirmation, ...rest } = values;

    console.log('Draft saved with values:', rest);
    await createEnquiryDraft(rest);
    
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // remove confirmation field from values
    const { confirmation, ...rest } = values;

    const enquiry: any = await createEnquiry(rest);
    await updateEnquiryStatus({
      id: enquiry?._id,
      newStatus: ApplicationStatus.STEP_2
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
          telecallers={Array.isArray(telecallersData) ? telecallersData : []}
          counsellors={Array.isArray(counsellorsData) ? counsellorsData : []}
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
