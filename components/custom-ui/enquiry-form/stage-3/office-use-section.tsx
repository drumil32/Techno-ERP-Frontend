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
import { Nationality, Qualification } from '../schema/schema';
import { AreaType, BloodGroup, Category, Religion, StatesOfIndia } from '@/types/enum';
import { MultiSelectDropdown, MultiSelectOption } from '../../multi-select/mutli-select';
import { useQueries } from '@tanstack/react-query';
import { getCounsellors, getTeleCallers } from '../stage-1/enquiry-form-api';
import { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
interface OfficeUseSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}
const OfficeUseSection: React.FC<OfficeUseSectionInterface> = ({
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
  const telecallers = Array.isArray(results[0].data) ? results[0].data : [];

  const counsellors = Array.isArray(results[1].data) ? results[1].data : [];

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="college-details"
      >
        <AccordionItem value="college-details" className="border-b-0">
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold"> For Office purpose only </h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent className="p-6 bg-white rounded-[10px]">
            <div className="w-2/3 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-4">
              {' '}
              {/* Added gap-y-4 for vertical spacing */}
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default OfficeUseSection;
