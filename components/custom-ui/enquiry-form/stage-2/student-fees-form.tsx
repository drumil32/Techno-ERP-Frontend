'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { feesRequestSchema, frontendFeesDraftValidationSchema, IFeesRequestSchema } from './studentFeesSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getCounsellors, getEnquiry, getTeleCallers } from '../stage-1/enquiry-form-api';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
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
import { getFeesByCourseName, getOtherFees } from './helpers/apirequests';
import { displayFeeMapper, scheduleFeeMapper } from './helpers/mappers';
import { format, parse, isValid } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cleanDataForDraft } from './helpers/refine-data';
import { createStudentFeesDraft, updateStudentFeesDraft } from './student-fees-api';
import ShowStudentData from './data-show';
import { FeeType } from '@/types/enum';
import { MultiSelectDropdown, MultiSelectOption } from '../../multi-select/mutli-select';
import { toast } from 'sonner';

const calculateDiscountPercentage = (
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

const parseDateString = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  let parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
  if (!isValid(parsedDate)) {
    parsedDate = new Date(dateString); // Try ISO format
  }
  return isValid(parsedDate) ? parsedDate : null;
};

const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '₹0';
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

export const StudentFeesForm = () => {
  const params = useParams();
  const enquiry_id = params.id as string;
  const [isOtpSending, setIsOtpSending] = useState(false);

  // Queries
  const { data: otherFeesData, isLoading: isLoadingOtherFees } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: getOtherFees,
    staleTime: 1000 * 60 * 5
  });


  const { data, error, isLoading: isLoadingEnquiry } = useQuery<any>({
    queryKey: ['enquireFormData', enquiry_id],
    queryFn: () => (enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null')),
    enabled: !!enquiry_id
  });
  console.log(data)

  const studentEmail = data?.emailId;
  const studentPhone = data?.studentPhoneNumber;
  const courseName = data?.course

  const { data: semWiseFeesData, error: semWiseFeeError, isLoading: isLoadingSemFees } = useQuery<any>({
    queryKey: ['courseFees', courseName],
    queryFn: () => (courseName ? getFeesByCourseName(courseName) : Promise.reject('Course name not available')),
    enabled: !!courseName,
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

  const telecallersData = Array.isArray(results[0].data)
    ? [...results[0].data, { _id: "other", name: "Other", email: "other@example.com" }]
    : [{ _id: "other", name: "Other", email: "other@example.com" }];

  const counsellorsData = Array.isArray(results[1].data)
    ? [...results[1].data, { _id: "other", name: "Other", email: "other@example.com" }]
    : [{ _id: "other", name: "Other", email: "other@example.com" }];

  const form = useForm<IFeesRequestSchema>({
    resolver: zodResolver(feesRequestSchema),
    mode: 'onChange',
    defaultValues: {
      otherFees: [],
      semWiseFees: [],
      enquiryId: enquiry_id,
      feesClearanceDate: null,
      counsellorName: [],
      telecallerName: [],
      collegeSectionDate: null,
      collegeSectionRemarks: '',
      confirmationCheck: false,
      otpTarget: undefined,
      otpVerificationEmail: null,
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

  const selectedOtpTarget = useWatch({ control: form.control, name: 'otpTarget' });

  // Derive the value to display in the input
  const otpDisplayValue = useMemo(() => {
    if (selectedOtpTarget === 'email') {
      return studentEmail || '(Email not available)';
    } else if (selectedOtpTarget === 'phone') {
      return studentPhone || '(Phone not available)';
    }
    return ''; // Default placeholder if nothing is selected yet
  }, [selectedOtpTarget, studentEmail, studentPhone]);


  useEffect(() => {
    if (data && semWiseFeesData && otherFeesData) {
      let initialSemFees: any[] = [];
      let initialOtherFees: any[] = [];
      const existingFeeData = data.studentFee;

      let initialCounsellors: string[] = existingFeeData.counsellorName ?? [];

      let initialTelecallers: string[] = existingFeeData.telecallerName ?? [];

      initialOtherFees = Object.values(FeeType).map((feeType) => {
        const baseFeeData = otherFeesData.find((item: any) => item.type === feeType);
        const existingFee = existingFeeData?.otherFees?.find((fee: any) => fee.type === feeType);

        return {
          type: feeType,
          finalFee: existingFee ? existingFee.finalFee : (baseFeeData ? baseFeeData.fee : undefined),
          feesDepositedTOA: existingFee ? existingFee.feesDepositedTOA : undefined,
          remarks: existingFee ? existingFee.remarks : ''
        };
      });

      const courseSemFeeStructure = semWiseFeesData.fee || [];
      const existingSemFees = existingFeeData?.semWiseFees || [];

      initialSemFees = courseSemFeeStructure.map((feeAmount: number, index: number) => {
        const existingData = existingSemFees[index];
        return {
          finalFee: existingData ? existingData.finalFee : feeAmount
        };
      });

      form.reset({
        enquiryId: enquiry_id,
        otherFees: initialOtherFees,
        semWiseFees: initialSemFees,
        feesClearanceDate: existingFeeData?.studentFee?.feesClearanceDate || '',
        counsellorName: initialCounsellors,
        telecallerName: initialTelecallers,
        collegeSectionDate: parseDateString(existingFeeData?.collegeSectionDate),
        collegeSectionRemarks: existingFeeData?.collegeSectionRemarks ?? '',
      });


    } else if (error) {
      console.error('Error fetching enquiry data:', error);
    }
  }, [
    data,
    error,
    semWiseFeesData,
    semWiseFeeError,
    form,
    enquiry_id,
    otherFeesData
  ]);

  const otherFeesTotals = useMemo(() => {
    let totalOriginal = 0;
    let totalFinal = 0;
    let totalDeposited = 0;

    if (otherFeesData) {
      totalOriginal = otherFeesData.reduce((sum: any, fee: any) => sum + (fee.fee ?? 0), 0);
    }

    (otherFeesWatched ?? []).forEach(fee => {
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

  const counsellorOptions: MultiSelectOption[] = useMemo(() => {
    return (Array.isArray(counsellorsData) ? counsellorsData : [])
      .map((c: any) => ({ value: c._id, label: c.name }))
      .filter(Boolean);
  }, [counsellorsData]);

  const telecallerOptions: MultiSelectOption[] = useMemo(() => {
    return (Array.isArray(telecallersData) ? telecallersData : [])
      .map((t: any) => ({ value: t._id, label: t.name }))
      .filter(Boolean);
  }, [telecallersData]);


  async function handleSaveDraft() {
    const currentValues = form.getValues();
    const existingDraftId = data?.studentFee?._id;
    const isUpdate = !!existingDraftId

    const validationResult = frontendFeesDraftValidationSchema.safeParse(currentValues);

    if (!validationResult.success) {
        toast.error("Validation failed. Please check the fields.", {
             
        });

        validationResult.error.errors.forEach(err => {
          if (err.path.length > 0) {
               const fieldName = err.path.join('.') as keyof IFeesRequestSchema; 
               form.setError(fieldName, { type: 'manual', message: err.message });
          }
       });

       return;
    }

    const validatedDataForCleaning = validationResult.data;


    const dataToClean = {
      otherFees: currentValues.otherFees,
      semWiseFees: currentValues.semWiseFees,
      feesClearanceDate: currentValues.feesClearanceDate,
      counsellor: currentValues.counsellorName,
    }

    // console.log("Hello")
    console.log("ID", existingDraftId)
    // console.log(dataToClean)

    const cleanedData = cleanDataForDraft(validatedDataForCleaning);
    let finalPayload: any = {}

    if (isUpdate && existingDraftId) {
      finalPayload = {
        id: existingDraftId,
        ...(cleanedData || {}),
      };
      console.log('Final Payload:', finalPayload)
      updateStudentFeesDraft(finalPayload)
    } else {
      finalPayload = {
        // enquiryId: enquiry_id,
        ...(cleanedData || {}),
      };
      if (!finalPayload.enquiryId) {
        finalPayload.enquiryId = enquiry_id;
    }
   console.log('Creating Draft Payload: ', finalPayload);
      // console.log('Payload: ', finalPayload)
      createStudentFeesDraft(finalPayload)
      delete finalPayload.id;
    }
  }

  async function onSubmit(values: IFeesRequestSchema) {
    console.log(values);
  }

  if (isLoadingOtherFees || isLoadingEnquiry || isLoadingSemFees) {
    return <div className="flex justify-center items-center h-full">Loading fee data...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="pt-8 mr-[25px] space-y-8 flex flex-col w-full overflow-x-hidden relative"
      >


        <ShowStudentData data={data} />

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="other-fees">
          <AccordionItem value="other-fees">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold">Fees Category</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-white rounded-[10px]">
              <div className='w-2/3'>
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
                  const discountDisplay = typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                  const remainingFee = (finalFee ?? 0) - (feesDeposited ?? 0);


                  return (
                    <div key={field.id} className="grid grid-cols-[1fr_0.5fr_0.5fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-8 items-start px-2 py-1 my-4">
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
                            <div className='h-3'>
                              <FormMessage className="text-xs mt-0" /> {/* Smaller message */}
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center text-sm h-11 border border-input rounded-md px-2">
                        <p className='ml-auto'>
                          {discountDisplay}
                        </p>
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
                            <div className='h-3'>
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
                  <div className="text-sm text-right">{formatCurrency(otherFeesTotals.totalOriginal)}</div>
                  <div className="text-sm text-right pr-2">{formatCurrency(otherFeesTotals.totalFinal)}</div>
                  <div>{/* Empty cell for Discount */}</div>
                  <div className="text-sm text-right pr-2">{formatCurrency(otherFeesTotals.totalDeposited)}</div>
                  <div className="text-sm text-right pr-2">{formatCurrency(otherFeesTotals.totalDue)}</div>
                </div>

                <div className="mt-4 px-2 text-xs text-gray-600 space-y-1">
                  <p>Book Bank - *50% adjustable at the end of final semester</p>
                  <p>Book Bank - *Applicable only in BBA, MBA, BAJMC, MAJMC & BCom (Hons)</p>
                  <p>Exam Fees - To be given at the time of exact form submission as per LU/AKTU Norms</p>
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
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal h-9 text-sm",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yy") // Shorter format
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined} // Handle null
                              onSelect={(date) => field.onChange(date ?? null)} // Pass null if date is cleared
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage className="text-xs mt-1" />
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
              <div className='w-2/3'>
                <div className="space-y-4">
                  <div className="grid grid-cols-[1fr_0.5fr_1fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 mb-2 px-2 pb-1 border-b">
                    <div className="font-medium text-sm text-gray-600">Semester</div>
                    <div className="font-medium text-sm text-gray-600 text-right">Fees</div>
                    <div className="font-medium text-sm text-gray-600 text-center">Final Fees</div>
                    <div className="font-medium text-sm text-gray-600 text-center">Applicable Discount</div>
                  </div>

                  {semFields.map((field, index) => {
                    const originalFeeAmount = semWiseFeesData?.fee?.[index];
                    const finalFee = semWiseFeesWatched?.[index]?.finalFee;
                    const discountValue = calculateDiscountPercentage(originalFeeAmount, finalFee);
                    const discountDisplay = typeof discountValue === 'number' ? `${discountValue}%` : discountValue;
                    return (
                      <div key={field.id} className="grid grid-cols-[1fr_0.5fr_1fr_1fr_1fr_1fr_1fr] gap-x-3 gap-y-2 items-start px-2 py-1">
                        <div className="pt-2 text-sm">Semester {index + 1}</div>
                        <div className="pt-2 text-sm text-right">{formatCurrency(originalFeeAmount)}</div>

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
                                  onChange={(e) => formField.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                  value={formField.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage className="text-xs mt-1" />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-center text-sm h-12 border border-input rounded-md px-2">
                          {discountDisplay}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="college-details">
          <AccordionItem value="college-details" className="border-b-0">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold"> To be filled by College</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>

            <AccordionContent className="p-6 bg-white rounded-[10px]">
              <div className="w-2/3 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-8 ">
                <FormField
                  control={form.control}
                  name="counsellorName"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className="font-inter font-normal text-sm text-gray-600">
                        Counsellor’s Name(s)
                      </FormLabel>
                      <FormControl>
                        <MultiSelectDropdown
                          options={counsellorOptions}
                          selected={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="Select Counsellor(s)"
                          searchPlaceholder="Search Counsellors..."
                          isLoading={results[1].isLoading}
                        />
                      </FormControl>
                      <div className='h-5'>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telecallerName"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className="font-inter font-normal text-sm text-gray-600">
                        Telecaller’s Name(s)
                      </FormLabel>
                      <FormControl>
                        <MultiSelectDropdown
                          options={telecallerOptions}
                          selected={field.value ?? []}
                          onChange={field.onChange}
                          placeholder="Select Telecaller(s)"
                          searchPlaceholder="Search Telecallers..."
                          isLoading={results[0].isLoading}
                        />
                      </FormControl>
                      <div className='h-5'>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collegeSectionDate"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel className="font-inter font-normal text-sm text-gray-600">
                        Date
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "h-11 text-sm w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Select the Date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined}
                              onSelect={(date) => field.onChange(date ?? null)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collegeSectionRemarks"
                  render={({ field }) => (
                    <FormItem className="col-span-1 h-11">
                      <FormLabel className="font-inter font-normal text-sm text-gray-600">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Optional"
                          className="resize-none text-sm h-11"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="college-info">
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
                    <FormLabel className="text-sm font-medium block">Select Contact for OTP Verification</FormLabel>
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
                          <FormLabel htmlFor="otp-email" className={`font-normal text-sm cursor-pointer ${!studentEmail ? 'text-gray-400 cursor-not-allowed' : ''}`}>
                            Email: {studentEmail || '(Not Available)'}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="phone" id="otp-phone" disabled={!studentPhone} />
                          </FormControl>
                          <FormLabel htmlFor="otp-phone" className={`font-normal text-sm cursor-pointer ${!studentPhone ? 'text-gray-400 cursor-not-allowed' : ''}`}>
                            Phone: {studentPhone || '(Not Available)'}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs pt-1" />
                  </FormItem>
                )}
              />

              <div className='flex gap-8 items-stretch'>
                <div>
                  <FormLabel htmlFor="otp-display" className="text-sm mb-3 text-gray-600">Selected Contact</FormLabel>
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
                  onClick={() => { }}
                  disabled={isOtpSending || !selectedOtpTarget}
                  className="h-9 text-sm mt-auto"
                >
                  {isOtpSending ? 'Sending...' : 'Send OTP'}
                </Button>
              </div>

            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <FormField
          control={form.control}
          name="confirmationCheck"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start bg-white rounded-md p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal">
                  All the Fees Deposited is Non Refundable/Non Transferable. Examination fees will be charged extra based on LU/AKTU norms.
                </FormLabel>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <div className="sticky z-10 bottom-0 left-0 flex items-center justify-between space-x-4 mt-6 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
          <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={form.formState.isSubmitting}>
            Save Draft
          </Button>
          <Button type="submit" disabled={(!confirmationChecked || form.formState.isSubmitting) ?? form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Submitting..." : "Submit & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
