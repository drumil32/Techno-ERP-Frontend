import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { DocumentWithFileUrl, FieldDefinition, StudentData } from './helpers/interface';
import { formatYearRange } from '@/lib/utils';
import { Loader2, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDocument } from './helpers/api';
import { DocumentType } from '@/types/enum';
import { getReadableDocumentName } from '../enquiry-form/stage-3/documents-section/helpers/mapperFunction';
import { toast } from 'sonner';

const InfoField = ({ label, value }: FieldDefinition) => (
  <div className="flex flex-row gap-2 items-start">
    <Label className="text-sm font-normal text-gray-500 shrink-0">{label}:</Label>
    <p className="font-medium truncate max-w-[200px]" title={value?.toString()}>
      {value}
    </p>
  </div>
);

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
  const [imageKey, setImageKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: updateDocumentMutation } = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student', studentId] });

      setImageKey((prev) => prev + 1);
    },
    onError: (error) => {
      console.error('Update failed:', error);
    }
  });

  const handlePencilClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
  };

  const handleUpload = async (selectedFile: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', studentId);
      formData.append('type', DocumentType.PHOTO);
      formData.append('document', selectedFile);

      await updateDocumentMutation(formData);
      toast.success(`${getReadableDocumentName(DocumentType.PHOTO)} uploaded successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File upload failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg py-4 px-6 flex flex-col items-center justify-center gap-2">
      <div className="relative w-32 h-32 overflow-hidden group">
        <Image
          src={`${image || '/images/default-profile.png'}?t=${new Date()}`}
          alt={`${name}'s Profile Picture`}
          fill
          className="object-cover rounded-full border border-gray-400"
          key={`${image}-${imageKey}`}
        />

        <Input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />
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

const StudentProfileView = ({ studentData }: { studentData: StudentData }) => {
  if (!studentData) return <div className="p-4">No student data available</div>;

  const { studentInfo, courseCode, currentAcademicYear, currentSemester, _id } = studentData;
  const photoDocument = studentInfo?.documents?.find((doc) => doc.type === 'Photo');

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
        image={photoDocument?.fileUrl || '/images/techno-logo.png'}
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
