'use client';

// React and Next.js imports
import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { enquiryDraftStep1RequestSchema, enquiryStep1RequestSchema } from '../schema/schema';

import { useRouter } from 'next/navigation';

// React Hook Form and Zod imports
import { zodResolver } from '@hookform/resolvers/zod';

// React Query imports
import { useQueries, useQuery } from '@tanstack/react-query';

// API and schema imports
import {
  createEnquiry,
  createEnquiryDraft,
  getCounsellors,
  getEnquiry,
  getTeleCallers,
  updateEnquiryDraft,
  updateEnquiryStatus
} from './enquiry-form-api';

// Component and UI imports
import { Form } from '@/components/ui/form';
import EnquiryFormFooter from './enquiry-form-footer-section';
import StudentDetailsForm from './student-details-section';
import AddressDetailsSection from './address-details-section';
import AcademicDetailsSection from './academic-details-section';
import FilledByCollegeSection from './filled-by-college-section';
import ConfirmationCheckBox from './confirmation-check-box';

// Utility and constants imports
import { toast } from 'sonner';
import { API_ROUTES } from '@/common/constants/apiRoutes';
import { ApplicationStatus, EducationLevel } from '@/types/enum';
import { filterBySchema, removeNullValues } from '@/lib/utils';

// Form Schema
export const formSchema = z.object(enquiryStep1RequestSchema.shape).extend({
  confirmation: z.boolean().refine((value) => value === true, {
    message: 'You must confirm to proceed.'
  })
});

const EnquiryFormStage1 = ({ id }: { id?: string }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      studentPhoneNumber: '',
      confirmation: false,
      academicDetails: [
        {
          educationLevel: EducationLevel.Tenth
        },
        {
          educationLevel: EducationLevel.Twelfth
        },
        {
          educationLevel: EducationLevel.Graduation
        }
      ]
    }
  });

  // Fetch enquiry data if id is provided
  const { data, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['enquiryFormData', id],
    queryFn: () => getEnquiry(id ? id : ''),
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      const sanitizedData = removeNullValues(data);
      form.reset(sanitizedData);
    }
  }, [data, form]);

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading enquiry data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (isError) {
        toast.error('Failed to load enquiry data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Admin tracker enquiry successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (isError) {
      toastIdRef.current = toast.error('Failed to load enquiry data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading enquiry data...', {
        duration: Infinity
      });
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [isLoading, isError, isSuccess, isFetching, data]);

  const commonFormItemClass = 'col-span-1 gap-y-0';
  const commonFieldClass = '';

  async function saveDraft() {
    let values = form.getValues();
    
    // Remove null values from the entire object
    values = removeNullValues(values);

    
    // Pick only the present fields from schema
    const schemaKeys = Object.keys(enquiryDraftStep1RequestSchema.shape);
    
    // Filter out values not in the schema
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => schemaKeys.includes(key))
    );

    const alwaysIncludeKeys = [
      'studentName',
      'studentPhoneNumber'
    ];
    
    const filteredKeys = Array.from(new Set([
      ...Object.keys(values),
      ...alwaysIncludeKeys
    ])).filter((key) => schemaKeys.includes(key));    
    
    const partialSchema = enquiryDraftStep1RequestSchema.pick(
      filteredKeys.reduce(
        (acc, key) => {
          acc[key as keyof typeof enquiryDraftStep1RequestSchema.shape] = true;
          return acc;
        },
        {} as Partial<Record<keyof typeof enquiryDraftStep1RequestSchema.shape, true>>
      )
    );

    const validationResult = partialSchema.safeParse(filteredValues);
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
    const { confirmation, _id, ...rest } = filteredValues;

    if (!id) {
      const response: any = await createEnquiryDraft(rest);
      if (!response) {
        toast.error('Failed to create enquiry draft');
        return;
      }

      toast.success('Enquiry draft created successfully');

      router.push(API_ROUTES.enquiryFormStage1(response._id));
    } else {
      const response = await updateEnquiryDraft({ ...rest, id });
      if (!response) {
        toast.error('Failed to update enquiry draft');
        return;
      }
      toast.success('Enquiry draft updated successfully');
    }
    form.setValue('confirmation', false);
  }

  async function onSubmit() {
    let values = form.getValues();
    values = removeNullValues(values);

    const filteredData = filterBySchema(formSchema, values);

    // remove confirmation field from values
    const { confirmation, _id, ...rest } = filteredData;
    
    const enquiry: any = await createEnquiry(rest);

    const response = await updateEnquiryStatus({
      id: enquiry?._id,
      newStatus: ApplicationStatus.STEP_2
    });

    if (!response) {
      toast.error('Failed to update enquiry status');
      return;
    }
    toast.success('Enquiry status updated successfully');

    form.setValue('confirmation', false);
    form.reset();

    router.push(API_ROUTES.enquiryFormStage2(enquiry._id));
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
        />

        {/* Confirmation Check box */}
        <ConfirmationCheckBox form={form} />

        {/* Sticky Footer */}
        <EnquiryFormFooter saveDraft={saveDraft} form={form} onSubmit={onSubmit} />
      </form>
    </Form>
  );
};

export default EnquiryFormStage1;
