'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { getFeesByCourseName, getOtherFees } from '../stage-2/helpers/apirequests';
import {
  feesRequestSchema,
  finalFeesUpdateSchema,
  IFeesRequestSchema
} from '../stage-2/studentFeesSchema';
import { validateCustomFeeLogic } from '../stage-2/helpers/validateFees';
import { cleanDataForDraft } from '../stage-2/helpers/refine-data';
import { calculateDiscountPercentage, formatCurrency } from '../stage-2/student-fees-form';
import { displayFeeMapper, scheduleFeeMapper } from '../stage-2/helpers/mappers';
import { AdmissionReference, ApplicationStatus, FeeType, TransactionTypes } from '@/types/enum';
import ShowStudentData from '../stage-2/data-show';
import FilledByCollegeSection from '../stage-1/filled-by-college-section';
import ConfirmationOTPSection from './confirmation-otp-section';
import EnquiryFormFooter from './enquiry-form-footer';
import { getEnquiry } from '../stage-1/enquiry-form-api';
import { approveEnquiry, createEnquiryStep4, updateEnquiryStep4 } from './helpers/apirequests';
import { useAdmissionRedirect } from '@/lib/useAdmissionRedirect';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import ConfirmationCheckBox from '../stage-1/confirmation-check-box';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getTransactionTypeLabel } from '@/lib/enumDisplayMapper';
import { Loader } from 'lucide-react';
import Loading from '@/app/loading';
import { clsx } from 'clsx';
import { Checkbox } from '@/components/ui/checkbox';
import { DownloadStep4 } from './step4-pdf';

