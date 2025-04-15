// React and Hooks
import React from 'react';
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
}

const FilledByCollegeSection: React.FC<FilledByCollegeSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass
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

  const telecallers: UserRoleInterface[] = Array.isArray(results[0].data) ? results[0].data : [];
  const counsellors: UserRoleInterface[] = Array.isArray(results[1].data) ? results[1].data : [];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">To be filled by College</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <MultiSelectPopoverCheckbox
                form={form}
                name="counsellor"
                label="Counsellor’s Name"
                options={counsellors}
                placeholder="Select Counsellor's Name"
                className="col-span-1"
              />
              
              <MultiSelectPopoverCheckbox
                form={form}
                name="telecaller"
                label="Telecaller’s Name"
                options={telecallers}
                placeholder="Select Telecaller's Name"
                className="col-span-1"
              />

              <FormField
                key="remarks"
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
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
                    <FormMessage />
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
