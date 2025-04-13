import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Countries, Districts, StatesOfIndia } from '@/types/enum';
import { formSchemaStep3 } from './enquiry-form-stage-3';

interface AddressDetailsSectionInterface {
  form: UseFormReturn<z.infer<typeof formSchemaStep3>>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const AddressDetailsSectionStage3: React.FC<AddressDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass
}) => {
  const [isValid, setIsValid] = useState(false);

  const checkValidity = () => {
    const addressDetails = form.getValues().address;

    if (!addressDetails) {
      setIsValid(false);
      return;
    }

    const result = formSchemaStep3.pick({
      address: true
    }).safeParse({ address: addressDetails });

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

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="address-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
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
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Address Line 1
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} placeholder="Enter Address Line 1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.addressLine2"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Address Line 2
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} placeholder="Enter Address Line 2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.pincode"
                render={({ field }) => (
                  <FormItem className={commonFormItemClass}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Pincode
                    </FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ''} className={commonFieldClass} placeholder="Enter pincode" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem className={commonFormItemClass}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      District
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={commonFieldClass}>
                          <SelectValue placeholder="Select district" />
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
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem className={commonFormItemClass}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      State
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={commonFieldClass}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem className={commonFormItemClass}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={commonFieldClass}>
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

export default AddressDetailsSectionStage3;