const FinanceOfficeForm = () => {
  const params = useParams();
  const enquiry_id = params.id as string;
  const [dataUpdated, setDataUpdated] = useState(true);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const transactionTypeRef = useRef('');
  const [transactionRemarks, setTransactionRemarks] = useState(''); // don't confuse yourself with enquiry remarks

  const router = useRouter();


  const {
    isChecking: isRedirectChecking,
    isCheckError: isRedirectError,
    isViewable
  } = useAdmissionRedirect({
    id: enquiry_id,
    currentStage: ApplicationStatus.STEP_4
  });
  // Queries

  const {
    data: enquiryData,
    error,
    isFetched,
    isLoading: isLoadingEnquiry
  } = useQuery<any>({
    queryKey: ['enquireFormData', enquiry_id, dataUpdated],
    queryFn: () => (enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null')),
    enabled: !!enquiry_id,
    refetchOnWindowFocus: false
  });

  const existingFinalFee = enquiryData?.studentFee;
  const existingFeeDraft = enquiryData?.studentFeeDraft;
  const courseName = enquiryData?.course;

  const { data: otherFeesData, isLoading: isLoadingOtherFees } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: () => getOtherFees(courseName),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!courseName
  });

  // Determine the current status
  const feeStatus: 'none' | 'draft' | 'final' = useMemo(() => {
    if (existingFinalFee) return 'final';
    if (existingFeeDraft) return 'draft';
    return 'none';
  }, [existingFinalFee, existingFeeDraft]);

  const finalFeeExists = feeStatus === 'final';
  const finalFeeId = existingFinalFee?._id;
  const studentEmail = enquiryData?.emailId;
  const studentPhone = enquiryData?.studentPhoneNumber;

  const {
    data: semWiseFeesData,
    error: semWiseFeeError,
    isLoading: isLoadingSemFees
  } = useQuery<any>({
    queryKey: ['courseFees', courseName],
    queryFn: () => getFeesByCourseName(courseName),
    enabled: !!courseName
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
      financeOfficeRemark: enquiryData?.financeOfficeRemark || '',
      registarOfficeRemark: enquiryData?.registarOfficeRemark,
      feeDetailsRemark: enquiryData?.feeDetailsRemark,
      enquiryRemark: enquiryData?.enquiryRemark,
      confirmationCheck: false,
      isFeeApplicable: true,
      otpTarget: undefined,
      otpVerificationEmail: null
    },
    disabled: isViewable
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

      const initialCollegeRemarks: string = enquiryData?.financeOfficeRemark;

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
      console.log("data ", enquiryData)
      form.reset({
        enquiryId: enquiry_id,
        otherFees: initialOtherFees,
        semWiseFees: initialSemFees,
        feesClearanceDate: initialFeesClearanceDate,
        references: enquiryData.references,
        counsellor: initialCounsellors,
        telecaller: initialTelecallers,
        isFeeApplicable: enquiryData.isFeeApplicable,
        financeOfficeRemark: initialCollegeRemarks,
        enquiryRemark: enquiryData.enquiryRemark,
        registarOfficeRemark: enquiryData.registarOfficeRemark,
        feeDetailsRemark: enquiryData.feeDetailsRemark,
        srAmount: enquiryData.srAmount
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

  const createFinalFeeMutation = useMutation({
    mutationFn: createEnquiryStep4,
    onSuccess: () => {
      // toast.success('Fee record created successfully!');
      queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });
    }
  });

  async function saveDraft() {
    const values = form.getValues();

    const isCustomValid = validateCustomFeeLogic(
      values,
      otherFeesData,
      semWiseFeesData,
      form.setError,
      form.clearErrors
    );

    if (!isCustomValid) {
      toast.error('Fee validation failed. Please check highlighted fields');
      setIsSubmittingFinal(false);
      return false;
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

        return false;
      }

      const validatedDataForCleaning = validationResult.data;
      const cleanedData = cleanDataForDraft(validatedDataForCleaning);


      const finalPayLoad: any = {
        id: recordId,
        ...cleanedData,
        financeOfficeRemark: values.financeOfficeRemark
      };

      await updateEnquiryStep4(finalPayLoad);

      toast.success('Fee record updated successfully!');
      return true;
    } else {
      const validationResult = finalFeesUpdateSchema.safeParse(values);

      if (!validationResult.success) {
        toast.error('Validation failed. Please check the fields.', {});

        validationResult.error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const fieldName = err.path.join('.') as keyof IFeesRequestSchema;
            form.setError(fieldName, { type: 'manual', message: err.message });
          }
        });
        return false;
      }

      const validatedDataForCleaning = validationResult.data;
      const cleanedData = cleanDataForDraft(validatedDataForCleaning);

      const finalPayLoad: any = {
        enquiryId: enquiry_id,
        ...cleanedData
      };

      await createFinalFeeMutation.mutateAsync(finalPayLoad);
      toast.success('Fee record created successfully!');
      return true;
      setDataUpdated((prev) => !prev);
    }
  }

  const handleTransactionTypeUpdate = (type: any) => {
    transactionTypeRef.current = type;
    setTransactionType(type);
  };

  const handleRemarksChange = (newRemarks: string) => {
    setTransactionRemarks(newRemarks);
  };

  async function onSubmit(): Promise<boolean> {
    try {
      setIsSubmittingFinal(true);

      if (!transactionTypeRef.current) {
        toast.error('Please select a transaction type');
        return false;
      }

      await approveEnquiry({
        id: enquiry_id,
        transactionType: transactionTypeRef.current,
        transactionRemark: transactionRemarks
      });

      toast.success('Enquiry submitted for final approval');
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsSubmittingFinal(false);
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

      <form className="pt-8 mr-[25px] space-y-8 flex flex-col w-full  relative">
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

                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
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

                      feeType == FeeType.BOOKBANK && totalFee == 0
                    ) {
                      return;
                    }

                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_0.5fr_0.5fr_0.5fr_0.8fr_0.8fr_0.5fr] gap-2 sm:gap-3 md:gap-4 items-center px-3 py-1 hover:bg-gray-50 transition-colors"
                      >
                        <div className="xs:col-span-2 text-left sm:col-span-4 md:col-span-1 text-sm font-medium text-gray-800">
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
                                        if (totalFee - Number(value) < 0 && !feeTypeArray.includes(feeType)) return;
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
                                        if (Number(finalFee) < Number(value)) return;
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

                <div className="grid bg-[#5B31D1]/10 backdrop-blur-lg text-[#5B31D1] font-semibold px-3 py-2 rounded-[5px] grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[.8fr_0.5fr_0.5fr_0.5fr_0.8fr_0.8fr_0.5fr]  gap-x-2 sm:gap-x-3 gap-y-2 text-sm sm:text-base">
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
                <div className="space-y-1">
                  <div className="grid rounded-[5px] bg-[#5B31D1]/10 backdrop-blur-lg text-[#5B31D1] font-semibold text-sm sm:text-base px-3 py-2 grid-cols-1 xs:grid-cols-3 sm:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.8fr] gap-x-2 sm:gap-x-3 gap-y-2 border-b border-gray-200">
                    <div className="text-left">Semester</div>
                    <div className="text-center">Fee Details</div>
                    <div className="text-center">Fees</div>
                    <div className="text-center">Discount</div>
                    <div className="text-right">Final Fees</div>
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

                      return (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-[0.5fr_0.5fr_0.5fr_0.5fr_0.8fr] gap-x-2 sm:gap-x-3 gap-y-2 items-center px-3 py-1 hover:bg-gray-50 transition-colors"
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
                                    className="text-right px-3 h-8text-sm border-gray-300 focus:ring-1 focus:ring-[#5B31D1]"
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
          form={form}
          isViewable={isViewable}
          commonFieldClass=""
          commonFormItemClass=""
          remarkLabel='Finance Office Remark'
          currentStep='financeOffice'
        />

        {/* Confirmation */}
        {/* <ConfirmationOTPSection
          form={form}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
        /> */}

        <ConfirmationCheckBox
          form={form}
          name="confirmationCheck"
          label="All the Fees Deposited is Non Refundable/Non Transferable. Examination fees will be charged extra based on LU/AKTU norms."
          id="checkbox-for-step4"
          className="flex flex-row items-start bg-white rounded-md p-4 -mt-[40px]"
        />

        {/* Submit */}
        <EnquiryFormFooter
          saveDraft={saveDraft}
          form={form}
          onSubmit={onSubmit}
          draftExists={existingFeeDraft}
          confirmationChecked={confirmationChecked}
          customSaveDialog={
            <FinalFeeSaveDialog
              studentData={enquiryData}
              otherFeesWatched={otherFeesWatched}
              onRemarksChange={handleRemarksChange}
              onTransactionTypeChange={handleTransactionTypeUpdate}
            />
          }
        />
      </form>
    </Form>
  );
};

