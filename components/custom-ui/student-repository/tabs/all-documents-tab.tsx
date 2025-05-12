import React from 'react';
import DocumentVerificationSection from '../sub-sections/mandatory-doc-verification';
import { StudentData } from '../helpers/interface';
import SingleDocumentUpload from '../single-document-upload';
import { DocumentType } from '@/types/enum';

interface AllDocumentsTabProps {
  studentData: StudentData;
  setStudentData: (data: StudentData) => void;
}

const AllDocumentsTab: React.FC<AllDocumentsTabProps> = ({ studentData, setStudentData }) => {
  return (
    <div className="flex flex-col gap-4">
      <DocumentVerificationSection studentData={studentData} setStudentData={setStudentData} />

      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
        <SingleDocumentUpload studentData={studentData} documentType={DocumentType.PHOTO} />

        <SingleDocumentUpload studentData={studentData} documentType={DocumentType.SIGNATURE} />
      </div>
    </div>
  );
};

export default AllDocumentsTab;
