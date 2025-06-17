import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle2, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import axios from 'axios';
import { API_DOMAIN } from '@/common/constants/apiEndpoints';
import { Document, StudentData } from '../helpers/interface';
import { PhysicalDocumentNoteStatus } from '../helpers/enum';
import { updateDocument, updateStudentDocuments } from '../helpers/api';
import { toast } from 'sonner';
import { formatDisplayDate } from '../../enquiry-form/stage-2/student-fees-form';

interface DocumentVerificationProps {
  studentData: StudentData;
  setStudentData: (data: StudentData) => void;
}

export const formatDateForDisplay = (date: Date | string | undefined): string | undefined => {
  if (!date) return undefined;
  const dateObj = date instanceof Date ? date : new Date(date);
  return formatDisplayDate(dateObj) || undefined;
};

const DocumentVerificationSection: React.FC<DocumentVerificationProps> = ({
  studentData,
  setStudentData
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [changedDocId, setChangedDocId] = useState<string | null>(null);
  const [prevDate, setPrevDate] = useState<string | undefined | null>(null);
  const [prevStatus, setPrevStatus] = useState<string | undefined | null>(null)

  const course = studentData?.courseName;
  const existingNotes = studentData?.studentInfo?.physicalDocumentNote;

  useEffect(() => {
    if (!initialized && course) {
      initializeDocuments(course);
    }
  }, [initialized, course, existingNotes]);

  const initializeDocuments = async (course: string) => {
    try {
      setLoading(true);
      setError(null);

      if (existingNotes?.length > 0) {
        const mappedDocs = existingNotes.map((note: any, index: number) => ({
          _id: note._id,
          id: `${index + 1}`,
          type: note.type || '',
          status: note.status || PhysicalDocumentNoteStatus.PENDING,
          dueBy: note.dueBy ? note.dueBy : undefined
        }));

        setDocuments(mappedDocs);
        setInitialized(true);
        return;
      }

      const response = await axios.get(
        `${API_DOMAIN}/course-metadata/${course}/admission-documents`,
        { withCredentials: true }
      );

      const docList: string[] = response.data?.DATA?.documentTypeList || [];

      if (docList.length > 0) {
        const initialDocs: Document[] = docList.map((docName, index) => ({
          _id: '',
          id: `${index + 1}`,
          type: docName,
          status: PhysicalDocumentNoteStatus.PENDING,
          dueBy: undefined
        }));
        setDocuments(initialDocs);
      } else {
        setError('No documents configured for this course');
      }

      setInitialized(true);
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (docId: string, status: PhysicalDocumentNoteStatus) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => {
        if(doc.id === docId){
          setPrevStatus(doc.status);
          setPrevDate(doc.dueBy)
          return {
            ...doc,status
          }
        }
        return doc
      })
    );
    setChangedDocId(docId);
  };

  const handleDueDateChange = (docId: string, date: string | undefined) => {
    const docIndex = documents.findIndex((doc) => doc.id === docId);
    if (docIndex === -1) return;

    const updatedDocuments = [...documents];
    setPrevDate(updatedDocuments[docIndex].dueBy)
    updatedDocuments[docIndex] = {
      ...updatedDocuments[docIndex],
      dueBy: date || undefined
    };

    setDocuments(updatedDocuments);
    setChangedDocId(docId);
  };

  useEffect(() => {
    const updateDocumentsOnServer = async () => {
      if (!changedDocId) return;

      // Store the current state before making changes
      const prevDocuments = [...documents];

      try {
        const changedDoc = documents.find((doc) => doc.id === changedDocId);
        if (!changedDoc) return;

        const { _id, ...rest } = {
          ...changedDoc,
          id: studentData._id,
          dueBy: changedDoc.dueBy
        };

        const response = await updateStudentDocuments(rest);

        if (response) {
          toast.success('Documents updated successfully');
          // Update the student data in parent component if needed

        } else {
          // Revert to previous state if update fails
          setDocuments(prevDocuments);
          // toast.error('Failed to update documents');
        }
      } catch (error) {
        const docIndex = documents.findIndex((doc) => doc.id === changedDocId);
        if (docIndex === -1) return;

        const updatedDocuments = [...documents];
        updatedDocuments[docIndex] = {
          ...updatedDocuments[docIndex],
          dueBy: prevDate || undefined,
          status: (prevStatus as PhysicalDocumentNoteStatus) || PhysicalDocumentNoteStatus.PENDING
        };

        // Revert to previous state on error
        setDocuments(updatedDocuments);
        // toast.error('Failed to update documents. Please try again.');
      } finally {
        setChangedDocId(null);
      }
    };

    if (documents.length > 0 && changedDocId) {
      updateDocumentsOnServer();
    }
  }, [documents, studentData._id, changedDocId]);

  const getStatusIcon = (status: PhysicalDocumentNoteStatus) => {
    switch (status) {
      case PhysicalDocumentNoteStatus.VERIFIED:
        return <CheckCircle2 className="ml-2 h-4 w-4 text-green-600" />;
      case PhysicalDocumentNoteStatus.NOT_APPLICABLE:
        return <CheckCircle className="ml-2 h-4 w-4 text-blue-500" />;
      case PhysicalDocumentNoteStatus.PENDING:
        return <Clock className="ml-2 h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) return <div className="py-4 text-gray-500">Loading document verification...</div>;
  if (error) return <div className="py-4 text-red-500">{error}</div>;
  if (documents.length === 0)
    return (
      <div className="py-4 text-gray-500">
        No documents to verify. Please check course configuration.
      </div>
    );

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      defaultValue="document-verification"
    >
      <AccordionItem value="document-verification" className="border-b-0">
        <AccordionTrigger className="w-full items-center">
          <h3 className="font-inter text-[16px] font-semibold">Mandatory Documents Verification</h3>
          <hr className="flex-1 border-t border-[#DADADA] ml-2" />
        </AccordionTrigger>
        <AccordionContent className="p-6 bg-white rounded-[10px] space-y-8">
          {documents.map((doc) => (
            <div key={doc.id} className="space-y-2">
              <div className="text-sm font-semibold text-gray-800">
                {doc.type.replace(/_/g, ' ')}
              </div>
              <div className="flex flex-row items-center">
                <div className="flex items-center">
                  <Select
                    value={doc.status}
                    onValueChange={(value) =>
                      handleStatusChange(doc.id, value as PhysicalDocumentNoteStatus)
                    }
                  >
                    <SelectTrigger className="w-[400px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PhysicalDocumentNoteStatus.VERIFIED}>Verified</SelectItem>
                      <SelectItem value={PhysicalDocumentNoteStatus.PENDING}>Pending</SelectItem>
                      <SelectItem value={PhysicalDocumentNoteStatus.NOT_APPLICABLE}>
                        Not Applicable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {getStatusIcon(doc.status)}
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'ml-5 w-[200px] justify-start text-left font-normal',
                          !doc.dueBy && 'text-muted-foreground',
                          doc.status !== PhysicalDocumentNoteStatus.PENDING &&
                          'cursor-not-allowed opacity-60'
                        )}
                        disabled={doc.status !== PhysicalDocumentNoteStatus.PENDING}
                      >
                        {doc.dueBy ? doc.dueBy : 'Pick a due date'}
                      </Button>
                    </PopoverTrigger>
                    {doc.status === PhysicalDocumentNoteStatus.PENDING && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={doc.dueBy ? new Date(doc.dueBy) : undefined}
                          onSelect={(date) => handleDueDateChange(doc.id, formatDateForDisplay(date))}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DocumentVerificationSection;
