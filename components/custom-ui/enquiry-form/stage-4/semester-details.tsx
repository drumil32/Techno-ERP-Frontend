import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFieldArray, UseFormReturn, useWatch } from 'react-hook-form';
import { calculateDiscountPercentage, formatCurrency } from '../stage-2/student-fees-form';

interface SemesterDetailsProps {
    form: UseFormReturn<any>;
    semWiseFeesData: any;
}

const SemesterDetails: React.FC<SemesterDetailsProps> = ({ form, semWiseFeesData }) => {
  const semWiseFeesWatched = useWatch({ control: form.control, name: 'semWiseFees' });

  const { fields: semFields } = useFieldArray({
    control: form.control,
    name: 'semWiseFees'
  });

  return (
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
  );
};

export default SemesterDetails;
