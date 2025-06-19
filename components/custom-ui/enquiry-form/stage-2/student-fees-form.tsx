'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  feesRequestSchema,
  finalFeesCreateSchema,
  frontendFeesDraftValidationSchema,
  IFeesRequestSchema
} from './studentFeesSchema';

import Loading from '@/app/loading';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { queryClient } from '@/lib/queryClient';
import { useAdmissionRedirect } from '@/lib/useAdmissionRedirect';
import { AdmissionReference, ApplicationStatus, FeeType } from '@/types/enum';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { format, isValid, parse } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ConfirmationCheckBox from '../stage-1/confirmation-check-box';
import { getCounsellors, getEnquiry, getTeleCallers, updateEnquiryDraft } from '../stage-1/enquiry-form-api';
import EnquiryFormFooter from '../stage-1/enquiry-form-footer-section';
import FilledByCollegeSection from '../stage-1/filled-by-college-section';
import ShowStudentData from './data-show';
import {
  createStudentFees,
  getFeesByCourseName,
  getOtherFees,
  updateStudentFees
} from './helpers/apirequests';
import { displayFeeMapper, scheduleFeeMapper } from './helpers/mappers';
import { cleanDataForDraft } from './helpers/refine-data';
import { validateCustomFeeLogic } from './helpers/validateFees';
import { createStudentFeesDraft, updateStudentFeesDraft } from './student-fees-api';


