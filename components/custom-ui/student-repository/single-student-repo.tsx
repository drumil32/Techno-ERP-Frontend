'use client';

import { Label } from '@/components/ui/label';
import Image from 'next/image';
import React from 'react';
import PersonalDetailsSection from './personal-details';
import { Form } from '@/components/ui/form';
import { FieldDefinition, StudentData } from './helpers/interface';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { enquirySchema } from '../enquiry-form/schema/schema';
import { useForm } from 'react-hook-form';

const formSchema = enquirySchema;

const SingleStudentRepositoryPage: React.FC = () => {
  // Sample student data
  const studentData: StudentData = {
    id: 'TGI2025MBA102',
    name: 'Vaibhav Gupta',
    fatherName: 'Anil Kumar Gupta',
    courseCode: 'MBA',
    studentPhone: '1234567890',
    fatherPhone: '9876543210', 
    courseYear: 'First',
    formNo: 'TIMS453',
    email: 'vaibhav.gupta@example.com', 
    address: '123 College Street, New Delhi',
    dateOfBirth: '15-05-2000',
    batch: '2023-2025'
  };

  const column1Fields: FieldDefinition[] = [
    { label: 'Student Name', key: 'name' },
    { label: 'Father\'s Name', key: 'fatherName' },
    { label: 'Course Code', key: 'courseCode' },
    { label: 'Student ID', key: 'id' }
  ];

  const column2Fields: FieldDefinition[] = [
    { label: 'Student\'s Phone Number', key: 'studentPhone' },
    { label: 'Father\'s Phone Number', key: 'fatherPhone' },
    { label: 'Course Year', key: 'courseYear' },
    { label: 'Form No.', key: 'formNo' }
  ];

  const column3Fields: FieldDefinition[] = [
    { label: 'Email', key: 'email' },
    { label: 'Address', key: 'address' },
    { label: 'Date of Birth', key: 'dateOfBirth' },
    { label: 'Batch', key: 'batch' }
  ];

  // Component to render a single field with proper truncation
  const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex flex-row gap-2 items-start">
      <Label className="text-[14px] font-normal text-[#666666] shrink-0">{label} :</Label>
      <p className="font-inter text-[14px] font-medium truncate max-w-[200px]" title={value}>
        {value}
      </p>
    </div>
  );

  // Component to render a column of fields
  const FieldsColumn: React.FC<{ fields: FieldDefinition[] }> = ({ fields }) => (
    <div className="flex flex-col justify-between h-full space-y-4">
      {fields.map((field) => (
        <InfoField 
          key={field.key} 
          label={field.label} 
          value={studentData[field.key] || 'N/A'} 
        />
      ))}
    </div>
  );

  const ProfilePicSection: React.FC<{ name: string; id: string }> = ({ name, id }) => (
    <div className="bg-white rounded-[10px] p-4 flex items-center flex-col gap-2">
      <div className="relative w-24 h-24 overflow-hidden">
        <Image
          src="/images/techno-logo.png"
          alt={`${name}'s Profile Picture`}
          fill
          className="object-cover rounded-full border border-[#A5A5A5]"
        />
      </div>
      <h2 className="font-inter text-[16px] font-semibold text-center truncate max-w-[150px]" title={name}>
        {name}
      </h2>
      <p className="font-inter text-[13px] font-normal">
        {id}
      </p>
    </div>
  );

  // Form initialization
  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
  });
  
  const commonFormItemClass = 'col-span-1 min-h-[50px] gap-y-0  ';
  const commonFieldClass = 'gap-y-0';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Student Profile</h1>
      </div>

      {/* Student Profile View */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture Section */}
        <ProfilePicSection name={studentData.name} id={studentData.id} />

        {/* Student Details Section */}
        <div className="bg-white p-4 flex flex-col lg:flex-row gap-4 lg:gap-20 flex-grow rounded-[10px]">
          <FieldsColumn fields={column1Fields} />
          <FieldsColumn fields={column2Fields} />
          <FieldsColumn fields={column3Fields} />
        </div>
      </div>

      {/* Student More Details */}
      <div>
        <Form {...form}>

        {/* Personal Details */}
        <div>
          <PersonalDetailsSection form={form} commonFieldClass={commonFieldClass} commonFormItemClass={commonFormItemClass} />
        </div>
        </Form>
      </div>
    </div>
  );
};

export default SingleStudentRepositoryPage;