function FinalFeeSaveDialog({
  studentData,
  otherFeesWatched,
  onTransactionTypeChange,
  onRemarksChange,
  remarks
}: any) {
  const [transactionType, setTransactionType] = useState('');
  const today = format(new Date(), 'dd/MM/yyyy');

  const handleTransactionTypeChange = (newValue: string) => {
    setTransactionType(newValue);
    onTransactionTypeChange(newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full space-y-4 text-left">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Student Name</p>
            <p className="text-sm font-medium">{studentData?.studentName || 'N/A'}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">Father's Name</p>
            <p className="text-sm font-medium">{studentData?.fatherName || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-green-700 font-medium">
              Total Deposited: <br />
              {formatCurrency(
                otherFeesWatched?.reduce(
                  (sum: number, fee: any) => sum + (fee?.feesDepositedTOA || 0),
                  0
                ) || 0
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date:</p>
            <p className="text-sm font-medium">{today}</p>
          </div>
        </div>

        <div className="pt-2">
          <Label className="text-sm text-gray-600 block mb-1">Transaction Type</Label>
          <Select onValueChange={handleTransactionTypeChange} defaultValue={transactionType}>
            <SelectTrigger className="w-full text-md">
              <SelectValue placeholder="Select a transaction type" />
            </SelectTrigger>
            <SelectContent className="text-md">
              {Object.values(TransactionTypes).map((type) => (
                <SelectItem key={type} value={type}>
                  {getTransactionTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="text-[10px] sm:text-xs mt-1" />
        </div>

        <div className="pt-2">
          <Label className="text-sm text-gray-600 block mb-1">Remarks</Label>
          <Input
            value={remarks}
            onChange={(e) => onRemarksChange(e.target.value)}
            placeholder="Enter remarks"
          />
        </div>
      </div>
    </div>
  );
}
export default FinanceOfficeForm;
