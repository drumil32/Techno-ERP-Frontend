// React and React Hook Form imports
import React, { useMemo, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

// UI components imports
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
import { DatePicker } from '@/components/ui/date-picker';

// Icon imports
import { Check, Pencil } from 'lucide-react';

// Utility and helper imports
import { AreaType, BloodGroup, Category, Gender, Religion, StatesOfIndia } from '@/types/enum';
import { toPascal } from '@/lib/utils';
import { Nationality } from '../../enquiry-form/schema/schema';
import { updateStudentDetailsRequestSchema } from '../helpers/schema';
import { DisplayField } from '../display-field';
import { z } from 'zod';
import { getDisplayFields } from '../helpers/helper';

const formSchema = updateStudentDetailsRequestSchema.extend({
  studentID: z.string().optional(),
  formNo: z.string().optional()
});
interface PersonalDetailsFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  commonFormItemClass: string;
  commonFieldClass: string;
  handleSave: () => void;
}

const PersonalDetailsSection: React.FC<PersonalDetailsFormProps> = ({
  form,
  commonFormItemClass,
  commonFieldClass,
  handleSave
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const formData = form.getValues();

  const displayFields = useMemo(() => getDisplayFields(formData), [formData]);

  return (
    <Accordion type="single" collapsible defaultValue="personal-details">
      <AccordionItem value="personal-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Personal Details</h3>
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
                  {/* Student Name */}
                  <FormField
                    key="studentName"
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-start-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Student Name
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter the student name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Student Phone Number */}
                  <FormField
                    key="studentPhoneNumber"
                    control={form.control}
                    name="studentPhoneNumber"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Student Phone Number
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter the student phone number"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Email Id */}
                  <FormField
                    key="emailId"
                    control={form.control}
                    name="emailId"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Email ID
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter the email ID"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Student ID */}
                  <FormField
                    key="studentID"
                    control={form.control}
                    disabled={true}
                    name="studentID"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Student ID
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter the student ID"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Form No. */}
                  <FormField
                    disabled={true}
                    key="formNo"
                    control={form.control}
                    name="formNo"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Form No.
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter the form number"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Father Name */}
                  <FormField
                    key="fatherName"
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Father's Name
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter father's name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Father PhoneNumber */}
                  <FormField
                    key="fatherPhoneNumber"
                    control={form.control}
                    name="fatherPhoneNumber"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Father's Phone Number
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter father's phone number"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Father Occupation */}
                  <FormField
                    key="fatherOccupation"
                    control={form.control}
                    name="fatherOccupation"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Father's Occupation
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter father's occupation"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Mother Name */}
                  <FormField
                    key="motherName"
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Mother's Name
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter mother's name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Mother PhoneNumber */}
                  <FormField
                    key="motherPhoneNumber"
                    control={form.control}
                    name="motherPhoneNumber"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Mother's Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter mother's phone number"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Mother Occupation */}
                  <FormField
                    key="motherOccupation"
                    control={form.control}
                    name="motherOccupation"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Mother's Occupation
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter mother's occupation"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Gender */}
                  <FormField
                    key="gender"
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Gender
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue className="text-[#9D9D9D]" placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Gender).map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {toPascal(gender)}
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
                  {/* Date of Birth */}
                  <DatePicker
                    control={form.control}
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="Select Date of Birth"
                    formItemClassName={commonFormItemClass}
                    showYearMonthDropdowns={true}
                    labelClassName="font-inter font-normal text-[12px] text-[#666666]"
                    calendarProps={{
                      disabled: (date) => {
                        const today = new Date();
                        return date >= new Date(today.setHours(0, 0, 0, 0));
                      }
                    }}
                    defaultMonth={new Date(new Date().getFullYear() - 10, 0, 1)}
                    isRequired={true}
                  />

                  {/* Religion */}
                  <FormField
                    key="religion"
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Religion
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue placeholder="Select the religion" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Religion).map((religion) => (
                                <SelectItem key={religion} value={religion}>
                                  {religion}
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
                  {/* Category */}
                  <FormField
                    key="category"
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Category
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue
                                className="text-[#9D9D9D]"
                                placeholder="Select category"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Category).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
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
                  {/* Blood Group */}
                  <FormField
                    key="bloodGroup"
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Blood Group
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue placeholder="Select the blood group" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(BloodGroup).map((bloodGroup) => (
                                <SelectItem key={bloodGroup} value={bloodGroup}>
                                  {bloodGroup}
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
                  {/* Aadhar Number */}
                  <FormField
                    key="aadharNumber"
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1 `}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Aadhaar Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter the Aadhaar number"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* State of Domicile */}
                  <FormField
                    key="stateOfDomicile"
                    control={form.control}
                    name="stateOfDomicile"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          State Of Domicile
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
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                  {/* Area Type */}
                  <FormField
                    key="areaType"
                    control={form.control}
                    name="areaType"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Area Type
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue placeholder="Select the area type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(AreaType).map((area) => (
                                <SelectItem key={area} value={area}>
                                  {area}
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
                  {/* Nationality */}
                  <FormField
                    key="nationality"
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Nationality
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue placeholder="Enter the nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Nationality).map((nationality) => (
                                <SelectItem key={nationality} value={nationality}>
                                  {nationality}
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
                displayFields.map(({ label, value }) => (
                  <DisplayField key={label} label={label} value={value ?? null} />
                ))
              )}
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default PersonalDetailsSection;
