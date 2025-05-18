// React and Next.js imports
import React, { useRef, useState } from 'react';
import Image from 'next/image';

// UI Components
import { Label } from '@/components/ui/label';

// Types and interfaces
import { DocumentWithFileUrl, FieldDefinition, StudentData } from './helpers/interface';

// Utilities
import { formatYearRange } from '@/lib/utils';
import { Loader2, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { updateDocument } from './helpers/api';
import { DocumentType } from '@/types/enum';
import { getReadableDocumentName } from '../enquiry-form/stage-3/documents-section/helpers/mapperFunction';
import { toast } from 'sonner';

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
const ProfilePicSection = ({
  name,
  universityId,
  studentId,
  image
}: {
  name: string;
  universityId: string;
  studentId: string;
  image: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePencilClick = () => {
    // Programmatically click the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const useUpdateDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: updateDocument,
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['student', studentId] });
      },
      onError: (error) => {
        console.error('Update failed:', error);
      }
    });
  };

  // Inside your component
  const { mutateAsync: updateDocumentMutation } = useUpdateDocument();

  const handleUpload = async (selectedFile: File) => {
    setIsLoading(true);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('id', studentId);
      formDataPayload.append('type', DocumentType.PHOTO);
      if (selectedFile) {
        formDataPayload.append('document', selectedFile);
      }

      await updateDocumentMutation(formDataPayload);

      toast.success(`${getReadableDocumentName(DocumentType.PHOTO)} uploaded successfully!`);
    } catch (error) {
      console.error('Upload failed:', error);
      let errorMessage = 'File upload failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        errorMessage = error.message;
      } else if (
        error &&
        typeof error === 'object' &&
        'ERROR' in error &&
        typeof error.ERROR === 'string'
      ) {
        errorMessage = error.ERROR;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg py-4 px-6 flex flex-col items-center justify-center gap-2">
      <div className="relative w-32 h-32 overflow-hidden group">
        <Image
          src={image || '/images/default-profile.png'}
          alt={`${name}'s Profile Picture`}
          fill
          className="object-cover rounded-full border border-gray-400"
        />

        {/* Hidden file input */}
        <Input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Edit button overlay */}
        <button
          onClick={handlePencilClick}
          className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-400 hover:bg-gray-100 transition-colors"
          title="Edit profile picture"
          aria-label="Edit profile picture"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" strokeWidth={1.5} size={16} color={'#4E4E4E'} />
          ) : (
            <Pencil size={16} strokeWidth={1.5} color={'#4E4E4E'} />
          )}
        </button>
      </div>
      <h2 className="text-base font-semibold text-center truncate max-w-[150px]" title={name}>
        {name}
      </h2>
      <p className="text-xs">{universityId}</p>
    </div>
  );
};

/**
 * StudentProfileView Component
 * Displays a student's profile information in a structured layout
 */
const StudentProfileView = ({ studentData }: { studentData: StudentData }) => {
  if (!studentData) return <div className="p-4">No student data available</div>;

  const { studentInfo, courseCode, currentAcademicYear, currentSemester, _id } = studentData || {};

  // Define fields to display
  const studentDisplayFields: FieldDefinition[] = [
    { label: 'Student Name', value: studentInfo?.studentName },
    { label: "Student's Phone Number", value: studentInfo?.studentPhoneNumber },
    { label: "Father's Name", value: studentInfo?.fatherName },
    { label: "Father's Phone Number", value: studentInfo?.fatherPhoneNumber },
    { label: 'Course Code', value: courseCode },
    {
      label: 'Course Year',
      value: currentAcademicYear ? formatYearRange(currentAcademicYear) : undefined
    },
    { label: 'Semester', value: currentSemester },
    { label: 'Student ID', value: studentInfo?.universityId },
    { label: 'Form No.', value: studentInfo?.formNo },
    { label: 'LURN/Pre-registration No.', value: studentInfo?.lurnRegistrationNo }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <ProfilePicSection
        name={studentInfo?.studentName || 'Unknown Student'}
        universityId={studentInfo?.universityId || 'No ID'}
        studentId={_id}
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
