'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  feesRequestSchema,
  finalFeesCreateSchema,
  frontendFeesDraftValidationSchema,
  IFeesRequestSchema
} from './studentFeesSchema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { getCounsellors, getEnquiry, getTeleCallers } from '../stage-1/enquiry-form-api';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  createStudentFees,
  getFeesByCourseName,
  getOtherFees,
  updateEnquiryStatus,
  updateStudentFees
} from './helpers/apirequests';
import { displayFeeMapper, scheduleFeeMapper } from './helpers/mappers';
import { format, parse, isValid } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cleanDataForDraft } from './helpers/refine-data';
import { createStudentFeesDraft, updateStudentFeesDraft } from './student-fees-api';
import ShowStudentData from './data-show';
import { ApplicationStatus, FeeType } from '@/types/enum';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { validateCustomFeeLogic } from './helpers/validateFees';
import { useAdmissionRedirect } from '@/lib/useAdmissionRedirect';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import EnquiryFormFooter from '../stage-1/enquiry-form-footer-section';
import { DatePicker } from '@/components/ui/date-picker';
import { MultiSelectPopoverCheckbox } from '../../common/multi-select-popover-checkbox';
import ConfirmationCheckBox from '../stage-1/confirmation-check-box';
import Loading from '@/app/loading';

export const calculateDiscountPercentage = (
  totalFee: number | undefined | null,
  finalFee: number | undefined | null
): number => {
  const numericTotalFee = totalFee ?? 0;
  const numericFinalFee = finalFee ?? 0;

  if (numericTotalFee <= 0) {
    return 0;
  }

  const effectiveFinalFee = Math.min(numericFinalFee, numericTotalFee);

  const discount = 100 - (effectiveFinalFee / numericTotalFee) * 100;
  const roundedDiscount = Math.round(discount);

  return Math.max(0, roundedDiscount);
};

export const parseDisplayDate = (dateString: string | null | undefined): Date | undefined => {
  if (!dateString) return undefined;
  const parsed = parse(dateString, 'dd/MM/yyyy', new Date());
  if (isValid(parsed) && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return parsed;
  }
  return undefined;
};

export const formatDisplayDate = (date: Date | null | undefined): string | null => {
  if (date instanceof Date && isValid(date)) {
    return format(date, 'dd/MM/yyyy');
  }
  return null;
};

export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₹0';
  }
  return `₹${value.toLocaleString('en-IN')}`;
};

