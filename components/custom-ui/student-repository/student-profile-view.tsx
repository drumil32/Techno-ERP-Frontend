// React and Next.js imports
import React from 'react';
import Image from 'next/image';

// UI Components
import { Label } from '@/components/ui/label';

// Types and interfaces
import { DocumentWithFileUrl, FieldDefinition, StudentData } from './helpers/interface';

// Utilities
import { formatYearRange } from '@/lib/utils';

/**
 * Displays a labeled field with value
 */
const InfoField = ({ label, value }: FieldDefinition) => (
  <div className="flex flex-row gap-2 items-start">
    <Label className="text-sm font-normal text-gray-500 shrink-0">{label}:</Label>
    <p className="font-medium truncate max-w-[200px]" title={value?.toString()}>
      {value}
    </p>
  </div>
);

/**
 * Displays student profile picture and identification
 */
const ProfilePicSection = ({ name, id, image }: { name: string; id: string; image: string }) => (
  <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center gap-2">
    <div className="relative w-24 h-24 overflow-hidden">
      <Image
        src={image || '/images/default-profile.png'}
        alt={`${name}'s Profile Picture`}
        fill
        className="object-cover rounded-full border border-gray-400"
      />
    </div>
    <h2 className="text-base font-semibold text-center truncate max-w-[150px]" title={name}>
      {name}
    </h2>
    <p className="text-xs">{id}</p>
  </div>
);

/**
 * StudentProfileView Component
 * Displays a student's profile information in a structured layout
 */
const StudentProfileView = ({ studentData }: { studentData: StudentData }) => {
  if (!studentData) return <div className="p-4">No student data available</div>;

  const { studentInfo, courseCode, currentAcademicYear, currentSemester } = studentData || {};

  // Define fields to display
  const studentDisplayFields: FieldDefinition[] = [
    { label: 'Student Name', value: studentInfo?.studentName },
    { label: "Father's Name", value: studentInfo?.fatherName },
    { label: 'Course Code', value: courseCode },
    { label: 'Student ID', value: studentInfo?.universityId },
    { label: "Student's Phone Number", value: studentInfo?.studentPhoneNumber },
    { label: "Father's Phone Number", value: studentInfo?.fatherPhoneNumber },
    {
      label: 'Course Year',
      value: currentAcademicYear ? formatYearRange(currentAcademicYear) : undefined
    },
    { label: 'Semester', value: currentSemester },
    { label: 'Lurn/Pre-registration No.', value: studentInfo?.lurnRegistrationNo }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <ProfilePicSection
        name={studentInfo?.studentName || 'Unknown Student'}
        id={studentInfo?.universityId || 'No ID'}
        image={
          studentInfo?.documents?.find((doc: DocumentWithFileUrl) => doc.type === 'Photo')
            ?.fileUrl || '/images/techno-logo.png'
        }
      />

      <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow rounded-lg shadow-sm">
        {studentDisplayFields.map(({ label, value }) => (
          <InfoField key={label} label={label} value={value || 'N/A'} />
        ))}
      </div>
    </div>
  );
};

export default StudentProfileView;
