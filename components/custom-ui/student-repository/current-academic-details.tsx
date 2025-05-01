// React and React Hook Form imports
import React, { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

// UI components imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CustomDropdown } from '../custom-dropdown/custom-dropdown';

// Icon imports
import { Check, Pencil } from 'lucide-react';

// Schema and validation imports
import { enquirySchema } from '../enquiry-form/schema/schema';
import { z } from 'zod';

// Utility and helper imports
import { toPascal } from '@/lib/utils';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';

// Enum imports
import { CourseYear } from '@/types/enum';

// ---
const formschema = enquirySchema;
const academicYears = generateAcademicYearDropdown();
const SEMESTER_LIST = [1, 2, 3, 4];

interface CurrentAcademicDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  form: UseFormReturn<z.infer<typeof formschema>>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const CurrentAcademicDetailsSection: React.FC<CurrentAcademicDetailsFormPropInterface> = ({
  form,
  commonFormItemClass,
  commonFieldClass
}) => {
  // State to track edit mode
  const [isEditing, setIsEditing] = useState(false);

  const formData: z.infer<typeof formschema> = form.getValues();

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

  // Fields to display when not in edit mode
  const displayFields = [
    { label: 'Course Name', value: formData.courseName },
    { label: 'Course Code', value: formData.courseCode },
    { label: 'Department Name', value: formData.departmentName },
    { label: 'Current Year', value: toPascal(formData.currentYear) },
    { label: 'Current Semester', value: toPascal(formData.currentSemester) },
    { label: 'Academic Year', value: formData.academicYear || 'N/A' }
  ];

  return (
    <Accordion type="single" collapsible defaultValue="address-details">
      <AccordionItem value="address-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Academic Details</h3>
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
            <div className="grid grid-row-3 gap-y-6 bg-white p-4 rounded-[10px]">
              {isEditing ? (
                <>
                  {/* Course Name */}
                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Course Name<span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            placeholder="Enter Course Name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Course Code */}
                  <FormField
                    control={form.control}
                    name="courseCode"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Course Code<span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ''} placeholder="Course Code" />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Department Name */}
                  <FormField
                    control={form.control}
                    name="departmentName"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Department Name
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter department name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Current Year */}
                  <FormField
                    control={form.control}
                    name="currentYear"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Current Year
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(CourseYear).map((year) => (
                                <SelectItem key={year} value={year}>
                                  {year}
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

                  {/* Current Semester */}
                  <FormField
                    control={form.control}
                    name="currentSemester"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Current Semester
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                              {SEMESTER_LIST.map((semester) => (
                                <SelectItem key={semester} value={semester}>
                                  {semester}
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

                  {/* Academic Year */}
                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem className={commonFormItemClass}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666] gap-x-1">
                          Academic Year
                          <span className="text-red-500 pl-0">*</span>
                        </FormLabel>
                        <FormControl>
                          <CustomDropdown
                            options={academicYears}
                            selected={field.value || ''}
                            onChange={(val) => field.onChange(val)}
                            placeholder="Select academic year"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                displayFields.map(({ label, value }, index) => (
                  <DisplayField key={index} label={label} value={value} />
                ))
              )}
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default CurrentAcademicDetailsSection;
