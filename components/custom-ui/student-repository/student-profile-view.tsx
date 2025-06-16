import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { DocumentWithFileUrl, FieldDefinition, StudentData } from './helpers/interface';
import { formatYearRange } from '@/lib/utils';
import { Book, BookOpen, Calendar1, CalendarDays, FileSignature, FileText, IdCard, Layers, Loader2, Pencil, Phone, PhoneCall, School, User, User2, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateDocument } from './helpers/api';
import { DocumentType } from '@/types/enum';
import { getReadableDocumentName } from '../enquiry-form/stage-3/documents-section/helpers/mapperFunction';
import { toast } from 'sonner';

const InfoField = ({ label, value, icon }: FieldDefinition) => (
  <div className="flex flex-row gap-2 items-center">
    {icon}
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
    {
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
          <User className="size-4" />
        </div>
      ),
      label: 'Student Name',
      value: studentInfo?.studentName,
    },
    {
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
          <Phone className="size-4" />
        </div>
      ),
      label: "Student's Phone Number",
      value: studentInfo?.studentPhoneNumber,
    },
    {
      icon: (
        <div className="p-2 bg-yellow-50 rounded-lg mr-3 text-yellow-600">
          <User2 className="size-4" />
        </div>
      ),
      label: "Father's Name",
      value: studentInfo?.fatherName,
    },
    {
      icon: (
        <div className="p-2 bg-yellow-50 rounded-lg mr-3 text-yellow-600">
          <PhoneCall className="size-4" />
        </div>
      ),
      label: "Father's Phone Number",
      value: studentInfo?.fatherPhoneNumber,
    },
    {
      icon: (
        <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-600">
          <Book className="size-4" />
        </div>
      ),
      label: 'Course Code',
      value: courseCode,
    },
    {
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
          <CalendarDays className="size-4" />
        </div>
      ),
      label: 'Course Year',
      value: currentAcademicYear ? formatYearRange(currentAcademicYear) : undefined,
    },
    {
      icon: (
        <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
          <Layers className="size-4" />
        </div>
      ),
      label: 'Semester',
      value: currentSemester,
    },
    {
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
          <IdCard className="size-4" />
        </div>
      ),
      label: 'Student ID',
      value: studentInfo?.universityId,
    },
    {
      icon: (
        <div className="p-2 bg-gray-50 rounded-lg mr-3 text-gray-600">
          <FileText className="size-4" />
        </div>
      ),
      label: 'Form No.',
      value: studentInfo?.formNo,
    },
    {
      icon: (
        <div className="p-2 bg-pink-50 rounded-lg mr-3 text-pink-600">
          <FileSignature className="size-4" />
        </div>
      ),
      label: 'LURN/Pre-registration No.',
      value: studentInfo?.lurnRegistrationNo,
    },
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
        {studentDisplayFields.map(({ label, value, icon }) => (
          <InfoField key={label} icon={icon} label={label} value={value || 'N/A'} />
        ))}
      </div>
    </div>
  );
};

export default StudentProfileView;
