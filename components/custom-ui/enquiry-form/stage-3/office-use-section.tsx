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
import { MultiSelectPopoverCheckbox } from '../../common/multi-select-popover-checkbox';
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
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default OfficeUseSection;
