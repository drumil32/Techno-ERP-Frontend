'use client';
// React and React Hook Form imports
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// React Query imports
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';

// Next.js navigation imports
import { useParams, useRouter } from 'next/navigation';

// UI components imports
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

// Utility imports
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';

// API and data-fetching imports
import {
  createStudentFees,
  getFeesByCourseName,
  getOtherFees,
  updateStudentFees
} from '../stage-2/helpers/apirequests';

// Schema and validation imports
import {
  feesRequestSchema,
  feesUpdateSchema,
  IFeesRequestSchema
} from '../stage-2/studentFeesSchema';
import { validateCustomFeeLogic } from '../stage-2/helpers/validateFees';
import { cleanDataForDraft } from '../stage-2/helpers/refine-data';

// Helper functions and constants imports
import {
  calculateDiscountPercentage,
  formatCurrency,
  formatDisplayDate,
  parseDisplayDate
} from '../stage-2/student-fees-form';
import { displayFeeMapper, scheduleFeeMapper } from '../stage-2/helpers/mappers';
import { FeeType } from '@/types/enum';
import { API_ROUTES } from '@/common/constants/apiRoutes';

// Component imports
import ShowStudentData from '../stage-2/data-show';
import FilledByCollegeSection from '../stage-1/filled-by-college-section';
import ConfirmationCheckBox from './confirmation-check-box';
import ConfirmationOTPSection from './confirmation-otp-section';
import EnquiryFormFooter from './enquiry-form-footer';
import { getEnquiry } from '../stage-1/enquiry-form-api';
import { createEnquiryStep4, updateEnquiryStep4 } from './helpers/apirequests';

const FinanceOfficeForm = () => {
  const params = useParams();
  const enquiry_id = params.id as string;
  const [dataUpdated, setDataUpdated] = useState(true);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const router = useRouter();

  // Queries
  const { data: otherFeesData, isLoading: isLoadingOtherFees } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: getOtherFees,
    staleTime: 1000 * 60 * 5
  });

  const {
    data: enquiryData,
    error,
    isLoading: isLoadingEnquiry
  } = useQuery<any>({
    queryKey: ['enquireFormData', enquiry_id, dataUpdated],
    queryFn: () => (enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null')),
    enabled: !!enquiry_id
  });

  const existingFinalFee = enquiryData?.studentFee;
  const existingFeeDraft = enquiryData?.studentFeeDraft;

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
  const courseName = enquiryData?.course;

  const {
    data: semWiseFeesData,
    error: semWiseFeeError,
    isLoading: isLoadingSemFees
  } = useQuery<any>({
    queryKey: ['courseFees', courseName],
    queryFn: () =>
      courseName ? getFeesByCourseName(courseName) : Promise.reject('Course name not available'),
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
    }
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

      const baseSem1Fee = semWiseFeesData.fee?.[0];

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
        fee: baseSem1Fee,
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

      const courseSemFeeStructure = semWiseFeesData.fee || [];
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

  const createFinalFeeMutation = useMutation({
    mutationFn: createEnquiryStep4,
    onSuccess: () => {
      toast.success('Fee record created successfully!');
      queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });
    }
  });

  async function onSubmit() {
    setIsSubmittingFinal(true);
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

    }
    else {

      const validationResult = feesUpdateSchema.safeParse(values);

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

    router.push(API_ROUTES.admissions);
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
              <div className="w-2/3">
                <div className="grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mb-2 px-2 pb-1 font-bold text-[16px]">
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
                  const originalFeeData = otherFeesData?.find((fee: any) => fee.type === feeType);
                  const totalFee = originalFeeData?.fee;
                  const finalFee = otherFeesWatched?.[index]?.finalFee;
                  const feesDeposited = otherFeesWatched?.[index]?.feesDepositedTOA;
                  const discountValue = calculateDiscountPercentage(totalFee, finalFee);
                  const discountDisplay =
                    typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                  const remainingFee = (finalFee ?? 0) - (feesDeposited ?? 0);

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-8 items-start px-2 py-1 my-4"
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

                <div className="grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mt-2 px-2 py-2 border-t font-semibold">
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
                  <FormField
                    control={form.control}
                    name="feesClearanceDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full max-w-xs">
                        <FormLabel className="text-sm font-medium">Fees Clearance Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <div>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal h-9 text-sm', // Adjusted height
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {/* Display the string value directly */}
                                  {field.value ? field.value : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </div>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              // Parse the stored string ('dd/MM/yyyy') into a Date for the Calendar
                              selected={parseDisplayDate(field.value)}
                              onSelect={(selectedDate: Date | undefined) => {
                                // Format the selected Date back into 'dd/MM/yyyy' string for storage
                                const formattedDate = formatDisplayDate(selectedDate);
                                // Update the form field with the string value or null
                                field.onChange(formattedDate);
                              }}
                              // Optional: Disable dates if needed
                              // disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {/* Ensure FormMessage is displayed */}
                        <div className="h-5 mt-1">
                          {' '}
                          {/* Allocate space for message */}
                          <FormMessage className="text-xs" />
                        </div>
                      </FormItem>
                    )}
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
              <div className="w-2/3">
                <div className="space-y-4">
                  <div className="grid grid-cols-[1fr_0.5fr_1fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mb-2 px-2 pb-1 border-b">
                    <div className="font-medium text-sm text-gray-600">Semester</div>
                    <div className="font-medium text-sm text-gray-600 text-right">Fees</div>
                    <div className="font-medium text-sm text-gray-600 text-center">Final Fees</div>
                    <div className="font-medium text-sm text-gray-600 text-center">
                      Applicable Discount
                    </div>
                  </div>

                  {semFields.map((field, index) => {
                    const originalFeeAmount = semWiseFeesData?.fee?.[index];
                    const finalFee = semWiseFeesWatched?.[index]?.finalFee;
                    const discountValue = calculateDiscountPercentage(originalFeeAmount, finalFee);
                    const discountDisplay =
                      typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-[1fr_0.5fr_1fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 items-start px-2 py-1"
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

        <FilledByCollegeSection commonFieldClass="" commonFormItemClass="" form={form} />

        {/* Confirmation */}
        <ConfirmationOTPSection
          form={form}
          studentEmail={studentEmail}
          studentPhone={studentPhone}
        />

        {/* Checkbox */}
        <ConfirmationCheckBox form={form} />

        {/* Submit */}
        <EnquiryFormFooter
          form={form}
          onSubmit={onSubmit}
          confirmationChecked={confirmationChecked}
        />
      </form>
    </Form>
  );
};

export default FinanceOfficeForm;
