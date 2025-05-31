import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Countries, Districts, StatesOfIndia } from '@/types/enum';
import { Qualification } from '../schema/schema';
import { handleNumericInputChange } from '@/lib/utils';

interface EntranceExamDetailsSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const EntranceExamDetailsSection: React.FC<EntranceExamDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass
}) => {
  return (
    <Accordion type="single" collapsible defaultValue="exam-details">
      <AccordionItem value="exam-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">Entrance Exam Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                key="nameOfExamination"
                control={form.control}
                name="entranceExamDetails.nameOfExamination"
                render={({ field }) => (
                  <FormItem className={`col-span-1 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      Name of the Examination
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        value={field.value ?? ''}
                        className=""
                        placeholder="Enter the name of examination"
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="rollNumber"
                control={form.control}
                name="entranceExamDetails.rollNumber"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 `}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      Roll Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        value={field.value ?? ''}
                        className={commonFieldClass}
                        placeholder="Enter roll number"
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="rank"
                control={form.control}
                name="entranceExamDetails.rank"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      Rank
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        className={commonFieldClass}
                        placeholder="Enter the rank"
                        onChange={(e) => handleNumericInputChange(e, field.onChange)}
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="qualified"
                control={form.control}
                name="entranceExamDetails.qualified"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      Qualified
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value === 'Yes')}
                        value={
                          field.value === true ? 'Yes' : field.value === false ? 'No' : undefined
                        }
                      >
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Yes/No" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default EntranceExamDetailsSection;
