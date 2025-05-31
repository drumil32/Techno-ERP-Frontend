import React, { useEffect, useState } from 'react';
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
import { z } from 'zod';
import { Countries, Districts, StatesOfIndia } from '@/types/enum';
import { formSchemaStep3 } from './enquiry-form-stage-3';
import { districtDropdown } from '../stage-1/helpers/fetch-data';
import { useQuery } from '@tanstack/react-query';
import { fixCourseDropdown } from '@/components/layout/admin-tracker/helpers/fetch-data';
import { MultiSelectCustomDropdown } from '../../common/multi-select-custom-editable';
import { MultiSelectDropdown } from '../../multi-select/mutli-select';

interface AddressDetailsSectionInterface {
  form: UseFormReturn<z.infer<typeof formSchemaStep3>>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
}

const AddressDetailsSectionStage3: React.FC<AddressDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass,
  isViewable
}) => {
  const [isValid, setIsValid] = useState(false);

  const checkValidity = () => {
    const addressDetails = form.getValues().address;

    if (!addressDetails) {
      setIsValid(false);
      return;
    }

    const result = formSchemaStep3
      .pick({
        address: true
      })
      .safeParse({ address: addressDetails });

    setIsValid(result.success);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      checkValidity();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    checkValidity();
  }, []);

  const hasAddressErrors =
    !!form.formState.errors.address && Object.keys(form.formState.errors.address).length > 0;
  const districtsQuery = useQuery({
    queryKey: ['districts'],
    queryFn: districtDropdown
  });
  const districts = Array.isArray(districtsQuery.data) ? districtsQuery.data : [];

  return (
    <Accordion type="single" collapsible defaultValue="address-details">
      <AccordionItem value="address-details">
        <div className="space-y-2">
          <AccordionTrigger
            className={`w-full items-center ${hasAddressErrors ? 'text-red-500' : ''}`}
          >
            <div className="flex items-center w-full">
              <h3 className="font-inter text-[16px] font-semibold">Address details</h3>
              {isValid && (
                <svg
                  className="ml-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    fill="#22C55E"
                  />
                  <path
                    d="M8 12L11 15L16 9"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                control={form.control}
                name="address.addressLine1"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Address Line 1<span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
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
                control={form.control}
                name="address.addressLine2"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Address Line 2<span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
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
                control={form.control}
                name="address.pincode"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-start-1 col-span-1`}>
                    <FormLabel className="font-inter font-normal col-span-1 text-[12px] text-[#666666] gap-x-1">
                      Pincode
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={commonFieldClass}
                        placeholder="Enter pincode"
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
                  <FormItem className={`${commonFormItemClass} col-start-2 col-span-1`}>
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
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem className={`{commonFormItemClass} col-start-1 col-span-1`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      State
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isViewable}
                        onValueChange={field.onChange}
                        defaultValue={StatesOfIndia.UttarPradesh}
                        value={field.value}
                      >
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select state" />
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
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className={commonFormItemClass}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Country
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isViewable}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select country" />
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

export default AddressDetailsSectionStage3;
