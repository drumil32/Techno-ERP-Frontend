import React, { useEffect, useRef } from 'react';

// UI Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Form and Validation
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { academicDetailsArraySchema, enquiryStep1RequestSchema } from '../schema/schema';
import TagInput from './tag-input';
import { handleNumericInputChange, handlePercentageInputChange } from '@/lib/utils';
import { EducationLevel } from '@/types/enum';

// Form Schema
const formSchema = z.object(enquiryStep1RequestSchema.shape).extend({
  confirmation: z.boolean().refine((value) => value === true, {
    message: 'You must confirm to proceed.'
  })
});

interface AcademicDetailsSectionInterface {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
}

const AcademicDetailsSection: React.FC<AcademicDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass,
  isViewable
}) => {
  const prevValuesRef = useRef<z.infer<typeof academicDetailsArraySchema>>([]);

  const educationLevels = [EducationLevel.Tenth, EducationLevel.Twelfth, EducationLevel.Graduation];

  useEffect(() => {
    const subscription = form.watch((values) => {
      const prevValues = prevValuesRef.current;

      values.academicDetails?.forEach((entry, index) => {
        if (entry) {
          const allFilled =
            (entry.schoolCollegeName &&
              entry.universityBoardName &&
              entry.passingYear &&
              entry.percentageObtained &&
              entry.subjects) ||
            entry.subjects === undefined;

          const expectedLevel = educationLevels[index];


          if (
            allFilled &&
            entry.educationLevel !== expectedLevel &&
            prevValues[index]?.educationLevel !== expectedLevel
          ) {
            form.setValue(`academicDetails.${index}.educationLevel`, expectedLevel);
          }

          if (entry.educationLevel) {
            prevValues[index] = entry as z.infer<typeof academicDetailsArraySchema>[number];
          }
        }
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Accordion type="single" collapsible defaultValue="student-details">
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">Past Academic Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid grid-row-3 gap-y-6 bg-white p-4 rounded-[10px]">
              {/* 10th */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter text-[16px] text-primary font-semibold">10th</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-[32px]">
                  <FormField
                    key="academicDetails.0.schoolCollegeName"
                    control={form.control}
                    name="academicDetails.0.schoolCollegeName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          School/College Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter school/college Name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="academicDetails.0.universityBoardName"
                    control={form.control}
                    name="academicDetails.0.universityBoardName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          University/Board Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter university/board Name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col col-span-1 col-start-1 ">
                    <div className={`flex flex-row gap-x-3`}>
                      <FormField
                        key="academicDetails.0.passingYear"
                        control={form.control}
                        name="academicDetails.0.passingYear"
                        render={({ field }) => (
                          <FormItem className={`w-[36%] gap-y-0`}>
                            <FormLabel className="font-inter font-semibold text-[14px] text-primary w-full">
                              Passing Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Passing Year"
                                inputMode="numeric"
                                onChange={(e) => handleNumericInputChange(e, field.onChange)}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px] mt-0">
                                {form.formState.errors.academicDetails?.[0]?.passingYear && (
                                  <p className="text-[#E7000B]">
                                    {
                                      form.formState.errors.academicDetails?.[0]?.passingYear
                                        .message
                                    }
                                  </p>
                                )}
                              </FormMessage>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="academicDetails.0.percentageObtained"
                        control={form.control}
                        name="academicDetails.0.percentageObtained"
                        render={({ field }) => (
                          <FormItem className="w-[64%] gap-y-0">
                            <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                              Percentage Obtained
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Out of 100%"
                                inputMode="decimal"
                                onChange={(e) => handlePercentageInputChange(e, field.onChange)}
                                value={
                                  field.value !== undefined && field.value !== null
                                    ? field.value.toString()
                                    : ''
                                }
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9.]/.test(e.key) &&
                                    ![
                                      'Backspace',
                                      'Delete',
                                      'ArrowLeft',
                                      'ArrowRight',
                                      'Tab'
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }

                                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px]">
                                {form.formState.errors.academicDetails?.[0]?.percentageObtained && (
                                  <p className="text-[#E7000B]">
                                    {
                                      form.formState.errors.academicDetails?.[0]?.percentageObtained
                                        .message
                                    }
                                  </p>
                                )}
                              </FormMessage>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    key="academicDetails.0.subjects"
                    control={form.control}
                    name="academicDetails.0.subjects"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          Mention Subjects
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isViewable}
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter subjects"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 12th */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter text-primary text-[16px] font-semibold">12th</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-[32px]">
                  <FormField
                    key="academicDetails.1.schoolCollegeName"
                    control={form.control}
                    name="academicDetails.1.schoolCollegeName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          School/College Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter school/college Name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="academicDetails.1.universityBoardName"
                    control={form.control}
                    name="academicDetails.1.universityBoardName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          University/Board Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter university/board Nam e"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col col-span-1 col-start-1 ">
                    <div className={`flex flex-row gap-x-3`}>
                      <FormField
                        key="academicDetails.1.passingYear"
                        control={form.control}
                        name="academicDetails.1.passingYear"
                        render={({ field }) => (
                          <FormItem className={`w-[36%] gap-y-0`}>
                            <FormLabel className="font-inter font-semibold text-[14px] text-primary w-full">
                              Passing Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Passing Year"
                                inputMode="numeric"
                                onChange={(e) => handleNumericInputChange(e, field.onChange)}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px]">
                                {form.formState.errors.academicDetails?.[1]?.passingYear && (
                                  <p className="text-[#E7000B]">
                                    {
                                      form.formState.errors.academicDetails?.[1]?.passingYear
                                        .message
                                    }
                                  </p>
                                )}
                              </FormMessage>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="academicDetails.1.percentageObtained"
                        control={form.control}
                        name="academicDetails.1.percentageObtained"
                        render={({ field }) => (
                          <FormItem className="w-[64%] gap-y-0">
                            <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                              Percentage Obtained
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Out of 100%"
                                inputMode="decimal"
                                onChange={(e) => handlePercentageInputChange(e, field.onChange)}
                                value={
                                  field.value !== undefined && field.value !== null
                                    ? field.value.toString()
                                    : ''
                                }
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9.]/.test(e.key) &&
                                    ![
                                      'Backspace',
                                      'Delete',
                                      'ArrowLeft',
                                      'ArrowRight',
                                      'Tab'
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }

                                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px]">
                                {form.formState.errors.academicDetails?.[1]?.percentageObtained && (
                                  <p className="text-[#E7000B]">
                                    {
                                      form.formState.errors.academicDetails?.[1]?.percentageObtained
                                        .message
                                    }
                                  </p>
                                )}
                              </FormMessage>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    key="academicDetails.1.subjects"
                    control={form.control}
                    name="academicDetails.1.subjects"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          Mention Subjects
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isViewable}
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter subjects"
                          />
                          {/* <TagInput
                            disabled={isViewable}
                            value={field.value || []}
                            onChange={field.onChange}
                          /> */}
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Graduation */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter text-primary text-[16px] font-semibold">Graduation</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-[32px]">
                  <FormField
                    key="academicDetails.2.schoolCollegeName"
                    control={form.control}
                    name="academicDetails.2.schoolCollegeName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          School/College Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter school/college Name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="academicDetails.2.universityBoardName"
                    control={form.control}
                    name="academicDetails.2.universityBoardName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          University/Board Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter university/board Name"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col col-span-1 col-start-1 ">
                    <div className={`flex flex-row gap-x-3`}>
                      <FormField
                        key="academicDetails.2.passingYear"
                        control={form.control}
                        name="academicDetails.2.passingYear"
                        render={({ field }) => (
                          <FormItem className={`w-[36%] gap-y-0 `}>
                            <FormLabel className="font-inter font-semibold text-[14px] text-primary w-full">
                              Passing Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Passing Year"
                                inputMode="numeric"
                                onChange={(e) => handleNumericInputChange(e, field.onChange)}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px] mt-0">
                                {form.formState.errors.academicDetails?.[2]?.passingYear && (
                                  <p className="text-[#E7000B] text-xs">
                                    {
                                      form.formState.errors.academicDetails?.[2]?.passingYear
                                        .message
                                    }
                                  </p>
                                )}
                              </FormMessage>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        key="academicDetails.2.percentageObtained"
                        control={form.control}
                        name="academicDetails.2.percentageObtained"
                        render={({ field }) => (
                          <FormItem className="w-[64%] gap-y-0">
                            <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                              Percentage Obtained
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Out of 100%"
                                inputMode="decimal"
                                onChange={(e) => handlePercentageInputChange(e, field.onChange)}
                                value={
                                  field.value !== undefined && field.value !== null
                                    ? field.value.toString()
                                    : ''
                                }
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9.]/.test(e.key) &&
                                    ![
                                      'Backspace',
                                      'Delete',
                                      'ArrowLeft',
                                      'ArrowRight',
                                      'Tab'
                                    ].includes(e.key)
                                  ) {
                                    e.preventDefault();
                                  }

                                  if (e.key === '.' && e.currentTarget.value.includes('.')) {
                                    e.preventDefault();
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px]">
                                {form.formState.errors.academicDetails?.[2]?.percentageObtained && (
                                  <p className="text-[#E7000B]">
                                    {
                                      form.formState.errors.academicDetails?.[2]?.percentageObtained
                                        .message
                                    }
                                  </p>
                                )}
                              </FormMessage>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    key="academicDetails.2.subjects"
                    control={form.control}
                    name="academicDetails.2.subjects"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-semibold text-[14px] text-primary">
                          Mention Stream
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={isViewable}
                            {...field}
                            value={field.value ?? ''}
                            className={commonFieldClass}
                            placeholder="Enter stream"
                          />
                        </FormControl>
                        <div className="h-[20px]">
                          <FormMessage className="text-[11px]" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AcademicDetailsSection;
