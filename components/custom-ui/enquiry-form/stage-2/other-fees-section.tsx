import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from "@/common/constants/apiMethods"

interface OtherFeesSectionFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<any>
}

const getOtherFees = async () => {
  const response = await fetch(API_ENDPOINTS.getOtherFees, {
    method: API_METHODS.GET,
    headers: {
      'Content-Type': 'application/json' 
    },
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error("Failed to fetch other fees");
  }

  return response.json();
}


export const OtherFeesSection: React.FC<OtherFeesSectionFormProps> = ({ form }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: getOtherFees,
    staleTime: 1000 * 60,
  })
  
  useEffect(() => {
    if (!isLoading) {
      console.log("Other Fees Data:", data);
    }
  }, [data, isLoading]);

  // useEffect(() => {
  //   if (!form.getValues("otherFees")) {
  //     form.setValue("otherFees", []);
  //   }

  //   if(otherFeesData && !isLoading) {
  //     const existingFees = form.getValues("otherFees") || [];
  //     const existingFeeTypes = existingFees.map((fee:any) => fee.type);

  //     const updatedFees = [...existingFees];

  //     otherFeesData.foreach((feeData: { type: FeeType, fee: number }) => {
  //       if (!existingFeeTypes.includes(feeData.type)) {
  //         updatedFees.push({
  //           type: feeData.type,
  //           feeAmount: feeData.fee,
  //           finalFee: 0,
  //           feesDepositedTOA: 0,
  //           remarks: ""
  //         });
  //       }
  //     });

  //     updatedFees.sort((a, b) => a.type.localeCompare(b.type));
  //     form.setValue("otherFees", updatedFees);

  //   }
  // }, [form, otherFeesData, isLoading]);

  const getFeeTypeDisplayName = (type: string) => {
    return type.replace(/([A-Z])/g, ' $1').trim();
  };
  // console.log(otherFeesData)

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="fees-category">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Fees Category</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6  gap-x-[32px] bg-white p-4 rounded-[10px]">
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  )
}
