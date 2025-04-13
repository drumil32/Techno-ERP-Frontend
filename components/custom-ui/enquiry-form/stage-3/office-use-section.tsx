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
interface OfficeUseSectionInterface {
  form: UseFormReturn<any>;
}
const OfficeUseSection: React.FC<OfficeUseSectionInterface> = ({ form }) => {
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
  const telecallersData = Array.isArray(results[0].data) ? results[0].data : [];

  const counsellorsData = Array.isArray(results[1].data) ? results[1].data : [];

  const counsellorOptions: MultiSelectOption[] = useMemo(() => {
    return (Array.isArray(counsellorsData) ? counsellorsData : [])
      .map((c: any) => ({ value: c._id, label: c.name }))
      .filter(Boolean);
  }, [counsellorsData]);

  const telecallerOptions: MultiSelectOption[] = useMemo(() => {
    return (Array.isArray(telecallersData) ? telecallersData : [])
      .map((t: any) => ({ value: t._id, label: t.name }))
      .filter(Boolean);
  }, [telecallersData]);

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
                control={form.control}
                name="counsellor"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="font-inter font-normal text-sm text-gray-600">
                      Counsellor’s Name(s)
                    </FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        options={counsellorOptions}
                        selected={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Select Counsellor(s)"
                        searchPlaceholder="Search Counsellors..."
                        isLoading={results[1].isLoading}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage className="text-xs" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telecaller"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="font-inter font-normal text-sm text-gray-600">
                      Telecaller’s Name(s)
                    </FormLabel>
                    <FormControl>
                      <MultiSelectDropdown
                        options={telecallerOptions}
                        selected={field.value ?? []}
                        onChange={field.onChange}
                        placeholder="Select Telecaller(s)"
                        searchPlaceholder="Search Telecallers..."
                        isLoading={results[0].isLoading}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage className="text-xs" />
                    </div>
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
