import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  AdmissionReference
} from '@/types/enum';
import { useQueries } from '@tanstack/react-query';
import { UseFormReturn } from 'react-hook-form';
import { MultiSelectPopoverCheckbox } from '../../common/multi-select-popover-checkbox';
import { getCounsellors, getTeleCallers } from '../stage-1/enquiry-form-api';
interface OfficeUseSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
}
const OfficeUseSection: React.FC<OfficeUseSectionInterface> = ({
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

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      defaultValue="office-use-section"
    >
      <AccordionItem value="office-use-section" className="border-b-0">
        <AccordionTrigger className="w-full items-center">
          <h3 className="font-inter text-[16px] font-semibold"> To be filled by college </h3>
          <hr className="flex-1 border-t border-[#DADADA] ml-2" />
        </AccordionTrigger>

        <AccordionContent className="p-6 bg-white rounded-[10px]">
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-1">
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
                        disabled={isViewable}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select References" />
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
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                    Remarks
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Optional"
                      className="resize-none text-sm "
                      value={field.value ?? ''}
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
  );
};

export default OfficeUseSection;
