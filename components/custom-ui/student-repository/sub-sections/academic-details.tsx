// React and third-party libraries
import React, { useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// UI components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Pencil } from 'lucide-react';

// Utility functions and schemas
import { handleNumericInputChange, toPascal } from '@/lib/utils';
import { updateStudentDetailsRequestSchema } from '../helpers/schema';
import TagInput from '../../enquiry-form/stage-1/tag-input';

interface AcademicDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  form: UseFormReturn<z.infer<typeof updateStudentDetailsRequestSchema>>;
  commonFormItemClass: string;
  commonFieldClass: string;
  handleSave: () => void;
}

const AcademicDetailsSection: React.FC<AcademicDetailsFormPropInterface> = ({
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
            <h3 className="font-inter text-[16px] font-semibold">Academic Details</h3>
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
            <div className="grid grid-row-3 gap-y-6 bg-white p-4 rounded-[10px]">
              {/* 10th */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter text-[16px] font-semibold">10th</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-1 gap-x-[32px]">
                  {isEditing ? (
                    <FormField
                      key="academicDetails.0.schoolCollegeName"
                      control={form.control}
                      name="academicDetails.0.schoolCollegeName"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                            School/College Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value !== undefined ? String(field.value) : ''}
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
                  ) : (
                    <DisplayField
                      label="School/College Name"
                      value={
                        form.getValues('academicDetails.0.schoolCollegeName')?.toString() || null
                      }
                    />
                  )}

                  {isEditing ? (
                    <FormField
                      key="academicDetails.0.universityBoardName"
                      control={form.control}
                      name="academicDetails.0.universityBoardName"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
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
                  ) : (
                    <DisplayField
                      label="University/Board Name"
                      value={
                        form.getValues('academicDetails.0.universityBoardName')?.toString() || null
                      }
                    />
                  )}

                  <div className="flex flex-col col-span-1 col-start-1 ">
                    <div className={`flex flex-row gap-x-3`}>
                      {isEditing ? (
                        <FormField
                          key="academicDetails.0.passingYear"
                          control={form.control}
                          name="academicDetails.0.passingYear"
                          render={({ field }) => (
                            <FormItem className={`w-[36%]`}>
                              <FormLabel className="font-inter font-normal text-[12px] text-[#666666] w-full">
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
                            </FormItem>
                          )}
                        />
                      ) : (
                        <DisplayField
                          label="Passing Year"
                          value={
                            form.getValues('academicDetails.0.passingYear')?.toString() || null
                          }
                        />
                      )}

                      {isEditing ? (
                        <FormField
                          key="academicDetails.0.percentageObtained"
                          control={form.control}
                          name="academicDetails.0.percentageObtained"
                          render={({ field }) => (
                            <FormItem className="w-[64%]">
                              <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                                Percentage Obtained
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Out of 100%"
                                  inputMode="numeric"
                                  onChange={(e) => handleNumericInputChange(e, field.onChange)}
                                  value={field.value ?? ''}
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ) : (
                        <DisplayField
                          label="Percentage Obtained"
                          value={
                            form.getValues('academicDetails.0.percentageObtained')?.toString() ||
                            null
                          }
                        />
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[0]?.passingYear && (
                        <p className="text-[#E7000B]">
                          {
                            form?.formState?.errors?.academicDetails?.[0]?.percentageObtained
                              ?.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[0]?.percentageObtained && (
                        <p className="text-[#E7000B]">
                          {
                            form?.formState?.errors?.academicDetails?.[0]?.percentageObtained
                              .message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <FormField
                      key="academicDetails.0.subjects"
                      control={form.control}
                      name="academicDetails.0.subjects"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                            Subjects
                          </FormLabel>
                          <FormControl>
                            <Input
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
                  ) : (
                    <DisplayField
                      label="Subjects"
                      value={form.getValues('academicDetails.0.subjects') || null}
                    />
                  )}
                </div>
              </div>

              {/* 12th */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter  text-[16px] font-semibold">12th</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px]">
                  {isEditing ? (
                    <FormField
                      key="academicDetails.1.schoolCollegeName"
                      control={form.control}
                      name="academicDetails.1.schoolCollegeName"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
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
                  ) : (
                    <DisplayField
                      label="School/College Name"
                      value={
                        form.getValues('academicDetails.1.schoolCollegeName')?.toString() || null
                      }
                    />
                  )}

                  {isEditing ? (
                    <FormField
                      key="academicDetails.1.universityBoardName"
                      control={form.control}
                      name="academicDetails.1.universityBoardName"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
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
                  ) : (
                    <DisplayField
                      label="University/Board Name"
                      value={
                        form.getValues('academicDetails.1.universityBoardName')?.toString() || null
                      }
                    />
                  )}

                  <div className="flex flex-col col-span-1 col-start-1 ">
                    <div className={`flex flex-row gap-x-3`}>
                      {isEditing ? (
                        <FormField
                          key="academicDetails.1.passingYear"
                          control={form.control}
                          name="academicDetails.1.passingYear"
                          render={({ field }) => (
                            <FormItem className={`w-[36%]`}>
                              <FormLabel className="font-inter font-normal text-[12px] text-[#666666] w-full">
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
                            </FormItem>
                          )}
                        />
                      ) : (
                        <DisplayField
                          label="Passing Year"
                          value={
                            form.getValues('academicDetails.1.passingYear')?.toString() || null
                          }
                        />
                      )}

                      {isEditing ? (
                        <FormField
                          key="academicDetails.1.percentageObtained"
                          control={form.control}
                          name="academicDetails.1.percentageObtained"
                          render={({ field }) => (
                            <FormItem className="w-[64%]">
                              <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                                Percentage Obtained
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Out of 100%"
                                  inputMode="numeric"
                                  onChange={(e) => handleNumericInputChange(e, field.onChange)}
                                  value={field.value ?? ''}
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ) : (
                        <DisplayField
                          label="Percentage Obtained"
                          value={
                            form.getValues('academicDetails.1.percentageObtained')?.toString() ||
                            null
                          }
                        />
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[1]?.passingYear && (
                        <p className="text-[#E7000B]">
                          {form.formState.errors.academicDetails?.[1]?.passingYear.message}
                        </p>
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[1]?.percentageObtained && (
                        <p className="text-[#E7000B]">
                          {form.formState.errors.academicDetails?.[1]?.percentageObtained.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <FormField
                      key="academicDetails.1.subjects"
                      control={form.control}
                      name="academicDetails.1.subjects"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                            Subjects
                          </FormLabel>
                          <FormControl>
                            <Input
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
                  ) : (
                    <DisplayField
                      label="Subjects"
                      value={form.getValues('academicDetails.1.subjects') || null}
                    />
                  )}
                </div>
              </div>

              {/* Graduation */}
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter  text-[16px] font-semibold">Graduation</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px]">
                  {isEditing ? (
                    <FormField
                      key="academicDetails.2.schoolCollegeName"
                      control={form.control}
                      name="academicDetails.2.schoolCollegeName"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
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
                  ) : (
                    <DisplayField
                      label="School/College Name"
                      value={
                        form.getValues('academicDetails.2.schoolCollegeName')?.toString() || null
                      }
                    />
                  )}

                  {isEditing ? (
                    <FormField
                      key="academicDetails.2.universityBoardName"
                      control={form.control}
                      name="academicDetails.2.universityBoardName"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
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
                  ) : (
                    <DisplayField
                      label="University/Board Name"
                      value={
                        form.getValues('academicDetails.2.universityBoardName')?.toString() || null
                      }
                    />
                  )}

                  <div className="flex flex-col col-span-1 col-start-1 ">
                    <div className={`flex flex-row gap-x-3`}>
                      {isEditing ? (
                        <FormField
                          key="academicDetails.2.passingYear"
                          control={form.control}
                          name="academicDetails.2.passingYear"
                          render={({ field }) => (
                            <FormItem className={`w-[36%]`}>
                              <FormLabel className="font-inter font-normal text-[12px] text-[#666666] w-full">
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
                            </FormItem>
                          )}
                        />
                      ) : (
                        <DisplayField
                          label="Passing Year"
                          value={
                            form.getValues('academicDetails.2.passingYear')?.toString() || null
                          }
                        />
                      )}

                      {isEditing ? (
                        <FormField
                          key="academicDetails.2.percentageObtained"
                          control={form.control}
                          name="academicDetails.2.percentageObtained"
                          render={({ field }) => (
                            <FormItem className="w-[64%]">
                              <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                                Percentage Obtained
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Out of 100%"
                                  inputMode="numeric"
                                  onChange={(e) => handleNumericInputChange(e, field.onChange)}
                                  value={field.value ?? ''}
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      ) : (
                        <DisplayField
                          label="Percentage Obtained"
                          value={
                            form.getValues('academicDetails.2.percentageObtained')?.toString() ||
                            null
                          }
                        />
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[2]?.passingYear && (
                        <p className="text-[#E7000B]">
                          {form.formState.errors.academicDetails?.[2]?.passingYear.message}
                        </p>
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[2]?.percentageObtained && (
                        <p className="text-[#E7000B]">
                          {form.formState.errors.academicDetails?.[2]?.percentageObtained.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <FormField
                      key="academicDetails.2.subjects"
                      control={form.control}
                      name="academicDetails.2.subjects"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                            Subjects
                          </FormLabel>
                          <FormControl>
                            <Input
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
                  ) : (
                    <DisplayField
                      label="Subjects"
                      value={form.getValues('academicDetails.2.subjects') || null}
                    />
                  )}
                </div>
              </div>

              {/* Entrance Exam Details */}
              <div className="space-y-4">
                <h4 className="font-inter text-[16px] font-semibold">Entrance Exam</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px]">
                  {isEditing ? (
                    <FormField
                      key="entranceExamDetails.nameOfExamination"
                      control={form.control}
                      name="entranceExamDetails.nameOfExamination"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                            Name of Examination
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              className={commonFieldClass}
                              placeholder="Enter name of examination"
                            />
                          </FormControl>
                          <div className="h-[20px]">
                            <FormMessage className="text-[11px]" />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <DisplayField
                      label="Name of Examination"
                      value={
                        form.getValues('entranceExamDetails.nameOfExamination')?.toString() || null
                      }
                    />
                  )}

                  {isEditing ? (
                    <FormField
                      key="entranceExamDetails.rollNumber"
                      control={form.control}
                      name="entranceExamDetails.rollNumber"
                      render={({ field }) => (
                        <FormItem className={`${commonFormItemClass} col-span-1`}>
                          <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                            Roll Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ''}
                              className={commonFieldClass}
                              placeholder="Enter roll number"
                            />
                          </FormControl>
                          <div className="h-[20px]">
                            <FormMessage className="text-[11px]" />
                          </div>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <DisplayField
                      label="Roll Number"
                      value={form.getValues('entranceExamDetails.rollNumber')?.toString() || null}
                    />
                  )}

                  <div className="col-start-1 ">
                    {isEditing ? (
                      <FormField
                        key="entranceExamDetails.rank"
                        control={form.control}
                        name="entranceExamDetails.rank"
                        render={({ field }) => (
                          <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                              Rank
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value ?? ''}
                                className={commonFieldClass}
                                placeholder="Enter rank"
                                onChange={(e) => handleNumericInputChange(e, field.onChange)}
                              />
                            </FormControl>
                            <div className="h-[20px]">
                              <FormMessage className="text-[11px]" />
                            </div>
                          </FormItem>
                        )}
                      />
                    ) : (
                      <DisplayField
                        label="Rank"
                        value={form.getValues('entranceExamDetails.rank')?.toString() || null}
                      />
                    )}
                  </div>

                    <FormField
                      key="entranceExamDetails.qualified"
                      control={form.control}
                      name="entranceExamDetails.qualified"
                      render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                        Qualified
                        </FormLabel>
                        <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          className="h-4 w-4 border border-black"
                          disabled={!isEditing}
                        />
                        </FormControl>
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