export const StudentFeesForm = () => {
  const params = useParams();
  const enquiry_id = params.id as string;
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const router = useRouter();

  const {
    isChecking: isRedirectChecking,
    isCheckError: isRedirectError,
    isViewable
  } = useAdmissionRedirect({
    id: enquiry_id,
    currentStage: ApplicationStatus.STEP_2
  });

  // Queries

  const {
    data: enquiryData,
    error,
    isLoading: isLoadingEnquiry
  } = useQuery<any>({
    queryKey: ['enquireFormData', enquiry_id], // Remove dataUpdated dependency
    queryFn: () => (enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null')),
    enabled: !!enquiry_id,
    // Add this to ensure the query refetches when invalidated
    refetchOnWindowFocus: false,
    staleTime: 0
  });

  const existingFinalFee = enquiryData?.studentFee;
  const existingFeeDraft = enquiryData?.studentFeeDraft;

  // Determine the current status
  const feeStatus: 'none' | 'draft' | 'final' = useMemo(() => {
    if (existingFinalFee) return 'final';
    if (existingFeeDraft) return 'draft';
    return 'none';
  }, [existingFinalFee, existingFeeDraft]);

  const draftExists = feeStatus === 'draft';
  const finalFeeExists = feeStatus === 'final';

  const draftId = existingFeeDraft?._id;
  const finalFeeId = existingFinalFee?._id;

  const studentEmail = enquiryData?.emailId;
  const studentPhone = enquiryData?.studentPhoneNumber;
  const courseName = enquiryData?.course;

  const {
    data: semWiseFeesData,
    error: semWiseFeeError,
    isLoading: isLoadingSemFees
  } = useQuery<any>({
    queryKey: ['courseFees', courseName],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    queryFn: () => getFeesByCourseName(courseName),
    enabled: !!courseName
  });

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

  const telecallers = Array.isArray(results[0].data) ? results[0].data : [];
  const counsellors = Array.isArray(results[1].data) ? results[1].data : [];

  const form = useForm<IFeesRequestSchema>({
    resolver: zodResolver(feesRequestSchema),
    mode: 'onChange',
    defaultValues: {
      otherFees: [],
      semWiseFees: [],
      enquiryId: enquiry_id,
      feesClearanceDate: null,
      counsellor: [],
      telecaller: [],
      remarks: '',
      confirmationCheck: false,
      otpTarget: undefined,
      otpVerificationEmail: null
    },
    disabled: isViewable
  });

  const { data: otherFeesData, isLoading: isLoadingOtherFees } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: () => getOtherFees(courseName),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!courseName
  });

  const confirmationChecked = useWatch({ control: form.control, name: 'confirmationCheck' });

  const otherFeesWatched = useWatch({ control: form.control, name: 'otherFees' });
  const semWiseFeesWatched = useWatch({ control: form.control, name: 'semWiseFees' });

  const { fields: semFields } = useFieldArray({
    control: form.control,
    name: 'semWiseFees'
  });

  const { fields: otherFeesFields, replace: replaceOtherFees } = useFieldArray({
    control: form.control,
    name: 'otherFees'
  });

  useEffect(() => {
    console.log('other fees data is ', otherFeesData);
  }, otherFeesData);

  const selectedOtpTarget = useWatch({ control: form.control, name: 'otpTarget' });

  const otpDisplayValue = useMemo(() => {
    if (selectedOtpTarget === 'email') {
      return studentEmail || '(Email not available)';
    } else if (selectedOtpTarget === 'phone') {
      return studentPhone || '(Phone not available)';
    }
    return '';
  }, [selectedOtpTarget, studentEmail, studentPhone]);

  useEffect(() => {
    if (enquiryData && semWiseFeesData && otherFeesData && !form.formState.isDirty) {
      const feeDataSource = existingFinalFee || existingFeeDraft;
      const isDataFromFinal = !!existingFinalFee;

      let initialSemFees: any[] = [];
      let initialOtherFees: any[] = [];

      const baseSem1Fee = semWiseFeesData[0];

      const existingSem1FeeDataInOther = feeDataSource?.otherFees?.find(
        (fee: any) => fee.type === FeeType.SEM1FEE
      );
      const existingSem1FeeDataInSemWise = feeDataSource?.semWiseFees?.[0];

      const sem1FeeObject = {
        type: FeeType.SEM1FEE,
        finalFee:
          existingSem1FeeDataInOther?.finalFee ??
          existingSem1FeeDataInSemWise?.finalFee ??
          baseSem1Fee ??
          undefined,
        amount: baseSem1Fee,
        feesDepositedTOA: existingSem1FeeDataInOther?.feesDepositedTOA ?? undefined
      };

      let initialCounsellors: string[] = enquiryData.counsellor ?? [];

      let initialTelecallers: string[] = enquiryData.telecaller ?? [];

      console.log(enquiryData);

      const initialCollegeRemarks: string = enquiryData?.remarks;

      initialOtherFees = Object.values(FeeType)
        .filter((ft) => ft !== FeeType.SEM1FEE)
        .map((feeType) => {
          const baseFeeInfo: any = otherFeesData.find((item: any) => item.type === feeType);
          const existingFee = feeDataSource?.otherFees?.find((fee: any) => fee.type === feeType);

          return {
            type: feeType,
            finalFee: existingFee?.finalFee ?? baseFeeInfo?.fee ?? undefined,
            feesDepositedTOA: existingFee?.feesDepositedTOA ?? undefined
          };
        });

      initialOtherFees.unshift(sem1FeeObject);
      otherFeesData.unshift(sem1FeeObject);

      const courseSemFeeStructure = semWiseFeesData || [];
      const existingSemFees = feeDataSource?.semWiseFees || [];

      initialSemFees = courseSemFeeStructure.map((baseFeeAmount: number, index: number) => {
        const existingData = existingSemFees[index];
        return {
          finalFee: existingData?.finalFee ?? baseFeeAmount
        };
      });

      const existingDateString = feeDataSource?.feesClearanceDate;
      let initialFeesClearanceDate: string | null = null;

      if (existingDateString) {
        initialFeesClearanceDate = existingDateString;
      } else {
        initialFeesClearanceDate = format(new Date(), 'dd/MM/yyyy');
      }

      form.reset({
        enquiryId: enquiry_id,
        otherFees: initialOtherFees,
        semWiseFees: initialSemFees,
        feesClearanceDate: initialFeesClearanceDate,
        counsellor: initialCounsellors,
        telecaller: initialTelecallers,
        remarks: initialCollegeRemarks,
        confirmationCheck: form.getValues().confirmationCheck || false
      });
    } else if (error) {
      toast.error('Failed to load student data.');
    }
  }, [enquiryData, error, semWiseFeesData, semWiseFeeError, form, enquiry_id, otherFeesData]);

  const otherFeesTotals = useMemo(() => {
    let totalOriginal = 0;
    let totalFinal = 0;
    let totalDeposited = 0;

    if (otherFeesData) {
      totalOriginal = otherFeesData.reduce((sum: any, fee: any) => sum + (fee.fee ?? 0), 0);
    }

    (otherFeesWatched ?? []).forEach((fee) => {
      totalFinal += fee?.finalFee ?? 0;
      totalDeposited += fee?.feesDepositedTOA ?? 0;
    });

    const totalDue = totalFinal - totalDeposited;

    return {
      totalOriginal,
      totalFinal,
      totalDeposited,
      totalDue
    };
  }, [otherFeesWatched, otherFeesData]);

  const updateFormWithNewData = (newEnquiryData: any) => {
    if (!newEnquiryData) return;

    const feeDataSource = newEnquiryData.studentFee || newEnquiryData.studentFeeDraft;
    if (!feeDataSource) return;

    let initialSemFees = [];
    let initialOtherFees = [];

    const baseSem1Fee = semWiseFeesData[0];

    const existingSem1FeeDataInOther = feeDataSource.otherFees?.find(
      (fee: any) => fee.type === FeeType.SEM1FEE
    );
    const existingSem1FeeDataInSemWise = feeDataSource.semWiseFees?.[0];

    const sem1FeeObject = {
      type: FeeType.SEM1FEE,
      finalFee:
        existingSem1FeeDataInOther?.finalFee ??
        existingSem1FeeDataInSemWise?.finalFee ??
        baseSem1Fee ??
        undefined,
      amount: baseSem1Fee,
      feesDepositedTOA: existingSem1FeeDataInOther?.feesDepositedTOA ?? undefined
    };

    let initialCounsellors = newEnquiryData.counsellor ?? [];
    let initialTelecallers = newEnquiryData.telecaller ?? [];
    const initialCollegeRemarks = newEnquiryData?.remarks;

    initialOtherFees = Object.values(FeeType)
      .filter((ft) => ft !== FeeType.SEM1FEE)
      .map((feeType) => {
        const baseFeeInfo = otherFeesData?.find((item: any) => item.type === feeType);
        const existingFee = feeDataSource.otherFees?.find((fee: any) => fee.type === feeType);

        return {
          type: feeType,
          finalFee: existingFee?.finalFee ?? baseFeeInfo?.fee ?? undefined,
          feesDepositedTOA: existingFee?.feesDepositedTOA ?? undefined
        };
      });

    initialOtherFees.unshift(sem1FeeObject as any);

    const courseSemFeeStructure = semWiseFeesData || [];
    const existingSemFees = feeDataSource?.semWiseFees || [];

    initialSemFees = courseSemFeeStructure.map((baseFeeAmount: any, index: any) => {
      const existingData = existingSemFees[index];
      return {
        finalFee: existingData?.finalFee ?? baseFeeAmount
      };
    });

    const existingDateString = feeDataSource?.feesClearanceDate;
    let initialFeesClearanceDate = null;

    if (existingDateString) {
      initialFeesClearanceDate = existingDateString;
    } else {
      initialFeesClearanceDate = format(new Date(), 'dd/MM/yyyy');
    }

    // Reset form with new values and make sure it's pristine
    form.reset(
      {
        enquiryId: enquiry_id,
        otherFees: initialOtherFees,
        semWiseFees: initialSemFees,
        feesClearanceDate: initialFeesClearanceDate,
        counsellor: initialCounsellors,
        telecaller: initialTelecallers,
        remarks: initialCollegeRemarks,
        confirmationCheck: form.getValues().confirmationCheck,
        otpTarget: form.getValues().otpTarget,
        otpVerificationEmail: form.getValues().otpVerificationEmail
      },
      {
        keepDirty: false
      }
    );
  };

  const createDraftMutation = useMutation({
    mutationFn: createStudentFeesDraft,
    onSuccess: (data) => {
      toast.success('Draft saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });

      // Force form to be pristine after save
      form.reset(form.getValues(), {
        keepValues: true,
        keepDirty: false
      });

      // Optionally, force a refetch and update form with new data
      getEnquiry(enquiry_id).then((newData) => {
        updateFormWithNewData(newData);
      });
    },
    onError: (error) => {
      const errorMsg =
        (error as any)?.response?.data?.message || (error as Error)?.message || 'Unknown error';
      toast.error(`Failed to save draft: ${errorMsg}`);
    },
    onSettled: () => {
      setIsSavingDraft(false);
    }
  });

  const updateDraftMutation = useMutation({
    mutationFn: updateStudentFeesDraft,
    onSuccess: (data) => {
      toast.success('Draft updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });

      // Force form to be pristine after save
      form.reset(form.getValues(), {
        keepValues: true,
        keepDirty: false
      });

      // Optionally, force a refetch and update form with new data
      getEnquiry(enquiry_id).then((newData) => {
        updateFormWithNewData(newData);
      });
    },
    onError: (error) => {
      const errorMsg =
        (error as any)?.response?.data?.message || (error as Error)?.message || 'Unknown error';
      toast.error(`Failed to update draft: ${errorMsg}`);
    },
    onSettled: () => {
      setIsSavingDraft(false);
    }
  });

  const createFinalFeeMutation = useMutation({
    mutationFn: createStudentFees,
    onSuccess: async (data, variables) => {
      toast.success('Fee record created successfully!');

      await queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });

      try {
        if (!enquiry_id) {
          toast.error('Could not update enquiry status: Missing ID.');
          return;
        }

        const statusPayload = {
          id: enquiry_id,
          newStatus: ApplicationStatus.STEP_3
        };

        await updateEnquiryStatus(statusPayload);

        toast.success('Enquiry status updated to Step 3.');

        await queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });

        router.push(SITE_MAP.ADMISSIONS.FORM_STAGE_3(enquiry_id));
      } catch (statusError) {
        const errorMsg =
          (statusError as any)?.response?.data?.message ||
          (statusError as Error)?.message ||
          'Unknown error';
        toast.error(`Fee record created, but failed to update enquiry status: ${errorMsg}`);
      }
    }
  });

  async function handleSaveDraft() {
    setIsSavingDraft(true);
    form.clearErrors();

    const currentValues = form.getValues();
    const existingDraftId = enquiryData?.studentFeeDraft?._id;

    const isCustomValid = validateCustomFeeLogic(
      currentValues,
      otherFeesData,
      semWiseFeesData,
      form.setError,
      form.clearErrors
    );

    if (!isCustomValid) {
      toast.error('Fee validation failed. Please check highlighted fields.');
      setIsSavingDraft(false);
      return;
    }

    const validationResult = frontendFeesDraftValidationSchema.safeParse(currentValues);

    if (!validationResult.success) {
      toast.error('Validation failed. Please check the fields.');
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path.join('.') as keyof IFeesRequestSchema;
          form.setError(fieldName, { type: 'manual', message: err.message });
        }
      });
      setIsSavingDraft(false);
      return;
    }

    const validatedDataForCleaning = validationResult.data;
    const cleanedData = cleanDataForDraft(validatedDataForCleaning);

    try {
      if (draftExists && draftId) {
        const finalPayload = {
          id: draftId,
          enquiryId: enquiry_id,
          ...cleanedData
        };
        await updateDraftMutation.mutateAsync(finalPayload);
      } else {
        const finalPayload = {
          enquiryId: cleanedData.enquiryId || enquiry_id,
          ...cleanedData
        };
        delete finalPayload.id;
        await createDraftMutation.mutateAsync(finalPayload);
      }
    } catch (error) {}
  }

  async function onSubmit() {
    setIsSubmittingFinal(true);
    form.clearErrors();
    const values = form.getValues();

    const isCustomValid = validateCustomFeeLogic(
      values,
      otherFeesData, // Pass base data for original fees
      semWiseFeesData, // Pass base data for original fees
      form.setError,
      form.clearErrors
    );

    if (!isCustomValid) {
      toast.error(
        'Fee validation failed. Please check highlighted fields (e.g., Final Fee vs Original, Deposit vs Final Fee).'
      );
      setIsSubmittingFinal(false);
      return; // Stop if custom validation fails
    }

    const isUpdate = finalFeeExists;
    const recordId = finalFeeId;

    if (isUpdate && recordId) {
      const validationResult = feesRequestSchema.safeParse(values);

      if (!validationResult.success) {
        toast.error('Validation failed. Please check the fields.', {});

        validationResult.error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path.join('.') as keyof IFeesRequestSchema;
            form.setError(fieldName, { type: 'manual', message: err.message });
          }
        });

        return;
      }

      const validatedDataForCleaning = validationResult.data;
      const cleanedData = cleanDataForDraft(validatedDataForCleaning);

      const finalPayLoad: any = {
        id: recordId,
        ...cleanedData
      };

      updateStudentFees(finalPayLoad);
    } else {
      const validationResult = finalFeesCreateSchema.safeParse(values);

      if (!validationResult.success) {
        toast.error('Validation failed. Please check the fields.', {});

        validationResult.error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path.join('.') as keyof IFeesRequestSchema;
            form.setError(fieldName, { type: 'manual', message: err.message });
          }
        });
        return;
      }

      const validatedDataForCleaning = validationResult.data;
      const cleanedData = cleanDataForDraft(validatedDataForCleaning);

      const finalPayLoad: any = {
        enquiryId: enquiry_id,
        ...cleanedData
      };

      await createFinalFeeMutation.mutateAsync(finalPayLoad);
    }
  }

  if (isLoadingOtherFees || isLoadingEnquiry || isLoadingSemFees) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        className="pt-8 mr-[25px] space-y-8 flex flex-col w-full"
      >
        <ShowStudentData data={enquiryData} />

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="other-fees">
          <AccordionItem value="other-fees">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold">Fees Category</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-white rounded-[10px]">
              <div className="w-2/3">
                <div className="grid bg-[#F7F7F7] text-[#4E4E4E] p-5 grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mb-2 rounded-[5px] text-[16px]">
                  <div>Fees Details</div>
                  <div className="text-right">Schedule</div>
                  <div className="text-right">Fees</div>
                  <div className="text-right">Final Fees</div>
                  <div className="text-right">Applicable Discount</div>
                  <div className="text-right">Fees Deposited</div>
                  <div className="text-right">Fees due in 1st Sem</div>
                </div>

                {otherFeesFields.map((field, index) => {
                  const feeType = form.getValues(`otherFees.${index}.type`);
                  const originalFeeData = otherFeesData?.find((fee: any) =>
                    fee.type === FeeType.SEM1FEE
                      ? fee.type === feeType
                      : fee.type === displayFeeMapper(feeType)
                  );
                  const totalFee = originalFeeData?.amount;

                  const finalFee = otherFeesWatched?.[index]?.finalFee;
                  const feesDeposited = otherFeesWatched?.[index]?.feesDepositedTOA;
                  const discountValue = calculateDiscountPercentage(totalFee, finalFee);
                  const discountDisplay =
                    typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                  const remainingFee = (finalFee ?? 0) - (feesDeposited ?? 0);

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-8 items-start px-2 py-1 "
                    >
                      <div className="pt-2 text-sm">{displayFeeMapper(feeType)}</div>
                      <div className="pt-2 text-sm text-right">{scheduleFeeMapper(feeType)}</div>
                      <div className="pt-2 text-sm text-right">{formatCurrency(totalFee)}</div>

                      <FormField
                        control={form.control}
                        name={`otherFees.${index}.finalFee`}
                        render={({ field: formField }) => (
                          <FormItem className="flex flex-col justify-end">
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Enter fees"
                                {...formField}
                                className="text-right px-2 h-11 text-sm"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  formField.onChange(value === '' ? undefined : Number(value));
                                }}
                                value={formField.value ?? ''}
                              />
                            </FormControl>
                            <div className="h-3">
                              <FormMessage className="text-xs mt-0" /> {/* Smaller message */}
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center text-sm h-11 border border-input rounded-md px-2">
                        <p className="ml-auto">{discountDisplay}</p>
                      </div>

                      <FormField
                        control={form.control}
                        name={`otherFees.${index}.feesDepositedTOA`}
                        render={({ field: formField }) => (
                          <FormItem className="flex flex-col justify-end">
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Enter deposit"
                                {...formField}
                                className="text-right px-2 h-11 text-sm"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  formField.onChange(value === '' ? undefined : Number(value));
                                }}
                                value={formField.value ?? ''}
                              />
                            </FormControl>
                            <div className="h-3">
                              <FormMessage className="text-xs mt-0" /> {/* Smaller message */}
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-end text-sm h-11 border border-input rounded-md px-2">
                        {formatCurrency(remainingFee)}
                      </div>
                    </div>
                  );
                })}

                <div className="grid bg-[#F7F7F7] text-[#4E4E4E] p-5 rounded-[5px] grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mt-2  border-t ">
                  <div className="text-sm">Total Fees</div>
                  <div>{/* Empty cell for Schedule */}</div>
                  <div className="text-sm text-right">
                    {formatCurrency(otherFeesTotals.totalOriginal)}
                  </div>
                  <div className="text-sm text-right pr-2">
                    {formatCurrency(otherFeesTotals.totalFinal)}
                  </div>
                  <div>{/* Empty cell for Discount */}</div>
                  <div className="text-sm text-right pr-2">
                    {formatCurrency(otherFeesTotals.totalDeposited)}
                  </div>
                  <div className="text-sm text-right pr-2">
                    {formatCurrency(otherFeesTotals.totalDue)}
                  </div>
                </div>

                <div className="mt-4 px-2 text-xs text-gray-600 space-y-1">
                  <p>Book Bank - *50% adjustable at the end of final semester</p>
                  <p>Book Bank - *Applicable only in BBA, MBA, BAJMC, MAJMC & BCom (Hons)</p>
                  <p>
                    Exam Fees - To be given at the time of exact form submission as per LU/AKTU
                    Norms
                  </p>
                </div>

                <div className="mt-6 px-2">
                  <DatePicker
                    control={form.control}
                    name="feesClearanceDate"
                    label="Fees Clearance Date"
                    disabled={isViewable}
                    placeholder="Pick a Date"
                    showYearMonthDropdowns={true}
                    formItemClassName="w-[300px]"
                    labelClassName="font-inter font-normal text-[12px] text-[#666666]"
                    calendarProps={{
                      disabled: (date) => {
                        const today = new Date();
                        return date <= new Date(today.setHours(0, 0, 0, 0));
                      }
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="sem-fees">
          <AccordionItem value="sem-fees">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold"> All Semester Details</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-white rounded-[10px]">
              <div className="w-max">
                <div className="space-y-4">
                  <div className="grid bg-[#F7F7F7] rounded-[5px] text-[#4E4E4E] p-5 grid-cols-[1fr_0.5fr_1fr_1fr] gap-x-3 gap-y-2 mb-2pb-1 border-b">
                    <div className="font-medium text-sm text-gray-600">Semester</div>
                    <div className="font-medium text-sm text-gray-600 text-right">Fees</div>
                    <div className="font-medium text-sm text-gray-600 text-center">Final Fees</div>
                    <div className="font-medium text-sm text-gray-600 text-center">
                      Applicable Discount
                    </div>
                  </div>

                  {semFields.map((field, index) => {
                    console.log('Sem Fields', field, index);
                    const originalFeeAmount = semWiseFeesData[index];
                    const finalFee = semWiseFeesWatched?.[index]?.finalFee;
                    const discountValue = calculateDiscountPercentage(originalFeeAmount, finalFee);
                    const discountDisplay =
                      typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                    return (
                      <div
                        key={field.id}
                        className="grid w-max h-max grid-cols-[1fr_0.5fr_1fr_1fr] gap-x-3 gap-y-2 items-start px-2 py-1"
                      >
                        <div className="pt-2 text-sm">Semester {index + 1}</div>
                        <div className="pt-2 text-sm text-right">
                          {formatCurrency(originalFeeAmount)}
                        </div>

                        <FormField
                          control={form.control}
                          name={`semWiseFees.${index}.finalFee`}
                          render={({ field: formField }) => (
                            <FormItem className="flex flex-col justify-end">
                              <FormControl>
                                <Input
                                  className="text-right px-2 h-12 text-sm"
                                  type="number"
                                  min="0"
                                  placeholder="Enter fees"
                                  {...formField} // Use formField here
                                  onChange={(e) =>
                                    formField.onChange(
                                      e.target.value === '' ? undefined : Number(e.target.value)
                                    )
                                  }
                                  value={formField.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage className="text-xs mt-1" />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center text-sm h-11 border border-input rounded-md px-2">
                          <p className="ml-auto">{discountDisplay}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          defaultValue="college-details"
        >
          <AccordionItem value="college-details" className="border-b-0">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold"> To be filled by College</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>

            <AccordionContent className="p-6 bg-white rounded-[10px]">
              <div className="w-2/3 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-1">
                <MultiSelectPopoverCheckbox
                  form={form}
                  name="counsellor"
                  disabled={isViewable}
                  label="Counsellor’s Name"
                  options={counsellors}
                  placeholder="Select Counsellor's Name"
                  className="col-span-1"
                />
                <MultiSelectPopoverCheckbox
                  form={form}
                  name="telecaller"
                  disabled={isViewable}
                  label="Telecaller’s Name"
                  options={telecallers}
                  placeholder="Select Telecaller's Name"
                  className="col-span-1"
                />
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className="font-inter font-normal text-sm text-gray-600">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional"
                          className="resize-none text-sm "
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4"
          defaultValue="college-info"
        >
          <AccordionItem value="confirmation" className="border-b-0">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold"> Confirmation</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>
            <AccordionContent className="p-6 space-y-4 bg-white text-gray-600 rounded-[10px]">
              <FormField
                control={form.control}
                name="otpTarget"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium block">
                      Select Contact for OTP Verification
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value ?? ''}
                        className="flex flex-col sm:flex-row gap-y-2 gap-x-6 pt-1"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="email" id="otp-email" disabled={!studentEmail} />
                          </FormControl>
                          <FormLabel
                            htmlFor="otp-email"
                            className={`font-normal text-sm cursor-pointer ${!studentEmail ? 'text-gray-400 cursor-not-allowed' : ''}`}
                          >
                            Email: {studentEmail || '(Not Available)'}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="phone" id="otp-phone" disabled={!studentPhone} />
                          </FormControl>
                          <FormLabel
                            htmlFor="otp-phone"
                            className={`font-normal text-sm cursor-pointer ${!studentPhone ? 'text-gray-400 cursor-not-allowed' : ''}`}
                          >
                            Phone: {studentPhone || '(Not Available)'}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs pt-1" />
                  </FormItem>
                )}
              />

              <div className="flex gap-8 items-stretch">
                <div>
                  <FormLabel htmlFor="otp-display" className="text-sm mb-3 text-gray-600">
                    Selected Contact
                  </FormLabel>
                  <Input
                    id="otp-display"
                    readOnly
                    value={otpDisplayValue}
                    placeholder="Select Email or Phone above"
                    className="h-9 text-sm cursor-not-allowed"
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => {}}
                  disabled={isOtpSending || !selectedOtpTarget}
                  className="h-9 text-sm mt-auto"
                >
                  {isOtpSending ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {!isViewable && (
          <ConfirmationCheckBox
            form={form}
            name="confirmationCheck"
            label="All the Fees Deposited is Non Refundable/Non Transferable. Examination fees will be charged extra based on LU/AKTU norms."
            id="checkbox-for-step2"
            className="flex flex-row items-start bg-white rounded-md p-4"
          />
        )}

        {!isViewable && (
          <EnquiryFormFooter
            form={form}
            saveDraft={handleSaveDraft}
            onSubmit={onSubmit}
            isSavingDraft={isSavingDraft}
            confirmationChecked={!!confirmationChecked}
            draftExists={draftExists}
          />
        )}
      </form>
    </Form>
  );
};
