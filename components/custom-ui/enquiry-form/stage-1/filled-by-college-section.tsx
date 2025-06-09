// React and Hooks
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

// UI Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Icons
import { CalendarDaysIcon } from 'lucide-react';

// Utilities
import { Checkbox } from '@/components/ui/checkbox';
import { getCounsellors, getTeleCallers } from './enquiry-form-api';
import { useQueries } from '@tanstack/react-query';
import { MultiSelectPopoverCheckbox } from '../../common/multi-select-popover-checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AdmissionReference } from '@/types/enum';
import { formSchema } from './enquiry-form-stage1';

interface UserRoleInterface {
  _id: string;
  name: string;
  email: string;
}

// Props Interface
interface FilledByCollegeSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
  currentStep?: string;
  remarkLabel?:string
}

const FilledByCollegeSection: React.FC<FilledByCollegeSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass,
  isViewable,
  currentStep = 'enquiry',
  remarkLabel = 'Enquiry Remark'
}) => {
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

  let remark = currentStep + "Remark";
  const telecallers: { _id: string; name: string }[] = Array.isArray(results[0].data)
    ? results[0].data.map((name: string) => ({ _id: name, name }))
    : [];

  const counsellors: { _id: string; name: string }[] = Array.isArray(results[1].data)
    ? results[1].data.map((name: string) => ({ _id: name, name }))
    : [];

  const references: { _id: string; name: string }[] = Object.values(AdmissionReference).map(
    (ref) => ({ _id: ref, name: ref })
  );

  return (
    <Accordion className='h-auto' type="single" collapsible defaultValue="student-details">
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">To be filled by College</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="h-auto grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-y-1 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <MultiSelectPopoverCheckbox
                form={form}
                name="references"
                disabled={isViewable}
                label="References"
                options={references}
                placeholder="Select References"
                className={commonFormItemClass}
              />
              <FormField
                key="srAmount"
                control={form.control}
                name="srAmount"
                render={({ field: formField }) => (
                  <FormItem className={`${commonFormItemClass} `}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      SR Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...formField}
                        value={formField.value ?? 0}
                        className={commonFieldClass}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value)) {
                            formField.onChange(value === '' ? 0 : Number(value));
                          }
                        }}
                        defaultValue={0}
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />
              {/* intially it was just one reference field, but now it is multiple references field so that i have added above one and commented below one */}
              {/* <FormField
                key="references"
                control={form.control}
                name="references"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      References
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          if (value) {
                            field.onChange(value);
                          }
                        }}
                        value={field.value}
                        disabled={isViewable}
                      >
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select references" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AdmissionReference).map((ref) => (
                            <SelectItem key={ref} value={ref}>
                              {ref}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              /> */}
              <MultiSelectPopoverCheckbox
                form={form}
                className={commonFormItemClass}
                disabled={isViewable}
                name="telecaller"
                label="Telecaller’s Name"
                options={telecallers}
                placeholder="Select Telecaller's Name"
              />
              
              <MultiSelectPopoverCheckbox
                form={form}
                name="counsellor"
                disabled={isViewable}
                label="Counsellor’s Name"
                options={counsellors}
                placeholder="Select Counsellor's Name"
                className={commonFormItemClass}
              />
              <FormField
                key={remark}
                control={form.control}
                name={remark}
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-4 col-start-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      {remarkLabel}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={commonFieldClass}
                        placeholder="Optional"
                      />
                    </FormControl>
                    <FormControl>
                      <div className="h-auto ">
                        {form.getValues().registarOfficeRemark && remark != "registarOfficeRemark" && remark != "feeDetailsRemark"  &&
                          <div className='mt-4'>
                            <FormLabel className="font-inter font-semibold text-[12px] text-primary">
                              {"Registar Office Remaks"}
                            </FormLabel>
                            <Input
                            className='hover:cursor-pointer hover:underline'
                            title={form.getValues().registarOfficeRemark}
                              value={form.getValues().registarOfficeRemark}
                              readOnly
                              
                            />
                          </div>
                        }
                        <FormMessage className="text-[11px]" />
                      </div>
                    </FormControl>
                    <FormControl>
                      <div className="h-auto">
                        {(form.getValues().feeDetailsRemark == "" || form.getValues().feeDetailsRemark)&& remark != "feeDetailsRemark" && remark != "enquiryRemark" &&
                          <div className='mt-4'>
                            <FormLabel className="font-inter font-semibold text-[12px] text-primary">
                              {"Fee Details Remaks"}
                            </FormLabel>
                            <Input
                            className='hover:cursor-pointer hover:underline'
                            title={form.getValues().feeDetailsRemark}
                              value={form.getValues().feeDetailsRemark}
                              readOnly
                              
                            />
                          </div>
                        }
                        <FormMessage className="text-[11px]" />
                      </div>
                    </FormControl>
                    <FormControl>
                      <div className="h-auto">
                        {(form.getValues().enquiryRemark == "" || form.getValues().enquiryRemark) && remark != "enquiryRemark" &&
                          <div className='mt-4'>
                            <FormLabel className="font-inter font-semibold text-[12px] text-primary">
                              {"Enquiry Remaks"}
                            </FormLabel>
                            <Input
                            className='hover:cursor-pointer hover:underline'
                              value={form.getValues().enquiryRemark || ""}
                              title={form.getValues().enquiryRemark || ""}
                              
                              readOnly
                            />
                          </div>
                        }
                        <FormMessage className="text-[11px]" />
                      </div>
                    </FormControl>
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

export default FilledByCollegeSection;
