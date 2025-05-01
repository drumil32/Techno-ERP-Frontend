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

// Icons
import { CalendarDaysIcon } from 'lucide-react';

// Utilities
import { toPascal } from '@/lib/utils';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

// Enums and Constants
import {
  AdmissionMode,
  AdmissionReference,
  Category,
  Course,
  CourseNameMapper,
  Gender
} from '@/types/enum';

// React and React Hook Form
import React from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { DatePicker } from '@/components/ui/date-picker';
import { useQuery } from '@tanstack/react-query';
import {
  cityDropdown,
  fixCityDropdown,
  fixCourseDropdown
} from '@/components/layout/admin-tracker/helpers/fetch-data';

// Props Interface
interface StudentDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const StudentDetailsSection: React.FC<StudentDetailsFormPropInterface> = ({
  form,
  commonFormItemClass,
  commonFieldClass
}) => {
  const fixCoursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: fixCourseDropdown
  });
  const courses = Array.isArray(fixCoursesQuery.data) ? fixCoursesQuery.data : [];

  return (
    <Accordion type="single" collapsible defaultValue="student-details">
      <AccordionItem value="student-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Student Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-y-1 sm:grid-cols-1 gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                key="admissionMode"
                control={form.control}
                name="admissionMode"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                      Admission Mode
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={AdmissionMode.OFFLINE}
                      >
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
                    <div className="h-[20px]">
                      <FormMessage className="text-[11px]" />
                    </div>
                  </FormItem>
                )}
              />

              <DatePicker
                control={form.control}
                name="dateOfEnquiry"
                formItemClassName={commonFormItemClass}
                label="Date of Enquiry"
                placeholder="Select Enquiry Date"
                showYearMonthDropdowns={true}
                defaultSelectedDate={new Date()}
                labelClassName="font-inter font-normal text-[12px] text-[#666666]"
              />

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
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select category" />
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

              <FormField
                key="course"
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                      Course
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(courses).map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
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

export default StudentDetailsSection;
