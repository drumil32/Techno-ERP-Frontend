import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { academicDetailsArraySchema, academicDetailSchema } from '../schema/schema';
import TagInput from '../stage-1/tag-input';
import { handlePercentageInputChange, handleNumericInputChange } from '@/lib/utils';
import { formSchemaStep3 } from './enquiry-form-stage-3';
import { EducationLevel } from '@/types/enum';

interface AcademicDetailsSectionInterface {
  form: UseFormReturn<z.infer<typeof formSchemaStep3>>;
  commonFormItemClass: string;
  commonFieldClass: string;
  isViewable?: boolean;
}

const AcademicDetailsSectionStage3: React.FC<AcademicDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass,
  isViewable
}) => {
  const [isValid, setIsValid] = useState(false);
  const [validationLog, setValidationLog] = useState<string[]>([]);

  const checkValidity = () => {
    const academicDetails = form.getValues().academicDetails;

    if (!academicDetails || academicDetails.length === 0) {
      setIsValid(false);
      setValidationLog((prev) => [...prev, 'No academic details found - validation failed']);
      return;
    }

    const validationResults = academicDetails.map((detail, index) => {
      const result = academicDetailSchema.safeParse(detail);
      if (!result.success) {
        return {
          index,
          valid: false,
          errors: result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        };
      }
      return { index, valid: true, errors: [] };
    });

    const allValid = validationResults.every((r) => r.valid);
    setIsValid(allValid);

    const newLogs = [
      `Validation check at ${new Date().toLocaleTimeString()}`,
      ...validationResults.flatMap((r) =>
        r.valid
          ? [`Item ${r.index + 1}: Valid`]
          : [`Item ${r.index + 1}: Invalid - ${r.errors.join(', ')}`]
      ),
      `Overall validation: ${allValid ? 'PASSED' : 'FAILED'}`
    ];

    setValidationLog((prev) => [...prev, ...newLogs]);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && name.startsWith('academicDetails')) {
        checkValidity();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    checkValidity();
  }, []);

  useEffect(() => {
    if (validationLog.length > 0) {
      console.log('Validation Log:\n' + validationLog.join('\n'));
    }
  }, [validationLog]);

  const prevValuesRef = useRef<z.infer<typeof academicDetailsArraySchema>>([]);

  const educationLevels = [EducationLevel.Tenth, EducationLevel.Twelfth, EducationLevel.Graduation];

  useEffect(() => {
    const subscription = form.watch((values) => {
      const prevValues = prevValuesRef.current;

      values.academicDetails?.forEach((entry, index) => {
        if (entry) {
          const allFilled =
            entry.schoolCollegeName &&
            entry.universityBoardName &&
            entry.passingYear &&
            entry.percentageObtained &&
            (entry.subjects || entry.subjects === undefined);

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
            <div className="flex items-center w-full">
              <h3 className="font-inter text-[16px] font-semibold">Academic Details</h3>
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
            <div className="grid grid-row-3 gap-y-6 bg-white p-4 rounded-[10px]">
              {/* 10th */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter text-[16px] font-semibold text-primary">10th</h4>

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
                <h4 className="font-inter  text-[16px] font-semibold text-primary">12th</h4>

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
                <h4 className="font-inter  text-[16px] font-semibold text-primary">Graduation</h4>

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

export default AcademicDetailsSectionStage3;
