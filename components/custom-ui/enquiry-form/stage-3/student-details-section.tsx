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
import { toPascal } from '@/lib/utils';
import { AdmissionMode, Gender } from '@/types/enum';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { enquirySchema } from '../schema/schema';
import { formSchemaStep3 } from './enquiry-form-stage-3';
import { DatePicker } from '@/components/ui/date-picker';
import { useQuery } from '@tanstack/react-query';
import { fixCourseCodeDropdown } from '../stage-1/helpers/fetch-data';
import { Checkbox } from '@/components/ui/checkbox';

interface StudentDetailsFormPropInterface {
  form: UseFormReturn<z.infer<typeof formSchemaStep3>>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
}

const StudentDetailsSchema = enquirySchema;

const StudentDetailsSectionStage3: React.FC<StudentDetailsFormPropInterface> = ({
  form,
  commonFormItemClass,
  commonFieldClass,
  isViewable
}: StudentDetailsFormPropInterface) => {
  const [isValid, setIsValid] = useState(false);

  const checkValidity = () => {
    const studentDetails = {
      admissionMode: form.getValues('admissionMode'),
      // dateOfAdmission: form.getValues('dateOfAdmission'),
      studentName: form.getValues('studentName'),
      studentPhoneNumber: form.getValues('studentPhoneNumber'),
      // emailId: form.getValues('emailId'),
      fatherName: form.getValues('fatherName'),
      fatherPhoneNumber: form.getValues('fatherPhoneNumber'),
      fatherOccupation: form.getValues('fatherOccupation'),
      motherName: form.getValues('motherName'),
      motherPhoneNumber: form.getValues('motherPhoneNumber'),
      motherOccupation: form.getValues('motherOccupation'),
      dateOfBirth: form.getValues('dateOfBirth'),
      category: form.getValues('category'),
      gender: form.getValues('gender'),
      course: form.getValues('course')
    };

    const result = formSchemaStep3
      .pick({
        admissionMode: true,
        // dateOfAdmission: true,
        studentName: true,
        studentPhoneNumber: true,
        // emailId: true,
        fatherName: true,
        fatherPhoneNumber: true,
        fatherOccupation: true,
        motherName: true,
        motherPhoneNumber: true,
        motherOccupation: true,
        dateOfBirth: true,
        category: true,
        gender: true,
        course: true
      })
      .safeParse(studentDetails);

    setIsValid(result.success);
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      checkValidity();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    checkValidity();
  }, []);

  const fixCoursesQuery = useQuery({
    queryKey: ['courses'],
    queryFn: fixCourseCodeDropdown
  });
  const courses = Array.isArray(fixCoursesQuery.data) ? fixCoursesQuery.data : [];

  return (
    <Accordion type="single" collapsible defaultValue="student-details">
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
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1  gap-x-[32px] bg-white p-4 rounded-[10px]">
              <FormField
                key="admissionMode"
                control={form.control}
                name="admissionMode"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Admission Mode
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isViewable}
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

              {/* <DatePicker
                control={form.control}
                name="dateOfAdmission"
                disabled={isViewable}
                label="Date of Admission"
                placeholder="Pick a Date"
                showYearMonthDropdowns={true}
                formItemClassName={`${commonFormItemClass} border-none`}
                labelClassName="font-inter font-semibold text-[14px] text-primary"
              /> */}
              <FormField
                key="course"
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} `}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Course
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select disabled={true} onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue className="text-[#9D9D9D]" placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(courses).map((course) => (
                            <SelectItem key={course.courseCode} value={course.courseCode}>
                              {course.courseName}
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
                key="studentName"
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} `}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Student's Phone Number
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                      Email ID
                      
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
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
                disabled={isViewable}
                formItemClassName={`${commonFormItemClass} border-none`}
                placeholder="Select Date of Birth"
                showYearMonthDropdowns={true}
                labelClassName="font-inter font-semibold text-[14px] text-primary"
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
                key="gender"
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                      Gender
                      <span className="text-red-500 pl-0">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isViewable}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
              <div>
                <FormField
                  control={form.control}
                  name="isFeeApplicable"
                  render={({ field }) => (
                    <>
                      <FormLabel className="font-inter font-semibold text-[14px] text-primary gap-x-1">
                        Fees Applicable <span className="text-red-500 pl-0">*</span>
                      </FormLabel>
                      <FormItem className="h-[36px] z-50 w-full  rounded-md border">
                        <Select
                          onValueChange={(value) => field.onChange(value === 'true')}
                          value={field.value ? 'true' : 'false'}
                          disabled={isViewable}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger className="h-[36px]">
                              <SelectValue placeholder="Select fee type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="">
                            <SelectItem value="false">Zero Fees</SelectItem>
                            <SelectItem value="true">Non-Zero Fees</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    </>
                  )}
                />
              </div>
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default StudentDetailsSectionStage3;
