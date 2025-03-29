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

  CourseNameMapper,
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

import { toPascal } from '@/lib/utils';


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
        addressLine1: '',
        addressLine2: '',
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
      telecallerName: '',
      confirmation: false
    }
  });

  const commonFormItemClass = 'col-span-1 gap-y-0';
  const commonFieldClass = '';

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
              
              {/* Section Title */}
              <AccordionTrigger className="w-full items-center">
                <h3 className="font-inter text-[16px] font-semibold">Student Details</h3>
                <hr className="flex-1 border-t border-[#DADADA] ml-2" />
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
                              <SelectValue className='text-[#9D9D9D]' placeholder="Select Admission Mode" />
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
                    key="fatherOccupation"
                    control={form.control}
                    name="fatherOccupation"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass}`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Father Occupation
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
                          Mother Name
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
                          Mother Phone Number
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
                          Mother Occupation
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
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue className='text-[#9D9D9D]' placeholder="Select Category" />
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
                    key="course"
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-start-1`}>
                        <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                          Course
                        </FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue className='text-[#9D9D9D]' placeholder="Select Course" />
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
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger className={`${commonFieldClass} w-full`}>
                              <SelectValue className='text-[#9D9D9D]' placeholder="Select Reference" />
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
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px] bg-white p-4 rounded-[10px]">
                  
                  <FormField
                  key="addressLine1"
                  control={form.control}
                  name="address.addressLine1"
                  render={({ field }) => (
                    <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Address Line 1
                    </FormLabel>
                    <FormControl>
                      <Input
                      {...field}
                      className=""
                      placeholder="Enter Address Line 1"
                      />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                  )}
                  />

                  <FormField
                  key="addressLine2"
                  control={form.control}
                  name="address.addressLine2"
                  render={({ field }) => (
                    <FormItem className={`col-span-2 gap-x-2 gap-y-0`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Address Line 2
                    </FormLabel>
                    <FormControl>
                      <Input
                      {...field}
                      className=""
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={`${commonFieldClass} w-full`}>
                        <SelectValue placeholder="Select the district" />
                      </SelectTrigger>
                      <SelectContent>
                        {['District 1', 'District 2', 'District 3'].map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
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
                  key="state"
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem className={`${commonFormItemClass} col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      State
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={`${commonFieldClass} w-full`}>
                        <SelectValue placeholder="Select the state" />
                      </SelectTrigger>
                      <SelectContent>
                        {['State 1', 'State 2', 'State 3'].map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
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
                  key="country"
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem className={`${commonFormItemClass}`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className={`${commonFieldClass} w-full`}>
                        <SelectValue placeholder="Select the country" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Country 1', 'Country 2', 'Country 3'].map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
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
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Enter Passing Year"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
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
                                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                                placeholder="(Optional)"
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
                                <Input {...field}
                                  type="number"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  placeholder="Enter Passing Year" />
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
                                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                                placeholder="(Optional)"
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
                                <Input {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  type="number"
                                  placeholder="Enter Passing Year" />
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
                                  onChange={(e) => field.onChange(Number(e.target.value))}
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
                                placeholder="(Optional)"
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
                <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-4 gap-x-[32px] bg-white p-4 rounded-[10px]">
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

                    <FormField
                    key="telecallerName"
                    control={form.control}
                    name="telecallerName"
                    render={({ field }) => (
                      <FormItem className={`${commonFormItemClass} col-span-1`}>
                      <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                        Telecaller’s Name
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select Telecaller’s Name" />
                        </SelectTrigger>
                        <SelectContent>
                          {['Telecaller 1', 'Telecaller 2', 'Telecaller 3'].map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
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
                                <span className={!field.value ? 'text-[#9D9D9D]' : ''}>
                                  {field.value ? field.value : 'Select the Date'}
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
                            placeholder="Optional"
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
                <div className="flex items-center bg-white rounded-[5px] p-[10px]">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="w-[16px] h-[16px]" />
                  <label className={`ml-2 w-full text-[12px]`}>
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
