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
  console.log(form)
  const { data: otherFeesData, isLoading } = useQuery({
    queryKey: ['otherFeesData'],
    queryFn: getOtherFees,
    staleTime: 1000 * 60,
  })

  useEffect(() => {
    if (!form.getValues("otherFees")) {
      form.setValue("otherFees", []);
    }

    if (otherFeesData && !isLoading) {
      const existingFees = form.getValues("otherFees") || [];
      const existingFeeTypes = existingFees.map((fee: any) => fee.type);

      const updatedFees = [...existingFees];

      otherFeesData.forEach((feeData: { type: any, fee: number }) => {
        if (!existingFeeTypes.includes(feeData.type)) {
          updatedFees.push({
            type: feeData.type,
            feeAmount: feeData.fee,
            finalFee: 0,
            feesDepositedTOA: 0,
            remarks: ""
          });
        }

      });

      console.log("Other Fees in Form:", form.getValues("otherFees"));
      updatedFees.sort((a, b) => a.type.localeCompare(b.type));
      form.setValue("otherFees", updatedFees);

    }
  }, [otherFeesData, form, otherFeesData, isLoading]);

  const getFeeTypeDisplayName = (type: string) => {
    return type.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="fees-category">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Fees Category</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
          
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  )
}
