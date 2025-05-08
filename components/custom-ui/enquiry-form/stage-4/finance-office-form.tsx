'use client';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
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
import { AdmissionReference, ApplicationStatus, FeeType } from '@/types/enum';
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

const FinanceOfficeForm = () => {
  const params = useParams();
  const enquiry_id = params.id as string;
  const [dataUpdated, setDataUpdated] = useState(true);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
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
      remarks: '',
      confirmationCheck: false,
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
        reference: enquiryData.reference,
        counsellor: initialCounsellors,
        telecaller: initialTelecallers,
        remarks: initialCollegeRemarks
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
      totalOriginal = otherFeesData.reduce((sum: any, fee: any) => sum + (fee.amount ?? 0), 0);
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
      return;
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

      await updateEnquiryStep4(finalPayLoad);

      toast.success('Fee record updated successfully!');
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
        return;
      }

      const validatedDataForCleaning = validationResult.data;
      const cleanedData = cleanDataForDraft(validatedDataForCleaning);

      const finalPayLoad: any = {
        enquiryId: enquiry_id,
        ...cleanedData
      };

      await createFinalFeeMutation.mutateAsync(finalPayLoad);

      setDataUpdated((prev) => !prev);
    }
  }
  async function onSubmit() {
    setIsSubmittingFinal(true);

    const response = await approveEnquiry({ id: enquiry_id });
    if (response) {
      toast.success('Enquiry submitted for final approval');
      router.push(SITE_MAP.ADMISSIONS.DEFAULT);
    }
  }

  if (isLoadingOtherFees || isLoadingEnquiry || isLoadingSemFees) {
    return (
      <div className="flex justify-center items-center h-full">Loading fee enquiryData...</div>
    );
  }

  return (
    <Form {...form}>
      <form className="pt-8 mr-[25px] space-y-8 flex flex-col w-full overflow-x-hidden relative">
        <ShowStudentData data={enquiryData} />

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="other-fees">
          <AccordionItem value="other-fees">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold">Fees Category</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-white rounded-[10px]">
              <div className="w-full xl:w-2/3">
                <div className="grid bg-[#F7F7F7] text-[#4E4E4E] p-3 sm:p-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-2 sm:gap-x-3 gap-y-2 mb-2 rounded-[5px] text-[14px] sm:text-[16px]">
                  <div className="xs:col-span-2 sm:col-span-4 md:col-span-1">Fees Details</div>
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
                      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-2 sm:gap-3 md:gap-4 items-start px-1 py-1 sm:px-2 sm:py-1"
                    >
                      <div className="xs:col-span-2 sm:col-span-4 md:col-span-1 pt-2 text-[12px] sm:text-sm">
                        {displayFeeMapper(feeType)}
                      </div>

                      <div className="pt-2 text-[12px] sm:text-sm text-right md:text-right">
                        {scheduleFeeMapper(feeType)}
                      </div>

                      <div className="pt-2 text-[12px] sm:text-sm text-right md:text-right">
                        {formatCurrency(totalFee)}
                      </div>

                      <div className="xs:col-span-2 sm:col-span-4 md:col-span-1">
                        <FormField
                          control={form.control}
                          name={`otherFees.${index}.finalFee`}
                          render={({ field: formField }) => (
                            <FormItem className="flex flex-col justify-end">
                              <FormControl>
                                <Input
                                  type="text"
                                  min="0"
                                  placeholder="Enter fees"
                                  {...formField}
                                  className="text-right px-2 h-9 sm:h-11 text-[12px] sm:text-sm"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || /^[0-9]*$/.test(value)) {
                                      formField.onChange(value === '' ? undefined : Number(value));
                                    }
                                  }}
                                  value={formField.value ?? ''}
                                />
                              </FormControl>
                              {/* <div className="h-[20px] sm:h-[45px]"> */}
                              <FormMessage className="text-[10px] sm:text-xs mt-0" />
                              {/* </div> */}
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center text-[12px] sm:text-sm h-9 sm:h-11 border border-input rounded-md px-2 xs:col-span-2 sm:col-span-4 md:col-span-1">
                        <p className="ml-auto">{discountDisplay}</p>
                      </div>

                      <div className="xs:col-span-2 sm:col-span-4 md:col-span-1">
                        <FormField
                          control={form.control}
                          name={`otherFees.${index}.feesDepositedTOA`}
                          render={({ field: formField }) => (
                            <FormItem className="flex flex-col justify-end">
                              <FormControl>
                                <Input
                                  type="text"
                                  min="0"
                                  placeholder="Enter fees"
                                  {...formField}
                                  className="text-right px-2 h-9 sm:h-11 text-[12px] sm:text-sm"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || /^[0-9]*$/.test(value)) {
                                      formField.onChange(value === '' ? undefined : Number(value));
                                    }
                                  }}
                                  value={formField.value ?? ''}
                                />
                              </FormControl>
                              {/* <div className="h-[20px] sm:h-[45px]"> */}
                              <FormMessage className="text-[10px] sm:text-xs min-h-10 mt-0" />
                              {/* </div> */}
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex items-center justify-end text-[12px] sm:text-sm h-9 sm:h-11 border border-input rounded-md px-2 xs:col-span-2 sm:col-span-4 md:col-span-1">
                        {formatCurrency(remainingFee)}
                      </div>
                    </div>
                  );
                })}

                <div className="grid bg-[#F7F7F7] text-[#4E4E4E] p-3 sm:p-5 rounded-[5px] grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-2 sm:gap-x-3 gap-y-2 mt-2 border-t">
                  <div className="text-[12px] sm:text-sm xs:col-span-2 sm:col-span-4 md:col-span-1">
                    Total Fees
                  </div>
                  <div></div>
                  <div className="text-[12px] sm:text-sm text-right">
                    {formatCurrency(otherFeesTotals.totalOriginal)}
                  </div>
                  <div className="text-[12px] sm:text-sm text-right pr-1 sm:pr-2">
                    {formatCurrency(otherFeesTotals.totalFinal)}
                  </div>
                  <div className="text-[12px] sm:text-sm text-right pr-1 sm:pr-2">
                    {calculateDiscountPercentage(
                      otherFeesTotals.totalOriginal,
                      otherFeesTotals.totalFinal
                    ) + '%'}
                  </div>
                  <div className="text-[12px] sm:text-sm text-right pr-1 sm:pr-2">
                    {formatCurrency(otherFeesTotals.totalDeposited)}
                  </div>
                  <div className="text-[12px] sm:text-sm text-right pr-1 sm:pr-2">
                    {formatCurrency(otherFeesTotals.totalDue)}
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 px-1 sm:px-2 text-[10px] sm:text-xs text-gray-600 space-y-1">
                  <p>Book Bank - *50% adjustable at the end of final semester</p>
                  <p>Book Bank - *Applicable only in BBA, MBA, BAJMC, MAJMC & BCom (Hons)</p>
                  <p>
                    Exam Fees - To be given at the time of exact form submission as per LU/AKTU
                    Norms
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 px-1 sm:px-2">
                  <DatePicker
                    control={form.control}
                    name="feesClearanceDate"
                    label="Fees Clearance Date"
                    disabled={isViewable}
                    placeholder="Pick a Date"
                    showYearMonthDropdowns={true}
                    formItemClassName="w-full sm:w-[300px]"
                    labelClassName="font-inter font-normal text-[10px] sm:text-[12px] text-[#666666]"
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
              <div className="w-full lg:w-2/3">
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid bg-[#F7F7F7] rounded-[5px] text-[#4E4E4E] p-3 sm:p-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-[1fr_0.5fr_1fr_1fr] gap-x-2 sm:gap-x-3 gap-y-2 mb-2 pb-1 border-b">
                    <div className="font-medium text-[12px] sm:text-sm text-gray-600">Semester</div>
                    <div className="font-medium text-[12px] sm:text-sm text-gray-600 text-right">
                      Fees
                    </div>
                    <div className="font-medium text-[12px] sm:text-sm text-gray-600 text-center">
                      Final Fees
                    </div>
                    <div className="font-medium text-[12px] sm:text-sm text-gray-600 text-center">
                      Applicable Discount
                    </div>
                  </div>

                  {semFields.map((field, index) => {
                    const originalFeeAmount = semWiseFeesData[index];
                    const finalFee = semWiseFeesWatched?.[index]?.finalFee;
                    const discountValue = calculateDiscountPercentage(originalFeeAmount, finalFee);
                    const discountDisplay =
                      typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                    return (
                      <div
                        key={field.id}
                        className="grid w-full h-max grid-cols-1 xs:grid-cols-2 sm:grid-cols-[1fr_0.5fr_1fr_1fr] gap-x-2 sm:gap-x-3 gap-y-2 items-start px-1 sm:px-2 py-1"
                      >
                        <div className="pt-2 text-[12px] sm:text-sm">Semester {index + 1}</div>
                        <div className="pt-2 text-[12px] sm:text-sm text-right">
                          {formatCurrency(originalFeeAmount)}
                        </div>

                        <FormField
                          control={form.control}
                          name={`semWiseFees.${index}.finalFee`}
                          render={({ field: formField }) => (
                            <FormItem className="flex flex-col justify-end">
                              <FormControl>
                                <Input
                                  type="text"
                                  min="0"
                                  placeholder="Enter fees"
                                  {...formField}
                                  className="text-right px-2 h-9 sm:h-11 text-[12px] sm:text-sm"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || /^[0-9]*$/.test(value)) {
                                      formField.onChange(value === '' ? undefined : Number(value));
                                    }
                                  }}
                                  value={formField.value ?? ''}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px] sm:text-xs mt-1" />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center text-[12px] sm:text-sm h-9 sm:h-11 border border-input rounded-md px-2">
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

        <FilledByCollegeSection commonFieldClass="" commonFormItemClass="" form={form} />

        {/* Confirmation */}
        <ConfirmationOTPSection
          form={form}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
        />

        <ConfirmationCheckBox
          form={form}
          name="confirmationCheck"
          label="All the Fees Deposited is Non Refundable/Non Transferable. Examination fees will be charged extra based on LU/AKTU norms."
          id="checkbox-for-step2"
          className="flex flex-row items-start bg-white rounded-md p-4"
        />

        {/* Submit */}
        <EnquiryFormFooter
          saveDraft={saveDraft}
          form={form}
          onSubmit={onSubmit}
          confirmationChecked={!!confirmationChecked}
        />
      </form>
    </Form>
  );
};

export default FinanceOfficeForm;
