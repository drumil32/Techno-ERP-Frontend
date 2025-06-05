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
}

const FilledByCollegeSection: React.FC<FilledByCollegeSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass,
  isViewable
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

  const telecallers: { _id: string; name: string }[] = Array.isArray(results[0].data)
    ? results[0].data.map((name: string) => ({ _id: name, name }))
    : [];

  const counsellors: { _id: string; name: string }[] = Array.isArray(results[1].data)
    ? results[1].data.map((name: string) => ({ _id: name, name }))
    : [];

  const references: { _id: string; name: string }[] = Object.values(AdmissionReference).map(
    (ref) => ({ _id: ref, name: ref })
  );

  useEffect(() => {
    // console.log('Telecallers:', telecallers);
    // console.log('Counsellors:', counsellors);
    // console.log('Form Values:', form.getValues());
    // console.log('Form Errors:', form.formState.errors);
    // console.log("api is not calling")
  }, [form]);

  return (
    <Accordion type="single" collapsible defaultValue="student-details">
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">To be filled by College</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-[32px] bg-white p-4 rounded-[10px]">
            <MultiSelectPopoverCheckbox
                form={form}
                name="references"
                disabled={isViewable}
                label="References"
                options={references}
                placeholder="Select References"
                className={commonFormItemClass}
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
                key="remarks"
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-2 col-start-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      Remarks
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={commonFieldClass}
                        placeholder="Optional"
                      />
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

export default FilledByCollegeSection;
