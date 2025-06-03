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
import { cityDropdown } from '@/components/layout/admin-tracker/helpers/fetch-data';
import { districtDropdown } from './helpers/fetch-data';
import { useQuery } from '@tanstack/react-query';
import { MultiSelectCustomDropdown } from '../../common/multi-select-custom-editable';

interface AddressDetailsSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
}

const AddressDetailsSection: React.FC<AddressDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass,
  isViewable
}) => {
  const hasAddressErrors =
    !!form.formState.errors.address && Object.keys(form.formState.errors.address).length > 0;
  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: districtDropdown
  });
  const districts = Array.isArray(districtsQuery.data) ? districtsQuery.data : [];

  return (
    <Accordion type="single" collapsible defaultValue="student-details">
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger
            className={`w-full items-center ${hasAddressErrors ? 'text-red-500' : ''}`}
          >
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">Address details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                key="addressLine1"
                control={form.control}
                name="address.addressLine1"
                render={({ field }) => (
                  <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Address Line 1<span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className=""
                        placeholder="Enter Address Line 1"
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="addressLine2"
                control={form.control}
                name="address.addressLine2"
                render={({ field }) => (
                  <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Address Line 2<span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className=""
                        placeholder="Enter Address Line 2"
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="pincode"
                control={form.control}
                name="address.pincode"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Pincode
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={`${commonFieldClass} w-full`}
                        placeholder="Enter the pin code"
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="district"
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary w-full gap-x-1">
                      District
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <MultiSelectCustomDropdown
                        disabled={isViewable}
                        form={form}
                        name="address.district"
                        options={Object.values(districts).map((district) => ({
                          _id: district,
                          name: district
                        }))}
                        placeholder="Select the district"
                        allowCustomInput={true}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                key="state"
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-start-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      State
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isViewable}
                      >
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the state" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(StatesOfIndia)
                            .sort((a, b) => a.localeCompare(b))
                            .map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
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
              />

              <FormField
                key="country"
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Country
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isViewable}
                      >
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

export default AddressDetailsSection;
