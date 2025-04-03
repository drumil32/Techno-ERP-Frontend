import React, { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Countries, Districts, StatesOfIndia } from '@/types/enum';
import { Qualification } from '../schema/schema';

interface EntranceExamDetailsSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const EntranceExamDetailsSection: React.FC<EntranceExamDetailsSectionInterface> = ({ form, commonFieldClass, commonFormItemClass }) => {



  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">Entrance Exam Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px] bg-white p-4 rounded-[10px]">

              <FormField
                key="examName"
                control={form.control}
                name="entranceExamDetails.examName"
                render={({ field }) => (
                  <FormItem className={`col-span-1 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Name of the Examination
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className=""
                        placeholder="Enter the name of examination"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                key="rollNumber"
                control={form.control}
                name="entranceExamDetails.rollNumber"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 `}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Roll Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter roll number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="rank"
                control={form.control}
                name="entranceExamDetails.rank"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Rank
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter the rank"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="qualification"
                control={form.control}
                name="entranceExamDetails.district"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Qualified
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Yes/no" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Qualification).map((qualification) => (
                            <SelectItem key={qualification} value={qualification}>
                              {qualification}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default EntranceExamDetailsSection;