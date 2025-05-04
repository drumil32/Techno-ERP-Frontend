import Image from 'next/image';
import React from 'react';
import { FieldDefinition, StudentData } from './helpers/interface';
import { Label } from '@/components/ui/label';

interface StudentProfileViewProps {
  studentData: StudentData;
}

const StudentProfileView: React.FC<StudentProfileViewProps> = ({ studentData }) => {
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
      <h2
        className="font-inter text-[16px] font-semibold text-center truncate max-w-[150px]"
        title={name}
      >
        {name}
      </h2>
      <p className="font-inter text-[13px] font-normal">{id}</p>
    </div>
  );

  // Combine fields into a single object with labels, keys, and values
  const displayFields: FieldDefinition[] = [
    {
      label: 'Student Name',
      key: 'studentName',
      value: studentData?.studentInfo?.studentName
    },
    {
      label: "Father's Name",
      key: 'fatherName',
      value: studentData?.studentInfo?.fatherName
    },
    {
      label: 'Course Code',
      key: 'courseName',
      value: studentData?.courseName
    },
    {
      label: 'Student ID',
      key: 'universityId',
      value: studentData?.studentInfo?.universityId
    },
    {
      label: "Student's Phone Number",
      key: 'studentPhoneNumber',
      value: studentData?.studentInfo?.studentPhoneNumber
    },
    {
      label: "Father's Phone Number",
      key: 'fatherPhoneNumber',
      value: studentData?.studentInfo?.fatherPhoneNumber
    },
    {
      label: 'Course Year',
      key: 'courseYear',
      value: studentData?.currentAcademicYear
    },
    {
      label: 'Semester',
      key: 'currentSemester',
      value: studentData?.currentSemester
    },
    {
      label: 'Lurn/Pre-registration No.',
      key: 'lurnNo',
      value: studentData?.studentInfo?.lurnRegistrationNo
    }
  ];

  // Info Field
  const InfoField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex flex-row gap-2 items-start">
      <Label className="text-[14px] font-normal text-[#666666] shrink-0">{label} :</Label>
      <p className="font-inter text-[14px] font-medium truncate max-w-[200px]" title={value}>
        {value}
      </p>
    </div>
  );

  // Student Fields
  const StudentFields: React.FC<{
    fields: FieldDefinition[];
  }> = ({ fields }) => (
    <>
      {fields.map((field) => (
        <InfoField
          key={field.key}
          label={field.label}
          value={field.value ? String(field.value) : 'N/A'}
        />
      ))}
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <ProfilePicSection
        name={studentData?.studentInfo?.studentName || ''}
        id={studentData?.studentInfo?.universityId || ''}
      />

      <div className="bg-white p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow rounded-lg shadow-sm">
        <StudentFields fields={displayFields} />
      </div>
    </div>
  );
};

export default StudentProfileView;
