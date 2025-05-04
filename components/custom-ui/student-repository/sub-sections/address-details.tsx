// React and React Hook Form imports
import React, { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

// UI component imports
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

// Icon imports
import { Check, Pencil } from 'lucide-react';

// Utility and type imports
import { toPascal } from '@/lib/utils';
import { Countries, Districts, StatesOfIndia } from '@/types/enum';
import { DisplayField } from '../display-field';

interface AddressDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
  handleSave: () => void;
}

const AddressDetailsSection: React.FC<AddressDetailsFormPropInterface> = ({
  form,
  commonFormItemClass,
  commonFieldClass,
  handleSave
}) => {
  // State to track edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const formData = form.getValues();

  // Fields to display when not in edit mode
  const displayFields = [
    { label: 'Address Line 1', value: formData.address?.addressLine1 },
    { label: 'Address Line 2', value: formData.address?.addressLine2 },
    { label: 'Pincode', value: formData.address?.pincode },
    { label: 'District', value: toPascal(formData.address?.district) },
    { label: 'State', value: toPascal(formData.address?.state) },
    { label: 'Country', value: toPascal(formData.address?.country) }
  ];

  return (
    <Accordion type="single" collapsible defaultValue="address-details">
      <AccordionItem value="address-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Address Details</h3>
            <span
              className={`cursor-pointer rounded-[10px] border font-inter font-medium text-[12px] px-3 py-1 gap-2 h-fit bg-transparent inline-flex items-center ${
                isEditing
                  ? 'text-green-600 border-green-600 hover:text-green-600'
                  : 'text-[#5B31D1] border-[#5B31D1] hover:text-[#5B31D1]'
              }`}
            >
              {isEditing ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleSave();
                    toggleEdit();
                  }}
                  className="flex items-center"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </span>
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation(); 
                    toggleEdit();
                  }}
                  className="flex items-center"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </span>
              )}
            </span>
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
                displayFields.map((field, index) => (
                  <DisplayField key={index} label={field.label} value={field.value} />
                ))
              )}
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AddressDetailsSection;
