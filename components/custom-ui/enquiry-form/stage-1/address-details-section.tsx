import React from 'react';

// UI Components
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

// Types and Utilities
import { UseFormReturn } from 'react-hook-form';
import { Countries, Districts, StatesOfIndia } from '@/types/enum';

interface AddressDetailsSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const AddressDetailsSection: React.FC<AddressDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass
}) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">Address details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                key="addressLine1"
                control={form.control}
                name="address.addressLine1"
                render={({ field }) => (
                  <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Address Line 1
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className=""
                        placeholder="Enter Address Line 1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="addressLine2"
                control={form.control}
                name="address.addressLine2"
                render={({ field }) => (
                  <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Address Line 2
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className=""
                        placeholder="Enter Address Line 2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="pincode"
                control={form.control}
                name="address.pincode"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Pincode
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={commonFieldClass}
                        placeholder="Enter the pin code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="district"
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      District
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the district" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Districts).map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="state"
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      State
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the state" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(StatesOfIndia).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="country"
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the country" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Countries).map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
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
  );
};

export default AddressDetailsSection;
