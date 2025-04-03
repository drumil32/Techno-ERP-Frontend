import React, { useEffect, useState } from 'react';
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
import { enquiryStep3UpdateRequestSchema } from '../schema/schema';

interface AcademicDetailsSectionInterface {
  form: UseFormReturn<z.infer<typeof enquiryStep3UpdateRequestSchema>>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const AcademicDetailsSectionStage3: React.FC<AcademicDetailsSectionInterface> = ({
  form,
  commonFieldClass,
  commonFormItemClass
}) => {
  const [isValid, setIsValid] = useState(false);

  const checkValidity = () => {
    const academicDetails = form.getValues().academicDetails;
    if (!academicDetails) return false;

    const requiredFieldsValid = [0, 1, 2].every(index => {
      const details = academicDetails[index];
      if (!details) return false;

      return (
        details.schoolCollegeName &&
        details.universityBoardName &&
        details.passingYear &&
        details.percentageObtained !== undefined &&
        details.percentageObtained >= 0 &&
        details.percentageObtained <= 100
      );
    });

    const hasNoErrors = !form.formState.errors.academicDetails;

    return requiredFieldsValid && hasNoErrors;
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
              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter text-[16px] font-semibold">10th</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px]">
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
                            className={commonFieldClass}
                            placeholder="Enter school/college Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className={commonFieldClass}
                            placeholder="Enter university/board Name"
                          />
                        </FormControl>
                        <FormMessage />
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
                          <FormItem className={`w-[36%]`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666] w-full">
                              Passing Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Passing Year"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

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
                                type="number"
                                placeholder="Out of 100%"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={100}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[0]?.passingYear && (
                        <p className="text-[#E7000B]">
                          {form.formState.errors.academicDetails?.[0]?.passingYear.message}
                        </p>
                      )}
                    </div>

                    <div className="row-start-1">
                      {form.formState.errors.academicDetails?.[0]?.percentageObtained && (
                        <p className="text-[#E7000B]">
                          {form.formState.errors.academicDetails?.[0]?.percentageObtained.message}
                        </p>
                      )}
                    </div>
                  </div>

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
                            type="text"
                            className={commonFieldClass}
                            placeholder="(Optional)"
                            onChange={(e) =>
                              field.onChange(e.target.value.split(',').map((item) => item.trim()))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter  text-[16px] font-semibold">12th</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px]">
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
                            className={commonFieldClass}
                            placeholder="Enter school/college Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className={commonFieldClass}
                            placeholder="Enter university/board Name"
                          />
                        </FormControl>
                        <FormMessage />
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
                          <FormItem className={`w-[36%]`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666] w-full">
                              Passing Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Passing Year"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

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
                                type="number"
                                placeholder="Out of 100%"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={100}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
                            type="text"
                            className={commonFieldClass}
                            placeholder="(Optional)"
                            onChange={(e) =>
                              field.onChange(e.target.value.split(',').map((item) => item.trim()))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Subheading */}
                <h4 className="font-inter  text-[16px] font-semibold">Graduation</h4>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px]">
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
                            className={commonFieldClass}
                            placeholder="Enter school/college Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            className={commonFieldClass}
                            placeholder="Enter university/board Name"
                          />
                        </FormControl>
                        <FormMessage />
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
                          <FormItem className={`w-[36%]`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666] w-full">
                              Passing Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Passing Year"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

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
                                type="number"
                                placeholder="Out of 100%"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={100}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
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
                            type="text"
                            className={commonFieldClass}
                            placeholder="(Optional)"
                            onChange={(e) =>
                              field.onChange(e.target.value.split(',').map((item) => item.trim()))
                            }
                          />
                        </FormControl>
                        <FormMessage />
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