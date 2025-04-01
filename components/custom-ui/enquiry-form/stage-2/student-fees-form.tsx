'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { feesRequestSchema, IFeesRequestSchema } from './studentFeesSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { getEnquiry } from '../stage-1/enquiry-form-api';
import { useEffect, useState } from 'react';
import ConfirmationCheckBox from '../stage-1/confirmation-check-box';
import EnquiryFormFooter from '../stage-1/enquiry-form-footer-section';
import { useParams } from 'next/navigation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { FeeType } from '@/types/enum';
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


export const StudentFeesForm = () => {
  const params = useParams();
  const enquiry_id = params.id as string;
  const [isOtpSending, setIsOtpSending] = useState(false);

  // Queries
  const { data: otherFeesData, isLoading } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: getOtherFees,
    staleTime: 1000 * 60
  });

  const { data, error, isLoading: isLoadingEnquiry } = useQuery<any>({
    queryKey: ['enquireFormData', enquiry_id],
    queryFn: () => (enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null')),
    enabled: !!enquiry_id
  });

  const studentEmail = data?.studentEnquiry?.personalDetails?.email;
  const studentPhone = data?.studentEnquiry?.personalDetails?.phoneNumber;

  const { data: semWiseFeesData, error: semWiseFeeError, isLoading: isLoadingSemFees } = useQuery<any>({
    queryKey: ['courseFees', data?.course],
    queryFn: () => (data?.course ? getFeesByCourseName(data.course) : Promise.reject('Course name not available')),
    enabled: !!data?.course,
  });


  const form = useForm<IFeesRequestSchema>({
    resolver: zodResolver(feesRequestSchema),
    mode: 'onChange',
    defaultValues: {
      otherFees: [],
      semWiseFees: [],
      enquiryId: enquiry_id,
      feesClearanceDate: '',
      counsellorName: '',
      telecallerName: '',
      collegeSectionDate: null,
      collegeSectionRemarks: '',
    }
  });

  const otherFeesWatched = useWatch({ control: form.control, name: 'otherFees' });
  const semWiseFeesWatched = useWatch({ control: form.control, name: 'semWiseFees' });

  const { fields: semFields, replace: replaceSemwiseFees } = useFieldArray({
    control: form.control,
    name: 'semWiseFees'
  });

  const { fields: otherFeesFields, replace: replaceOtherFees } = useFieldArray({
    control: form.control,
    name: 'otherFees'
  });

//   useEffect(() => {
//     if (
//       otherFeesData &&
//       otherFeesData.length > 0 &&
//       form.getValues('otherFees')?.length &&
//       !data?.studentFee
//     ) {
//       const initialOtherFees = Object.values(FeeType).map((feeType) => {
//         const feeData = otherFeesData.find((item: any) => item.type === feeType);
//         return {
//           type: feeType,
//           finalFee: feeData ? feeData.fee : undefined,
//           feesDepositedTOA: undefined,
//           remarks: ''
//         };
//       });

//       replaceOtherFees(initialOtherFees);
//     }
//   }, [otherFeesData, replaceOtherFees, data, form]);

  useEffect(() => {
    if (data && semWiseFeesData) {
      let initialSemFees: any[] = [];
      let initialOtherFees: any[] = [];

      if (data.studentFee) {
        initialOtherFees = Object.values(FeeType).map((feeType) => {
          const existingFee = data.studentFee.otherFees.find((fee: any) => fee.type === feeType);
          const baseFeeData = otherFeesData?.find((item: any) => item.type === feeType);
          return existingFee
            ? {
              type: feeType,
              finalFee: existingFee.finalFee,
              feesDepositedTOA: existingFee.feesDepositedTOA
            }
            : {
              type: feeType,
              finalFee: baseFeeData ? baseFeeData.fee : undefined,
              feesDepositedTOA: undefined
            };
        });

        const existingSemFees = data.studentFee.semWiseFees || [];
        const courseSemFeeStructure = semWiseFeesData.fee || [];

        initialSemFees = courseSemFeeStructure.map((feeAmount: number, index: number) => {
          const existingData = existingSemFees[index];
          return {
            feeAmount: feeAmount,
            finalFee: existingData ? existingData.finalFee : feeAmount
          };
        });
      } else {
        if (otherFeesData && otherFeesData.length > 0) {
          initialOtherFees = Object.values(FeeType).map((feeType) => {
            const feeData = otherFeesData.find((item: any) => item.type === feeType);
            return {
              type: feeType,
              finalFee: feeData ? feeData.fee : undefined,
              feesDepositedTOA: undefined,
              remarks: ''
            };
          });
        }

        initialSemFees = (semWiseFeesData.fee || []).map((feeAmount: number) => ({
          feeAmount: feeAmount,
          finalFee: feeAmount
        }));
      }

      form.reset({
        otherFees: initialOtherFees,
        semWiseFees: initialSemFees,
        feesClearanceDate: data.studentFee?.feesClearanceDate || '',
        enquiryId: enquiry_id
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
    otherFeesData,
    replaceOtherFees
  ]);

  const calculateRemainingFee = (index: number) => {
    const finalFee = form.getValues(`otherFees.${index}.finalFee`) || 0;
    const feesDeposited = form.getValues(`otherFees.${index}.feesDepositedTOA`) || 0;

    return finalFee - feesDeposited;
  };

  async function saveDraft() {
    console.log(form.getValues());
  }

  async function onSubmit(values: IFeesRequestSchema) {
    console.log(values);
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading fee data...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-8 mr-[25px] space-y-8 flex flex-col w-full"
      >
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Other Fees</h2>

          <div className="grid grid-cols-7 gap-4 mb-4 font-medium">
            <div>Fee Details</div>
            <div>Schedule</div>
            <div>Fees</div>
            <div>Final Fees</div>
            <div>Applicable Discount</div>
            <div>Fees Deposited</div>
            <div>Fees due in 1st Sem</div>
          </div>

          {otherFeesFields.map((field, index) => {
            const feeType = otherFeesWatched?.[index]?.type;
            const totalFee = otherFeesData?.find((fee: any) => fee.type === feeType)?.fee;
            const finalFee = otherFeesWatched?.[index]?.finalFee;
            const feesDeposited = otherFeesWatched?.[index]?.feesDepositedTOA;
            const discount = calculateDiscountPercentage(totalFee, finalFee);
            const remainingFee = (finalFee ?? 0) - (feesDeposited ?? 0);

            return (
              <div key={field.id} className="grid grid-cols-7 gap-4 items-start ">
                <div className="pt-2">{displayFeeMapper(feeType)}</div>
                <div className="pt-2">{scheduleFeeMapper(feeType)}</div>
                <div className="pt-2">{totalFee ?? '-'}</div>

                <FormField
                  control={form.control}
                  name={`otherFees.${index}.finalFee`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="text-right px-2"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value)
                            )
                          }
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center px-2 border border-gray-300 rounded-md h-9 bg-gray-50">
                  {discount}%
                </div>

                <FormField
                  control={form.control}
                  name={`otherFees.${index}.feesDepositedTOA`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="text-right px-2"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === '' ? undefined : Number(e.target.value)
                            )
                          }
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center px-2 border border-gray-300 rounded-md h-9 bg-gray-50">
                  {remainingFee}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Semester Wise Fees</h2>

          <div className="grid grid-cols-4 gap-4 mb-4 font-medium">
            <div>Semester</div>
            <div>Fees</div>
            <div>Final Fees</div>
            <div>Applicable Discount</div>
          </div>
          {semFields.map((field, index) => {
            const totalFee = field.feeAmount;
            const finalFee = semWiseFeesWatched?.[index]?.finalFee;

            const discount = calculateDiscountPercentage(totalFee, finalFee);

            return (
              <div key={field.id} className="grid grid-cols-4 gap-4 items-start">
                <div className="pt-2">Semester {index + 1}</div>
                <div className="pt-2">{totalFee ?? '-'}</div>
                <FormField
                  control={form.control}
                  name={`semWiseFees.${index}.finalFee`}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="text-right px-2"
                          type="number"
                          {...field}
                          onChange={(e) => formField.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          value={formField.value ?? ""}
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-center px-2 border border-gray-300 rounded-md h-9 bg-gray-50">{discount}%</div>

              </div>
            );
          })}
        </div>

        <FormField
          control={form.control}
          name="feesClearanceDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full max-w-xs">
              <FormLabel>Fees Clearance Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd/MM/yyyy")
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
                    selected={field.value ?? undefined}
                    onSelect={(date) => field.onChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="h-5" />
            </FormItem>
          )}
        />

        <ConfirmationCheckBox form={form} />
        <EnquiryFormFooter saveDraft={saveDraft} />
      </form>
    </Form>
  );
};
