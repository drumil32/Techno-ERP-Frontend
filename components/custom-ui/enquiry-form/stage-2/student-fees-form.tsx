'use client'

import { useFieldArray, useForm } from "react-hook-form"
import { feesRequestSchema, IFeesRequestSchema } from "./studentFeesSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { getEnquiry } from "../stage-1/enquiry-form-api"
import { useEffect } from "react"
import ConfirmationCheckBox from "../stage-1/confirmation-check-box"
import EnquiryFormFooter from "../stage-1/enquiry-form-footer-section"
import { useParams } from 'next/navigation'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { FeeType } from "@/types/enum"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getOtherFees } from "./helpers/apirequests"
import { displayFeeMapper, scheduleFeeMapper } from "./helpers/mappers"
import { getFeesByCourseName } from "./student-fees-api"

export const StudentFeesForm = () => {
  const params = useParams()
  const enquiry_id = params.id as string

  const { data: otherFeesData, isLoading } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: getOtherFees,
    staleTime: 1000 * 60,
  })

  const defaultOtherFees = Object.values(FeeType).map(feeType => ({
    type: feeType,
    finalFee: 0,
    feesDepositedTOA: 0
  }));

  const form = useForm<IFeesRequestSchema>({
    resolver: zodResolver(feesRequestSchema),
    mode: "onChange",
    defaultValues: {
      otherFees: defaultOtherFees,
      semWiseFees: [{ finalFee: 0 }, { finalFee: 0 }],
      enquiryId: enquiry_id,
      feesClearanceDate: ""
    }
  })

  const { fields: semFields } = useFieldArray({
    control: form.control,
    name: "semWiseFees"
  })

  const { fields: otherFeesFields, replace: replaceOtherFees } = useFieldArray({
    control: form.control,
    name: "otherFees"
  })

  const { data, error } = useQuery<any>({
    queryKey: ['enquireFormData', enquiry_id],
    queryFn: () => enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null'),
    enabled: !!enquiry_id,
  });

  const {data: semWiseFees, error: semWiseFeeError} = useQuery<any>({
    queryKey: ['enquireFormData'],
    queryFn: () => data.course ? getFeesByCourseName(data.course) : Promise.reject(''),
    enabled: !!data,
  })

  useEffect(() => {
    if (otherFeesData && otherFeesData.length > 0 && !data?.studentFee) {
      const initialOtherFees = Object.values(FeeType).map(feeType => {
        const feeData = otherFeesData.find((item: any) => item.type === feeType);
        return {
          type: feeType,
          finalFee: feeData ? feeData.fee : undefined,  
          feesDepositedTOA: undefined, 
          remarks: ""  
        };
      });
  
      replaceOtherFees(initialOtherFees);
    }
  }, [otherFeesData, replaceOtherFees, data]);
  

  useEffect(() => {
    if (data && data.studentFee) {
      const mergedOtherFees = Object.values(FeeType).map(feeType => {
        const existingFee = data.studentFee.otherFees.find((fee: any) => fee.type === feeType);
        return existingFee ? {
          type: feeType,
          finalFee: existingFee.finalFee,
          feesDepositedTOA: existingFee.feesDepositedTOA
        } : {
          type: feeType,
          finalFee: undefined,
          feesDepositedTOA: undefined
        };
      });

      const formData = {
        otherFees: mergedOtherFees,
        semWiseFees: data.studentFee.semWiseFees.map((sem: any) => ({
          finalFee: sem.finalFee
        })),
        feesClearanceDate: data.studentFee.feesClearanceDate || "",
        enquiryId: enquiry_id
      };

      form.reset(formData);
    } else if (error) {
      console.error("Error fetching enquiry data:", error);
    }
  }, [data, error, form, enquiry_id, replaceOtherFees]);

  const calculateDiscount = (index: number) => {
    const feeType = form.getValues(`otherFees.${index}.type`);
    const finalFee = form.getValues(`otherFees.${index}.finalFee`) || 0;

    const totalFee = otherFeesData?.find((fee:any) => fee.type === feeType)?.fee || 0;
    const discount = Math.round(100 - ((finalFee / totalFee) * 100));


    return discount > 0 ? discount : 0;
  };

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

          <div className="grid grid-cols-10 gap-5 mb-8 font-medium">
            <div>Fee Details</div>
            <div>Schedule</div>
            <div>Fees</div>
            <div>Final Fees</div>
            <div>Applicable Discount</div>
            <div>Fees Deposited</div>
            <div>Fees due in 1st Sem</div>
          </div>

          {otherFeesFields.map((field, index) => {
            const feeType = form.watch(`otherFees.${index}.type`);
            const totalFee = otherFeesData?.find((fee:any) => fee.type === feeType)?.fee || 0;
            const finalFee = form.watch(`otherFees.${index}.finalFee`) || 0;
            const feesDeposited = form.watch(`otherFees.${index}.feesDepositedTOA`) || 0;
            const discount = calculateDiscount(index);
            const remainingFee = calculateRemainingFee(index);

            return (
              <div key={field.id} className="grid grid-cols-10 gap-5 ">
                <div>{displayFeeMapper(feeType)}</div>
                <div>{scheduleFeeMapper(feeType)}</div>
                <div>{totalFee}</div>

                <FormField
                  control={form.control}
                  name={`otherFees.${index}.finalFee`}
                  render={({ field }) => (
                    <FormItem >
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="text-right px-2 w-30"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                        />
                      </FormControl>
                      <div className="h-5">
                      <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex items-center px-2 border-[1px] rounded-md w-30 h-9">{discount}%</div>

                <FormField
                  control={form.control}
                  name={`otherFees.${index}.feesDepositedTOA`}
                  render={({ field }) => (
                    <FormItem >
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          className="text-right px-2 w-30"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                        />
                      </FormControl>
                      <div className="h-5">
                      <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex items-center px-2 border-[1px] rounded-md w-30 h-9">{remainingFee}</div>
              </div>
            );
          })}

        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Semester Wise Fees</h2>

          {semFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-5">
              <FormField
                control={form.control}
                name={`semWiseFees.${index}.finalFee`}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Semester {index + 1} Fee</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? 0 : Number(value));
                        }}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="feesClearanceDate"
          render={({ field }) => (
            <FormItem className="w-full max-w-md">
              <FormLabel>Fees Clearance Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <div className="h-5">
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="button" onClick={saveDraft} variant="outline" className="w-fit">
          Save Draft
        </Button>

        <ConfirmationCheckBox form={form} />
        <EnquiryFormFooter saveDraft={saveDraft} />
      </form>
    </Form>
  )
}