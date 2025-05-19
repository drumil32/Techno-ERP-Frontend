'use client';
// React and Next.js imports
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

// Form handling and validation imports
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { enquiryDraftStep3Schema, enquiryStep3UpdateRequestSchema } from '../schema/schema';

// UI components and form utilities
import { Form } from '@/components/ui/form';
import EnquiryFormFooter from '../stage-1/enquiry-form-footer-section';
import AcademicDetailsSectionStage3 from './academic-details-section';
import StudentDetailsSectionStage3 from './student-details-section';
import AddressDetailsSectionStage3 from './address-details-section';
import ConfirmationCheckBoxStage3 from './acknowledgement-section';
import EntranceExamDetailsSection from './entrance-exam-details-section';
import MoreDetailsSection from './more-details-section';
import OfficeUseSection from './office-use-section';
import ScholarshipDetailsSection from './scholarship-details-section';
import ConfirmationSection from './confirmation-section';
import ShowStudentData from '../stage-2/data-show';
import AllDocuments, { mandatoryDocuments } from './documents-section/all-documents';

// API and data fetching imports
import { getEnquiry, updateEnquiryStatus } from '../stage-1/enquiry-form-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAdmissionRedirect } from '@/lib/useAdmissionRedirect';

// Utility and type imports
import { format } from 'date-fns';
import { ApplicationStatus, EducationLevel } from '@/types/enum';
import { Admission } from '@/types/admissions';
import { toast } from 'sonner';
import { filterBySchema, removeNullValues } from '@/lib/utils';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { updateEnquiryDraftStep3, updateEnquiryStep3 } from './helper/apirequests';
import { useRouter } from 'next/navigation';
import { error } from 'console';
import { EnquiryDocument } from './documents-section/single-document-form';
import DocumentVerificationSection from './document-verification';

export const formSchemaStep3 = z.object(enquiryStep3UpdateRequestSchema.shape).extend({
  confirmation: z.boolean().refine((value) => value === true, {
    message: 'You must confirm to proceed.'
  })
});

