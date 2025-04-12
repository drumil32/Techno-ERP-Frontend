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
  commonFormItemClass,
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
              <FormField
                key="counsellor"
                control={form.control}
                name="counsellor"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Counsellor’s Name
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`${commonFieldClass} text-left bg-inherit w-full max-w-full truncate`}
                          >
                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap w-full font-normal text-[#666666]">
                              {field.value && field.value.length > 0
                                ? counsellors
                                    .filter((counsellor) => field.value.includes(counsellor._id))
                                    .map((counsellor) => counsellor.name)
                                    .join(', ')
                                : "Select Counsellor's Name"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-2 rounded-sm">
                          <div className="max-h-60 overflow-y-auto">
                            {counsellors?.map((counsellor) => (
                              <div
                                key={counsellor._id}
                                className="flex items-center space-x-2 space-y-1"
                              >
                                <Checkbox
                                  checked={field.value?.includes(counsellor._id)}
                                  onCheckedChange={(checked) => {
                                    const newValues = checked
                                      ? [...(field.value || []), counsellor._id]
                                      : field.value?.filter((id: string) => id !== counsellor._id);
                                    field.onChange(newValues);
                                  }}
                                  className="rounded-none"
                                />
                                <span className="text-[12px]">{counsellor.name}</span>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="telecaller"
                control={form.control}
                name="telecaller"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Telecaller’s Name
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`
                              ${commonFieldClass}
                              text-left bg-inherit w-full max-w-full truncate`}
                          >
                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap w-full font-normal text-[#666666]">
                              {field.value && field.value.length > 0
                                ? telecallers
                                    .filter((telecaller) => field.value.includes(telecaller._id))
                                    .map((telecaller) => telecaller.name)
                                    .join(', ')
                                : "Select Telecaller's Name"}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-2 rounded-sm">
                          <div className="max-h-60 overflow-y-auto">
                            {telecallers?.map((telecaller) => (
                              <div
                                key={telecaller._id}
                                className="flex items-center space-x-2 space-y-2"
                              >
                                <Checkbox
                                  checked={field.value?.includes(telecaller._id)}
                                  onCheckedChange={(checked) => {
                                    const newValues = checked
                                      ? [...(field.value || []), telecaller._id]
                                      : field.value?.filter((id: string) => id !== telecaller._id);
                                    field.onChange(newValues);
                                  }}
                                  className="rounded-none"
                                />
                                <span className="text-[12px]">{telecaller.name}</span>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
