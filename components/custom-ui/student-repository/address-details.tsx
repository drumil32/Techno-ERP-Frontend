import React, { useState } from 'react';
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
import { FieldValues, UseFormReturn } from 'react-hook-form';
import {
  Countries,
  Districts,
  StatesOfIndia
} from '@/types/enum';
import { toPascal } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, Pencil } from 'lucide-react';

interface AddressDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const AddressDetailsSection: React.FC<AddressDetailsFormPropInterface> = ({
  form,
  commonFormItemClass,
  commonFieldClass
}) => {
  // State to track edit mode
  const [isEditing, setIsEditing] = useState(false);

  const formData = form.getValues();

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // Display field component
  const DisplayField: React.FC<{ label: string; value: string | null }> = ({ label, value }) => (
    <div className={commonFormItemClass}>
      <div className="font-inter font-normal text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium py-2">{value || '-'}</div>
      <div className="h-5"></div>
    </div>
  );

  return (
    <Accordion type="single" collapsible defaultValue="address-details">
      <AccordionItem value="address-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Address Details</h3>
            <Button
              variant="outline"
              className={`rounded-[10px] border font-inter font-medium text-[12px] px-2 py-1 h-fit bg-transparent ${isEditing ? 'text-green-600 border-green-600 hover:text-green-600' : 'text-[#5B31D1] border-[#5B31D1] hover:text-[#5B31D1]'}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent accordion from toggling
                toggleEdit();
              }}
            >
              {isEditing ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </>
              ) : (
                <>
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </>
              )}
            </Button>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-y-1 sm:grid-cols-1 gap-x-[32px] bg-white p-4 rounded-[10px]">
              {isEditing ? (
                <>
                  {/* Address Line 1 */}
                  <FormField
                    control={form.control}
                    name="address.addressLine1"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
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

                {/* Address Line 2 */}
                  <FormField
                    control={form.control}
                    name="address.addressLine2"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
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

                {/* PinCode */}
                  <FormField
                    control={form.control}
                    name="address.pincode"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
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

                {/* District */}
                  <FormField
                    control={form.control}
                    name="address.district"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          District
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
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
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                {/* State */}
                  <FormField
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          State
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
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

                {/* Country */}
                  <FormField
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Country
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                </>
              ) : (
                <>
                    <DisplayField label="Address Line 1" value={formData.address?.addressLine1} />
                    <DisplayField label="Address Line 2" value={formData.address?.addressLine2} />
                    <DisplayField label="Pincode" value={formData.address?.pincode} />
                    <DisplayField label="District" value={toPascal(formData.address?.district)} />
                    <DisplayField label="State" value={toPascal(formData.address?.state)} />
                    <DisplayField label="Country" value={toPascal(formData.address?.country)} />
                </>
              )}
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AddressDetailsSection;
