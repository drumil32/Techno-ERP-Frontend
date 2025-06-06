'use client';

// React and Next.js imports
import React, { useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { enquiryDraftStep1RequestSchema, enquiryStep1RequestSchema } from '../schema/schema';

import { useRouter } from 'next/navigation';

// React Hook Form and Zod imports
import { zodResolver } from '@hookform/resolvers/zod';

// React Query imports
import { useQuery } from '@tanstack/react-query';

// API and schema imports
import {
  createEnquiry,
  createEnquiryDraft,
  getEnquiry,
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
import { ApplicationStatus, Countries, EducationLevel, StatesOfIndia } from '@/types/enum';
import { filterBySchema, removeNullValues } from '@/lib/utils';
import { useAdmissionRedirect } from '@/lib/useAdmissionRedirect';
import { SITE_MAP } from '@/common/constants/frontendRouting';

// Form Schema
export const formSchema = z.object(enquiryStep1RequestSchema.shape).extend({
  confirmation: z.boolean().refine((value) => value === true, {
    message: 'You must confirm to proceed.'
  })
});

const EnquiryFormStage1 = ({ id }: { id?: string }) => {
  const router = useRouter();

  const {
    isChecking: isRedirectChecking,
    isCheckError: isRedirectError,
    isViewable
  } = useAdmissionRedirect({
    id,
    currentStage: ApplicationStatus.STEP_1
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      address: {
        state: StatesOfIndia.UttarPradesh,
        district: 'Lucknow',
        country: Countries.India
      },
      studentPhoneNumber: '',
      confirmation: false,
      srAmount: 0
    },
    disabled: isViewable
  });

  // Fetch enquiry data if id is provided
  const { data, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['enquiryFormData', id],
    queryFn: () => getEnquiry(id ? id : ''),
    enabled: !!id && !isRedirectChecking && !isRedirectError,
    refetchOnWindowFocus: false
  });

  const confirmationChecked = useWatch({ control: form.control, name: 'confirmation' });

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

  const commonFormItemClass = 'col-span-1 min-h-[50px] gap-y-0  ';
  const commonFieldClass = 'gap-y-0';

  async function saveDraft() {
    let values = form.getValues();
    values = removeNullValues(values);
    const schemaKeys = Object.keys(enquiryDraftStep1RequestSchema.shape);
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => schemaKeys.includes(key))
    );

    const alwaysIncludeKeys = ['studentName', 'studentPhoneNumber'];
    const filteredKeys = Array.from(new Set([...Object.keys(values), ...alwaysIncludeKeys])).filter(
      (key) => schemaKeys.includes(key)
    );

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
    form.clearErrors();

    if (!validationResult.success) {
      toast.error('Validation failed. Please check the form fields.');
      form.setError('root', {
        type: 'manual',
        message: 'Validation failed. Please check the form fields.'
      });

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

      setNestedErrors(validationResult.error.format());

      return false;
      // throw new Error('Validation failed');
    }

    const { confirmation, id, _id, ...rest } = filteredValues;

    try {
      if (!_id) {
        const response: any = await createEnquiryDraft(rest);
        if (!response) {
          toast.error('Failed to create enquiry draft');
          throw new Error('Failed to create draft');
        }
        toast.success('Enquiry draft created successfully');
        sessionStorage.setItem('draftSaved', 'true');
        router.push(SITE_MAP.ADMISSIONS.FORM_STAGE_1(response._id));
      } else {
        const response = await updateEnquiryDraft({ ...rest, id: _id });
        if (!response) {
          toast.error('Failed to update enquiry draft');
          throw new Error('Failed to update draft');
        }
        toast.success('Enquiry draft updated successfully');
      }
      form.setValue('confirmation', false);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async function onSubmit() {
    let values = form.getValues();
    values = removeNullValues(values);
    const filteredData = filterBySchema(formSchema, values);

    const { confirmation, ...rest } = filteredData;

    if ((rest as any).academicDetails) {
      const academicDetails = (rest as any).academicDetails;
      if (Array.isArray(academicDetails)) {
        (rest as any).academicDetails = academicDetails.filter((entry: any) => {
          const { educationLevel, _id, ...otherFields } = entry;
          return Object.values(otherFields).some(
            (value) => value !== null && value !== undefined && value !== ''
          );
        });
      }
    }

    const validation = enquiryStep1RequestSchema.safeParse(rest);
    if (!validation.success) {
      toast.error('Validation failed. Please check the form fields.');
      form.setError('root', {
        type: 'manual',
        message: 'Validation failed. Please check the form fields.'
      });

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

      setNestedErrors(validation.error.format());
      return false;
      throw new Error('Validation failed');
    }
    const enquiry: any = await createEnquiry(rest);

    // const response = await updateEnquiryStatus({
    //   id: enquiry?._id,
    //   newStatus: ApplicationStatus.STEP_2
    // });

    // if (!response) {
    //   toast.error('Failed to update enquiry status');
    //   return;
    // }
    // toast.success('Enquiry status updated successfully');

    form.setValue('confirmation', false);
    await form.reset();

    router.push(SITE_MAP.ADMISSIONS.FORM_STAGE_2(enquiry._id));
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
          isViewable={isViewable}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* Address details */}
        <AddressDetailsSection
          form={form}
          isViewable={isViewable}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* Academic Details */}
        <AcademicDetailsSection
          form={form}
          isViewable={isViewable}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* To be filled by College */}
        <FilledByCollegeSection
          form={form}
          isViewable={isViewable}
          commonFieldClass={commonFieldClass}
          commonFormItemClass={commonFormItemClass}
        />

        {/* Confirmation Check box */}
        {!isViewable && (
          <ConfirmationCheckBox
            form={form}
            name="confirmation"
            isViewable={isViewable}
            label="All the above information has been verified by the applicant and thoroughly checked by the Admissions team."
            id="checkbox-for-step1"
            className="flex flex-row items-start bg-white rounded-md p-4 -mt-[40px]"
          />
        )}

        {/* Sticky Footer */}
        {!isViewable && (
          <EnquiryFormFooter
            saveDraft={saveDraft}
            form={form}
            onSubmit={onSubmit}
            confirmationChecked={confirmationChecked}
          />
        )}
      </form>
    </Form>
  );
};

export default EnquiryFormStage1;
