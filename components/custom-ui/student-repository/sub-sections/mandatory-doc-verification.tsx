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
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import axios from 'axios';
import { API_DOMAIN } from '@/common/constants/apiEndpoints';
import { Document, StudentData } from '../helpers/interface';
import { PhysicalDocumentNoteStatus } from '../helpers/enum';
import { updateStudentDocuments } from '../helpers/api';
import { toast } from 'sonner';

interface DocumentVerificationProps {
  studentData: StudentData;
  setStudentData: (data: StudentData) => void;
}

const DocumentVerificationSection: React.FC<DocumentVerificationProps> = ({ studentData, setStudentData }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const course = studentData?.courseName;
  const existingNotes = studentData?.studentInfo?.physicalDocumentNote;

  useEffect(() => {
    if (!initialized && course) {
      console.log(initialized, course);
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
          dueBy: note.dueBy ? new Date(note.dueBy) : undefined
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

  const updateFormValue = async (doc: Document) => {
    
    const response = await updateStudentDocuments(doc);

    if (response) {
      toast.success('Documents updated successfully');
    } else {
      setError('Failed to update documents');
      toast.error('Failed to update documents');
    }
  };

  const handleStatusChange = (docId: string, status: PhysicalDocumentNoteStatus) => {
    
    const doc: Document | undefined = documents?.find((doc) => doc.id === docId);

    const updatedDocs = documents.map((doc) =>
      doc.id === docId ? { ...doc, status } : doc
    );

    setDocuments(updatedDocs);

    if (doc) {
      updateFormValue(doc);
    }

  };

  const handleDueDateChange = (docId: string, date: Date | undefined) => {
    const doc: Document | undefined = documents?.find((doc) => doc.id === docId);
    const updatedDocs = documents.map((doc) => (doc.id === docId ? { ...doc, dueBy: date } : doc));
    setDocuments(updatedDocs);
    if (doc) {
      updateFormValue(doc);
    }
  };

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
                        {doc.dueBy ? format(doc.dueBy, 'dd/MM/yyyy') : 'Pick a due date'}
                      </Button>
                    </PopoverTrigger>
                    {doc.status === PhysicalDocumentNoteStatus.PENDING && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={doc.dueBy}
                          onSelect={(date) => handleDueDateChange(doc.id, date)}
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
