import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { enquiryStep1RequestSchema } from './schema';
import {
  AdmissionMode,
  AdmissionReference,
  ApplicationStatus,
  Category,
  Course,
  EducationLevel,
  Gender
} from '@/static/enum';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarDaysIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

const formSchema = z.object(enquiryStep1RequestSchema.shape).extend({
  confirmation: z.boolean()
});

const EnquiryFormStage1 = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      admissionMode: AdmissionMode.ONLINE,
      dateOfBirth: '',
      dateOfEnquiry: '',
      studentPhoneNumber: '',
      studentName: '',
      gender: Gender.NOT_TO_MENTION,
      fatherName: '',
      fatherPhoneNumber: '',
      fatherOccupation: '',
      motherName: '',
      motherPhoneNumber: '',
      motherOccupation: '',
      category: Category.GENERAL,
      address: {
        landmark: '',
        district: '',
        state: '',
        pincode: '',
        country: ''
      },
      emailId: '',
      reference: AdmissionReference.Advertising,
      course: Course.BCOM,
      counsellor: '',
      remarks: '',
      academicDetails: [
        {
          educationLevel: EducationLevel.Tenth,
          schoolCollegeName: '',
          universityBoardName: '',
          passingYear: 0,
          percentageObtained: 0,
          subjects: []
        },
        {
          educationLevel: EducationLevel.Twelfth,
          schoolCollegeName: '',
          universityBoardName: '',
          passingYear: 0,
          percentageObtained: 0,
          subjects: []
        },
        {
          educationLevel: EducationLevel.Graduation,
          schoolCollegeName: '',
          universityBoardName: '',
          passingYear: 0,
          percentageObtained: 0,
          subjects: []
        }
      ],
      applicationStatus: ApplicationStatus.STEP_1,
      approvedBy: '',
      confirmation: false
    }
  });

  const commonFormItemClass = 'col-span-1 gap-x-2 gap-y-0';
  const commonFieldClass = 'w-[407px]';

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-8 mr-[25px] space-y-8 flex flex-col"
      >
        {/* Student Details */}
        <Accordion type="single" collapsible>
          <AccordionItem value="student-details">
            <div className="space-y-2">
              <AccordionTrigger className="w-full items-center">
                {/* Section Title */}
                <h3 className="font-inter text-[16px] font-semibold">Student Details</h3>
                <hr className="flex-1 border-t border-[#DADADA] ml-2" />
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 bg-white p-4 rounded-[10px]">
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
                            <SelectTrigger className={commonFieldClass}>
                              <SelectValue placeholder="Select Admission Mode" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(AdmissionMode).map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                  {mode}
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
                    key="dateOfEnquiry"
                    control={form.control}
                    name="dateOfEnquiry"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} border-none`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Date of Enquiry
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`${commonFieldClass} justify-between bg-inherit`}
                              >
                                <span>
                                  {field.value ? format(field.value, 'dd/MM/yyyy') : 'Select Date'}
                                </span>
                                <CalendarDaysIcon size={16} className="ml-2" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date || undefined)}
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
                          Student Phone Number
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
                            type="email"
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
                            <SelectTrigger className={commonFieldClass}>
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Gender).map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {gender}
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
                    key="fatherName"
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Father Name
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
                          Father Phone Number
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
                                <span>
                                  {field.value ? format(field.value, 'dd/MM/yyyy') : 'Select Date'}
                                </span>
                                <CalendarDaysIcon size={16} className="ml-2" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date || undefined)}
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
                    key="course"
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Course
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className={commonFieldClass}>
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Course).map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
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
                            <SelectTrigger className={commonFieldClass}>
                              <SelectValue placeholder="Select Reference" />
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

        {/* Address details */}
        <Accordion type="single" collapsible>
          <AccordionItem value="student-details">
            <div className="space-y-2">
              <AccordionTrigger className="w-full items-center">
                {/* Section Title */}
                <h3 className="font-inter text-[16px] font-semibold">Address details</h3>
                <hr className="flex-1 border-t border-[#DADADA] ml-2" />
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 bg-white p-4 rounded-[10px]">
                  <FormField
                    key="landmark"
                    control={form.control}
                    name="address.landmark"
                    render={({ field }) => (
                      <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Address Line 1
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-[847px]"
                            placeholder="Enter Address Line 1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="landmark"
                    control={form.control}
                    name="address.landmark"
                    render={({ field }) => (
                      <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Address Line 2
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-[847px]"
                            placeholder="Enter Address Line 2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="pincode"
                    control={form.control}
                    name="address.pincode"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Pincode
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Enter the pin code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="district"
                    control={form.control}
                    name="address.district"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          District
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Select the district"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="state"
                    control={form.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Select the state"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    key="country"
                    control={form.control}
                    name="address.country"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Country
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Select the country"
                          />
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

        {/* Academic Details */}
        <Accordion type="single" collapsible>
          <AccordionItem value="student-details">
            <div className="space-y-2">
              <AccordionTrigger className="w-full items-center">
                {/* Section Title */}
                <h3 className="font-inter text-[16px] font-semibold">Academic Details</h3>
                <hr className="flex-1 border-t border-[#DADADA] ml-2" />
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid grid-row-3 gap-y-6 bg-white p-4 rounded-[10px]">
                  <div className="space-y-4">
                    {/* Subheading */}
                    <h4 className="font-inter text-[14px] font-medium">10th</h4>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-[32px]">
                      <FormField
                        key="academicDetails.0.schoolCollegeName"
                        control={form.control}
                        name="academicDetails.0.schoolCollegeName"
                        render={({ field }) => (
                          <FormItem className={`${commonFormItemClass} col-span-1`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                              School Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={commonFieldClass}
                                placeholder="Enter School Name"
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
                              Board Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={commonFieldClass}
                                placeholder="Enter Board Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className={` col-span-1 col-start-1 flex gap-x-3`}>
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
                                <Input {...field} type="number" placeholder="Enter Passing Year" />
                              </FormControl>
                              <FormMessage />
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
                                  placeholder="Enter Percentage"
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                placeholder="Enter subjects separated by commas"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value.split(',').map((item) => item.trim())
                                  )
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
                    <h4 className="font-inter text-[14px] font-medium">12th</h4>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-[32px]">
                      <FormField
                        key="academicDetails.1.schoolCollegeName"
                        control={form.control}
                        name="academicDetails.1.schoolCollegeName"
                        render={({ field }) => (
                          <FormItem className={`${commonFormItemClass} col-span-1`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                              School Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={commonFieldClass}
                                placeholder="Enter School Name"
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
                              Board Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={commonFieldClass}
                                placeholder="Enter Board Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className={` col-span-1 col-start-1 flex gap-x-3`}>
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
                                <Input {...field} type="number" placeholder="Enter Passing Year" />
                              </FormControl>
                              <FormMessage />
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
                                  placeholder="Enter Percentage"
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                placeholder="Enter subjects separated by commas"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value.split(',').map((item) => item.trim())
                                  )
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
                    <h4 className="font-inter text-[14px] font-medium">Graduate</h4>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-[32px]">
                      <FormField
                        key="academicDetails.2.schoolCollegeName"
                        control={form.control}
                        name="academicDetails.2.schoolCollegeName"
                        render={({ field }) => (
                          <FormItem className={`${commonFormItemClass} col-span-1`}>
                            <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                              School Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={commonFieldClass}
                                placeholder="Enter School Name"
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
                              Board Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className={commonFieldClass}
                                placeholder="Enter Board Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className={` col-span-1 col-start-1 flex gap-x-3`}>
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
                                <Input {...field} type="number" placeholder="Enter Passing Year" />
                              </FormControl>
                              <FormMessage />
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
                                  placeholder="Enter Percentage"
                                  min={0}
                                  max={100}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                                placeholder="Enter subjects separated by commas"
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value.split(',').map((item) => item.trim())
                                  )
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

        {/* To be filled by College */}
        <Accordion type="single" collapsible>
          <AccordionItem value="student-details">
            <div className="space-y-2">
              <AccordionTrigger className="w-full items-center">
                {/* Section Title */}
                <h3 className="font-inter text-[16px] font-semibold">To be filled by College</h3>
                <hr className="flex-1 border-t border-[#DADADA] ml-2" />
              </AccordionTrigger>

              <AccordionContent>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-4 bg-white p-4 rounded-[10px]">
                  <FormField
                    key="counsellor"
                    control={form.control}
                    name="counsellor"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Counsellor’s Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Enter Counsellor’s Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    key="telecaller"
                    control={form.control}
                    name="telecaller"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Telecaller’s Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Enter Telecaller’s Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <FormField
                    key="dateOfEnquiry"
                    control={form.control}
                    name="dateOfEnquiry"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Date
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`${commonFieldClass} justify-between bg-inherit`}
                              >
                                <span>
                                  {field.value ? format(field.value, 'dd/MM/yyyy') : 'Select Date'}
                                </span>
                                <CalendarDaysIcon size={16} className="ml-2" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={(date) => field.onChange(date || undefined)}
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
                    key="remarks"
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Remarks
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className={commonFieldClass}
                            placeholder="Enter Remarks"
                          />
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

        {/* Confirmation Check box */}
        <FormField
          control={form.control}
          name="confirmation"
          render={({ field }) => (
            <FormItem className="cols-span-3">
              <FormControl>
                <div className="flex items-center bg-white rounded-[5px] p-1">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="" />
                  <label className={`ml-2 w-full`}>
                    All the above information has been verified by the applicant and thoroughly
                    check by the Admissions team.
                  </label>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Sticky Footer */}
        <div className="fixed bottom-0 w-full bg-white shadow-md p-4 border-t flex justify-between items-center">
          <Button type="button">
            <span className="font-inter font-semibold text-[12px]">Save Draft</span>
          </Button>

          <Button type="submit">
            <span className="font-inter font-semibold text-[12px]">Submit & Continue</span>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnquiryFormStage1;