export const calculateRelevantOtherFees = (otherFees: any[]) => {
  return otherFees.reduce((sum, fee, index) => {
    // Skip SEM1FEE (index 0) and only include fees that apply to all semesters
    if (index === 0 || fee.type === FeeType.SEM1FEE) return sum;

    
    if (scheduleFeeMapper(fee.type) == 'Yearly') {
      const finalFee = Number(fee.finalFee) || 0;
      console.log("in ", finalFee + sum)
      return sum + (finalFee);
    }
    console.log("int" , sum)
    return sum;

  }, 0);
};


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
      references: [],
      enquiryRemark: enquiryData?.enquiryRemark || '',
      feeDetailsRemark: '',
      confirmationCheck: false,
      isFeeApplicable: true,
      otpTarget: undefined,
      otpVerificationEmail: null,
      srAmount: 0
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

      let initialReferences: AdmissionReference[] = enquiryData.references ?? [];

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
      if (otherFeesData.at(0).type === FeeType.SEM1FEE) {
      } else {
        otherFeesData.unshift(sem1FeeObject);
      }

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
        references: initialReferences,
        counsellor: initialCounsellors,
        telecaller: initialTelecallers,
        isFeeApplicable: enquiryData.isFeeApplicable,
        enquiryRemark: enquiryData?.enquiryRemark,
        feeDetailsRemark: enquiryData.feeDetailsRemark || '',
        confirmationCheck: form.getValues().confirmationCheck || false,
        srAmount: enquiryData.srAmount
      });
    } else if (error) {
      toast.error('Failed to load student data.');
    }
  }, [enquiryData, error, semWiseFeesData, semWiseFeeError, form, enquiry_id, otherFeesData]);

  //this state is specially created because we are having requirement for user to change few fees dynamically so we can add that in total and have sync properly

  const otherFeesTotals = useMemo(() => {
    let totalOriginal = 0;
    let totalFinal = 0;
    let totalDeposited = 0;

    if (otherFeesData) {
      const baseOriginal = otherFeesData.reduce((sum, fee) => {
        const isExcluded =
          fee.type === displayFeeMapper(FeeType.TRANSPORT) ||
          fee.type === displayFeeMapper(FeeType.HOSTELYEARLY);

        if (isExcluded) {
          return sum;
        }

        return sum + (fee.amount || 0);
      }, 0);

      totalOriginal = baseOriginal;

      const fee6 = Number(form.getValues('otherFees.6.finalFee')) || 0;
      const fee7 = Number(form.getValues('otherFees.7.finalFee')) || 0;

      totalOriginal += fee6 + fee7;
    } else {
    }

    (otherFeesWatched ?? []).forEach((fee, index) => {
      const finalFee = Number(fee?.finalFee) || 0;
      const deposited = Number(fee?.feesDepositedTOA) || 0;

      totalFinal += finalFee;
      totalDeposited += deposited;
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
    let initialReferences = newEnquiryData.references ?? [];
    const initialCollegeRemarks = newEnquiryData?.feeDetailsRemark;

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
        references: initialReferences,
        counsellor: initialCounsellors,
        telecaller: initialTelecallers,
        feeDetailsRemark: newEnquiryData.feeDetailsRemark,
        enquiryRemark: enquiryData.enquiryRemark,
        confirmationCheck: form.getValues().confirmationCheck,
        otpTarget: form.getValues().otpTarget,
        isFeeApplicable: form.getValues().isFeeApplicable,
        otpVerificationEmail: form.getValues().otpVerificationEmail,
        srAmount: newEnquiryData.srAmount || form.getValues().srAmount
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
      // toast.success('Draft updated successfully!');
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
      return false;
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
      return false;
    }

    const validatedDataForCleaning = validationResult.data;
    const cleanedData = {
      ...cleanDataForDraft(validatedDataForCleaning),
      srAmount: validatedDataForCleaning.srAmount ?? 0,
      feeDetailsRemark: validatedDataForCleaning.feeDetailsRemark ?? ''
    };
    try {
      if (draftExists && draftId) {
        const finalPayload = {
          id: draftId,
          enquiryId: enquiry_id,
          ...cleanedData
        };
        await updateDraftMutation.mutateAsync(finalPayload);
        toast.success('Draft Updated Successfully');
      } else {
        const finalPayload = {
          enquiryId: cleanedData.enquiryId || enquiry_id,
          ...cleanedData
        };
        delete finalPayload.id;
        await createDraftMutation.mutateAsync(finalPayload);
        toast.success('Draft Created Successfully');
      }

      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSavingDraft(false);
    }
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

  const sourceField = 'otherFees.0.finalFee';
  const sourceValue = form.watch(sourceField);

  useEffect(() => {
    form.setValue('semWiseFees.0.finalFee', sourceValue);
  }, [sourceValue]);

  const handleOtherFeesChange = (value: number) => {
    form.setValue(sourceField, value);
  };

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
              <div className="w-full xl:w-2/3 space-y-1">
                <div className="grid bg-[#5B31D1]/10 backdrop-blur-lg text-[#5B31D1] font-semibold px-3 py-2 grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_0.5fr_0.5fr_0.5fr_0.8fr_0.8fr_0.5fr] gap-x-2 sm:gap-x-3 gap-y-2 rounded-[5px] text-sm sm:text-base">
                  <div className="xs:col-span-2 sm:col-span-4 md:col-span-1">Fees Details</div>
                  <div className="text-left">Schedule</div>
                  <div className="text-left">Fees</div>
                  <div className="text-center">Discount</div>
                  <div className="text-right">Final Fees</div>
                  <div className="text-right">Fees Deposit</div>
                  <div className="text-right">Fees Due</div>
                </div>

                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden ">
                  {otherFeesFields.map((field, index) => {
                    const feeType = form.getValues(`otherFees.${index}.type`);

                    const originalFeeData = otherFeesData?.find((fee: any) =>
                      fee.type === feeType
                    );

                    const feeTypeArray = ["HOSTELMAINTENANCE", "HOSTELCAUTIONMONEY", "HOSTELYEARLY", "TRANSPORT"]


                    let totalFee;
                    if (feeTypeArray.includes(feeType)) {
                      totalFee = form.getValues(`otherFees.${index}.finalFee`);
                    } else {
                      totalFee = originalFeeData?.amount;
                    }

                    const finalFee = otherFeesWatched?.[index]?.finalFee;

                    const feesDeposited = otherFeesWatched?.[index]?.feesDepositedTOA;

                    let discountValue;
                    if (feeTypeArray.includes(feeType)) {
                      discountValue = '-';
                    } else {
                      discountValue =
                        finalFee !== undefined
                          ? totalFee - Number(finalFee)
                          : '-';
                    }

                    const discountDisplay =
                      typeof discountValue === 'number' ? `₹${discountValue}` : discountValue;
                    const remainingFee = (finalFee ?? 0) - (feesDeposited ?? 0);

                    if (
                      (
                        feeType == FeeType.BOOKBANK && totalFee == 0
                      )
                    ) {
                      return;
                    }

                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_0.5fr_0.5fr_0.5fr_0.8fr_0.8fr_0.5fr] gap-2 sm:gap-3 md:gap-4 items-center px-3 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <div className="xs:col-span-2 text-left sm:col-span-4 md:col-span-1 text-sm font-medium text-gray-800 ">
                          {displayFeeMapper(feeType)}
                        </div>

                        <div className="text-sm text-left text-gray-600">
                          {scheduleFeeMapper(feeType)}
                        </div>

                        <div className="text-sm text-left text-gray-600">
                          {formatCurrency(totalFee)}
                        </div>
                        <div className="text-sm text-center text-gray-600">{discountDisplay}</div>

                        <div>
                          <FormField
                            control={form.control}
                            name={`otherFees.${index}.finalFee`}
                            defaultValue={0}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter fees"
                                    {...formField}
                                    className="text-right px-3 h-8 text-sm border-gray-300 focus:ring-1 focus:ring-[#5B31D1]"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/^[0-9]*$/.test(value)) {
                                        if (totalFee - Number(value) < 0 &&
                                          !feeTypeArray.includes(feeType))
                                          return;

                                        formField.onChange(value === '' ? null : Number(value));
                                      }
                                    }}
                                    onFocus={(e) => {
                                      e.target.placeholder = '';
                                    }}
                                    onBlur={(e) => {
                                      if (!e.target.value) {
                                        e.target.placeholder = 'Enter fees';
                                      }
                                    }}
                                    value={formField.value ?? 0}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div>
                          <FormField
                            control={form.control}
                            name={`otherFees.${index}.feesDepositedTOA`}
                            defaultValue={0}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="Enter fees"
                                    {...formField}
                                    className="text-right px-3 h-8 text-sm border-gray-300 focus:ring-1 focus:ring-[#5B31D1]"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/^[0-9]*$/.test(value)) {
                                        if (Number(value) > Number(finalFee)) return;
                                        formField.onChange(value === '' ? null : Number(value));
                                      }
                                    }}
                                    onFocus={(e) => {
                                      e.target.placeholder = '';
                                    }}
                                    onBlur={(e) => {
                                      if (!e.target.value) {
                                        e.target.placeholder = 'Enter fees';
                                      }
                                    }}
                                    value={formField.value ?? 0}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div
                          className={clsx(
                            'text-sm text-right font-medium',
                            remainingFee < 0 ? 'text-red-500' : 'text-gray-800'
                          )}
                        >
                          {formatCurrency(remainingFee)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid bg-[#5B31D1]/10 backdrop-blur-lg text-[#5B31D1] font-semibold px-3 py-2  rounded-[5px] grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[.8fr_0.5fr_0.5fr_0.5fr_0.8fr_0.8fr_0.5fr]  gap-x-2 sm:gap-x-3 gap-y-2 text-sm sm:text-base">
                  <div className="xs:col-span-2 sm:col-span-4 md:col-span-1">Total Fees</div>
                  <div></div>
                  {/* <div className="text-left">{formatCurrency(otherFeesTotals.totalOriginal)}</div> */}
                  <div className="text-left">-</div>
                  <div className="text-center">-</div>

                  {/* <div className="text-center">
                    {calculateDiscountPercentage(
                      otherFeesTotals.totalOriginal,
                      otherFeesTotals.totalFinal
                    ) + '%'}
                  </div> */}
                  <div className="text-right">{formatCurrency(otherFeesTotals.totalFinal)}</div>
                  <div className="text-right">{formatCurrency(otherFeesTotals.totalDeposited)}</div>
                  <div className="text-right">{formatCurrency(otherFeesTotals.totalDue)}</div>
                </div>

                <div className="mt-3 p-3 text-xs text-gray-600 space-y-1 bg-gray-50 rounded-lg">
                  <p>Book Bank - *50% adjustable at the end of final semester</p>
                  <p>Book Bank - *Applicable only in BBA, MBA, BAJMC, MAJMC & BCom (Hons)</p>
                  <p>
                    Exam Fees - To be given at the time of exact form submission as per LU/AKTU
                    Norms
                  </p>
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="isFeeApplicable"
                    render={({ field }) => (
                      <>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                          Fees Applicable <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormItem className="h-[36px] z-50 w-full sm:w-[300px] rounded-md border">
                          <Select
                            onValueChange={(value) => field.onChange(value === 'true')}
                            value={field.value ? 'true' : 'false'}
                            disabled={isViewable}
                          >
                            <FormControl className="w-full">
                              <SelectTrigger className="h-[36px]">
                                <SelectValue placeholder="Select fee type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="">
                              <SelectItem value="false">Zero Fees</SelectItem>
                              <SelectItem value="true">Non-Zero Fees</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      </>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <DatePicker
                    control={form.control}
                    name="feesClearanceDate"
                    label="Fees Clearance Date"
                    disabled={isViewable}
                    placeholder="Pick a Date"
                    showYearMonthDropdowns={true}
                    formItemClassName="w-full sm:w-[300px]"
                    labelClassName="font-normal text-xs text-gray-600"
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
              <div className="w-full lg:w-max">
                <div className="space-y-3 sm:space-y-1">
                  <div className="grid rounded-[5px] bg-[#5B31D1]/10 backdrop-blur-lg text-[#5B31D1] font-semibold text-sm sm:text-base px-3 py-2 grid-cols-1 xs:grid-cols-3 sm:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.8fr_1fr] border-b border-gray-200">
                    <div className="text-left">Semester</div>
                    <div className="text-center">Fee Details</div>
                    <div className="text-center">Fees</div>
                    <div className="text-center">Discount</div>
                    <div className="text-right">Final Tuition Fees</div>
                    <div className="text-right">Total Semester Fees</div>
                  </div>

                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
                    {semFields.map((field, index) => {

                      

                      const originalFeeAmount = semWiseFeesData[index];
                      const finalFee = semWiseFeesWatched?.[index]?.finalFee;
                      const discountValue =
                        finalFee != undefined
                          ? originalFeeAmount - finalFee
                          : '-';
                      const discountDisplay =
                        typeof discountValue === 'number' ? `₹${discountValue}` : discountValue;

                      // Calculate relevant other fees (excluding SEM1FEE)
                      const bookFees =  otherFeesWatched?.find((f) => f.type === FeeType.BOOKBANK)?.finalFee ?? 0;
                      
                      let totalSemFee = Number(finalFee ?? 0) + bookFees;

                      if (index == 0) {
                        totalSemFee = otherFeesTotals.totalFinal
                      }else if(index % 2 == 0){
                        totalSemFee += calculateRelevantOtherFees(otherFeesWatched || []);
                      }

                      return (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.8fr_1fr] gap-x-2 sm:gap-x-3 gap-y-2 items-center px-3 py-1 hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm font-medium text-gray-800">
                            Semester {index + 1}
                          </div>

                          <div className="text-sm text-center text-gray-600">Tuition Fee</div>

                          <div className="text-sm text-center text-gray-600">
                            {formatCurrency(originalFeeAmount)}
                          </div>

                          <div className="text-sm text-center text-gray-600">{discountDisplay}</div>

                          <FormField
                            control={form.control}
                            name={`semWiseFees.${index}.finalFee`}
                            render={({ field: formField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="text"
                                    defaultValue={0}
                                    placeholder="Enter fees"
                                    {...formField}
                                    className="text-right px-3 h-8 text-sm border-gray-300 focus:ring-1 focus:ring-[#5B31D1]"
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (/^[0-9]*$/.test(value)) {
                                        if (Number(value) > Number(originalFeeAmount)) return;
                                        formField.onChange(value === '' ? null : Number(value));
                                      }
                                    }}
                                    readOnly={index === 0}
                                    value={formField.value ?? 0}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs mt-1" />
                              </FormItem>
                            )}
                          />
                          <div className="text-sm text-right text-gray-600">
                            {formatCurrency(totalSemFee)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <FilledByCollegeSection
          commonFieldClass=""
          commonFormItemClass=""
          form={form}
          isViewable={isViewable}
          currentStep='feeDetails'
          remarkLabel='Fee Details Remark'
        />

        {/* {!isViewable && (
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
                              <RadioGroupItem
                                value="email"
                                id="otp-email"
                                disabled={!studentEmail}
                              />
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
                              <RadioGroupItem
                                value="phone"
                                id="otp-phone"
                                disabled={!studentPhone}
                              />
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
        )} */}

        {!isViewable && (
          <ConfirmationCheckBox
            form={form}
            name="confirmationCheck"
            label="All the Fees Deposited is Non Refundable/Non Transferable. Examination fees will be charged extra based on LU/AKTU norms."
            id="checkbox-for-step2"
            className="flex flex-row items-start bg-white rounded-md p-4 mt-0"
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