const EnquiryFormStage3 = () => {
  const queryClient = useQueryClient();
  const pathVariables = useParams();
  const id = pathVariables.id as string;
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();
  const [isDocumentVerificationValid, setIsDocumentVerificationValid] = useState(false);
  const [documentVerificationStatus, setDocumentVerificationStatus] = useState(true);
  const { data, isError, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['enquiryFormData', id, refreshKey],
    queryFn: () => getEnquiry(id ? id : ''),
    refetchOnWindowFocus: false,
    enabled: !!id
  });

  const [currentDocuments, setCurrentDocuments] = useState<EnquiryDocument[]>(
    (data?.documents as EnquiryDocument[]) ?? []
  );

  useEffect(() => {
    setCurrentDocuments((data?.documents as EnquiryDocument[]) ?? []);
  }, [data]);

  const {
    isChecking: isRedirectChecking,
    isCheckError: isRedirectError,
    isViewable
  } = useAdmissionRedirect({
    id,
    currentStage: ApplicationStatus.STEP_3
  });

  const form = useForm<z.infer<typeof formSchemaStep3>>({
    resolver: zodResolver(formSchemaStep3),
    disabled: isViewable
  });

  async function saveDraft() {
    let values = form.getValues();
    const documentNotes = values.physicalDocumentNote || [];

    values = removeNullValues(values);
    values.physicalDocumentNote = documentNotes.map((note) => ({
      type: note.type,
      status: note.status,
      dueBy: note.dueBy
    }));

    const schemaKeys = Object.keys(enquiryDraftStep3Schema.shape);
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([key]) => schemaKeys.includes(key))
    );

    const alwaysIncludeKeys = ['studentName', 'studentPhoneNumber', 'emailId'];
    const filteredKeys = Array.from(new Set([...Object.keys(values), ...alwaysIncludeKeys])).filter(
      (key) => schemaKeys.includes(key)
    );

    const partialSchema = enquiryDraftStep3Schema.pick(
      filteredKeys.reduce(
        (acc, key) => {
          acc[key as keyof typeof enquiryDraftStep3Schema.shape] = true;
          return acc;
        },
        {} as Partial<Record<keyof typeof enquiryDraftStep3Schema.shape, true>>
      )
    );

    const validationResult = partialSchema.safeParse(filteredValues);
    form.clearErrors();

    if (!validationResult.success) {
      const errors = validationResult.error.format();
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
      setNestedErrors(errors);
      toast.error('Validation failed. Please check the form fields');
      return false;

      throw new Error('Validation failed');
    }

    const { confirmation, _id, ...rest } = filteredValues;

    try {
      const response = await updateEnquiryDraftStep3({ ...rest, id });
      if (!response) {
        toast.error('Failed to update enquiry draft');
        throw new Error('Update failed');
      }

      toast.success('Enquiry draft updated successfully');
      form.setValue('confirmation', false);
      setRefreshKey((prev) => prev + 1);
      return true;
    } catch (error) {
      throw error;
    }
  }
  const onSubmit = async (): Promise<boolean> => {
    try {
      let values = form.getValues();
      values = removeNullValues(values);
      const filteredData = filterBySchema(formSchemaStep3, values);

      if (currentDocuments.length !== 2) {
        toast.error('Please upload all mandatory documents before proceeding.');
        return false;
      }

      const { confirmation, _id, ...rest } = filteredData;

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

      if (!isDocumentVerificationValid) {
        toast.error('Please ensure you complete document verification first');
        setDocumentVerificationStatus(false);
        return false;
      }

      const validation = enquiryStep3UpdateRequestSchema.safeParse(rest);
      if (!validation.success) {
        const errors = validation.error.format();
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

        setNestedErrors(errors);
        toast.error('Validation failed. Please check the form fields');
        return false;
        throw new Error('Validation failed');
      }

      const enquiry: any = await updateEnquiryStep3(rest);
      if (!enquiry) {
        toast.error('Failed to update enquiry');
        return false;
      }

      form.setValue('confirmation', false);
      form.reset();
      toast.success('Enquiry Updated Successfully');
      router.push(SITE_MAP.ADMISSIONS.FORM_STAGE_4(enquiry._id));
      return true;
    } catch (error) {
      // toast.error('An error occurred during submission');
      return false;
    }
  };
  const confirmationChecked = useWatch({ control: form.control, name: 'confirmation' });

  useEffect(() => {
    if (data) {
      const sanitizedData = removeNullValues(data);

      form.reset({
        ...sanitizedData,
        dateOfAdmission: sanitizedData.dateOfAdmission || format(new Date(), 'dd/MM/yyyy'),
        id: id,
        confirmation: false
      });
    }
  }, [data, form, id, refreshKey, isLoading, isFetching]);

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

  return (
    <>
      <ShowStudentData data={data as Admission} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="py-8 mr-[25px] space-y-8 flex flex-col w-full "
        >
          {/* Student Details */}
          <StudentDetailsSectionStage3
            form={form}
            isViewable={isViewable}
            commonFieldClass={commonFieldClass}
            commonFormItemClass={commonFormItemClass}
          />
          <MoreDetailsSection
            form={form}
            isViewable={isViewable}
            commonFieldClass={commonFieldClass}
            commonFormItemClass={commonFormItemClass}
            enquiryDocuments={currentDocuments}
            setCurrentDocuments={setCurrentDocuments}
          />
          {/* Address details */}
          <AddressDetailsSectionStage3
            form={form}
            isViewable={isViewable}
            commonFieldClass={commonFieldClass}
            commonFormItemClass={commonFormItemClass}
          />
          {/* Academic Details */}
          <AcademicDetailsSectionStage3
            isViewable={isViewable}
            form={form}
            commonFieldClass={commonFieldClass}
            commonFormItemClass={commonFormItemClass}
          />
          <EntranceExamDetailsSection
            form={form}
            commonFieldClass={commonFieldClass}
            commonFormItemClass={commonFormItemClass}
          />
          <DocumentVerificationSection
            documentVerificationStatus={documentVerificationStatus}
            onValidationChange={setIsDocumentVerificationValid}
            form={form}
            isViewable={isViewable}
          />
          {/* <AllDocuments
            enquiryDocuments={currentDocuments}
            setCurrentDocuments={setCurrentDocuments}
          /> */}
          <OfficeUseSection
            form={form}
            isViewable={isViewable}
            commonFieldClass={commonFieldClass}
            commonFormItemClass={commonFormItemClass}
          />
          {/* {!isViewable && <ConfirmationSection form={form} />} */}
          {/* <ScholarshipDetailsSection form={form} /> Removed as of now */}
          {!isViewable && (
            <>
              <ConfirmationCheckBoxStage3 form={form} />{' '}
              <EnquiryFormFooter
                form={form}
                onSubmit={onSubmit}
                saveDraft={saveDraft}
                confirmationChecked={confirmationChecked}
              />
            </>
          )}
        </form>
      </Form>
    </>
  );
};

export default EnquiryFormStage3;
