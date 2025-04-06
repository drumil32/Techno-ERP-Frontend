import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarDaysIcon } from 'lucide-react';
import { toPascal } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AdmissionMode,
  AdmissionReference,
  Category,
  Course,
  CourseNameMapper,
  Gender
} from '@/types/enum';
import { FieldErrors, FieldValue, FieldValues, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { enquiryStep3UpdateRequestSchema } from '../schema/schema';

interface StudentDetailsFormPropInterface {
  form: UseFormReturn<z.infer<typeof enquiryStep3UpdateRequestSchema>>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const StudentDetailsSectionStage3: React.FC<StudentDetailsFormPropInterface> = ({
  form,
  commonFormItemClass,
  commonFieldClass
}) => {
  const [isValid, setIsValid] = useState(false);

  const checkValidity = () => {
    const requiredFields = [
      'admissionMode',
      'dateOfAdmission',
      'studentName',
      'studentPhoneNumber',
      'emailId',
      'fatherName',
      'fatherPhoneNumber',
      'fatherOccupation',
      'motherName',
      'motherPhoneNumber',
      'motherOccupation',
      'dateOfBirth',
      'category',
      'gender',
      'course',
      'reference'
    ];



    const allFieldsValid = requiredFields.every(field => {
      const value = form.getValues(field);
      return value !== undefined && value !== null && value !== '';
    });

    const sectionErrors = [
      'admissionMode',
      'dateOfAdmission',
      'studentName',
      'studentPhoneNumber',
      'emailId',
      'fatherName',
      'fatherPhoneNumber',
      'fatherOccupation',
      'motherName',
      'motherPhoneNumber',
      'motherOccupation',
      'dateOfBirth',
      'category',
      'gender',
      'course',
      'reference'
    ].some(field => form.formState.errors[field]);

    return allFieldsValid && !sectionErrors;
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsValid(checkValidity());
    });

    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            <div className="flex items-center w-full">
              <h3 className="font-inter text-[16px] font-semibold">Student Details</h3>
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
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6  gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                key="admissionMode"
                control={form.control}
                name="admissionMode"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Admission Mode
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue
                            className="text-[#9D9D9D]"
                            placeholder="Select Admission Mode"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AdmissionMode).map((mode) => (
                            <SelectItem key={mode} value={mode}>
                              {toPascal(mode)}
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
                key="dateOfAdmission"
                control={form.control}
                name="dateOfAdmission"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} border-none`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Date of Admission
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`${commonFieldClass} justify-between bg-inherit border-none shadow-none font-normal`}
                          >
                            <span className={!field.value ? 'text-[#9D9D9D]' : ''}>
                              {field.value ? field.value : 'Select Date'}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : new Date()}
                            onSelect={(date) => {
                              if (date) {
                                const formattedDate = format(date, 'dd/MM/yyyy');
                                field.onChange(formattedDate);
                              } else {
                                field.onChange('');
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="studentName"
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Student Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter the student name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="studentPhoneNumber"
                control={form.control}
                name="studentPhoneNumber"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Student's Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter the student phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="emailId"
                control={form.control}
                name="emailId"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Email ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter the email ID"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="fatherName"
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Father's Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter father's name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="fatherPhoneNumber"
                control={form.control}
                name="fatherPhoneNumber"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Father's Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter father's phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="fatherOccupation"
                control={form.control}
                name="fatherOccupation"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Father's Occupation
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter father's occupation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="motherName"
                control={form.control}
                name="motherName"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Mother's Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter mother's name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="motherPhoneNumber"
                control={form.control}
                name="motherPhoneNumber"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Mother's Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter mother's phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="motherOccupation"
                control={form.control}
                name="motherOccupation"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Mother's Occupation
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className={commonFieldClass}
                        placeholder="Enter mother's occupation"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="dateOfBirth"
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`${commonFieldClass} justify-between bg-inherit`}
                          >
                            <span className={!field.value ? 'text-[#9D9D9D]' : ''}>
                              {field.value ? field.value : 'Select Date'}
                            </span>
                            <CalendarDaysIcon size={16} className="ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const formattedDate = format(date, 'dd/MM/yyyy');
                                field.onChange(formattedDate);
                              } else {
                                field.onChange('');
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="category"
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Category).map((category) => (
                            <SelectItem key={category} value={category}>
                              {toPascal(category)}
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
                key="gender"
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Gender
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="course"
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Course
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Course).map((course) => (
                            <SelectItem key={course} value={course}>
                              {CourseNameMapper[course as Course]}
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
                key="reference"
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Reference
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select Reference" />
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

export default StudentDetailsSectionStage3;