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
  updateEnquiry,
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
      gender: Gender.NOT_TO_MENTION,
      category: Category.GENERAL,
      reference: AdmissionReference.Advertising,
      course: Course.BCOM,
      confirmation: false
    }
  });

  const { data, isError, isLoading, isPending } = useQuery({
    queryKey: ['enquiryFormData', id],
    queryFn: () => getEnquiry(id ? id : ''),
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      form.reset(data);
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

    // Pick only the present fields from schema
    const schemaKeys = Object.keys(enquiryDraftStep1RequestSchema.shape);
    const filteredKeys = Object.keys(values).filter((key) => schemaKeys.includes(key));

    const partialSchema = enquiryDraftStep1RequestSchema.pick(
      filteredKeys.reduce(
        (acc, key) => {
          acc[key as keyof typeof enquiryDraftStep1RequestSchema.shape] = true;
          return acc;
        },
        {} as Partial<Record<keyof typeof enquiryDraftStep1RequestSchema.shape, true>>
      )
    );

    const validationResult = partialSchema.safeParse(values);

    // Clear previous errors before setting new ones
    form.clearErrors();

    if (!validationResult.success) {
      const errors = validationResult.error.format();

      form.setError('root', {
        type: 'manual',
        message: 'Validation failed. Please check the form fields.'
      });

      // Recursive function to set errors for nested fields
      function setNestedErrors(errorObj: any, path = '') {
        Object.entries(errorObj).forEach(([key, value]) => {
          if (key === '_errors') {
            if (Array.isArray(value) && value.length > 0) {
              form.setError(path as keyof typeof values, {
                type: 'manual',
                message: value[0] || 'Invalid value'
              });
            }
          } else if (typeof value === 'object' && value !== null) {
            setNestedErrors(value, path ? `${path}.${key}` : key);
          }
        });
      }

      setNestedErrors(errors);
      return;
    }

    // Remove confirmation field from values
    const { confirmation, ...rest } = values;

    if (!id) {
      await createEnquiryDraft(rest);
    } else {
      await updateEnquiry({ ...rest, id });
    }

    form.setValue('confirmation', false);
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
