import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';

interface SchoalarshipDetailsInterface {
  form: UseFormReturn<any>;
}
const ScholarshipDetailsSection: React.FC<SchoalarshipDetailsInterface> = ({ form }) => {
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
            <h3 className="font-inter text-[16px] font-semibold"> Scholarship Details Section</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent className="p-6 bg-white rounded-[10px]">
            <div className="w-2/3 grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-4">
              {' '}
              {/* Added gap-y-4 for vertical spacing */}
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel className="font-inter font-normal text-sm text-gray-600">
                      Remarks
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Optional"
                        className="resize-none text-sm h-11"
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
    </>
  );
};

export default ScholarshipDetailsSection;
