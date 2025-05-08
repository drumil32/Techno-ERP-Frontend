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
import { useState, useEffect, useCallback, useMemo } from 'react';
import { format, parse } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UseFormReturn } from 'react-hook-form';
import axios from 'axios';
import { API_DOMAIN } from '@/common/constants/apiEndpoints';

export enum PhysicalDocumentNoteStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

type Document = {
  id: string;
  type: string;
  status: PhysicalDocumentNoteStatus;
  dueBy?: Date;
  touched?: boolean;
};

type DocumentVerificationProps = {
  form: UseFormReturn<any>;
  isViewable?: boolean;
  onValidationChange?: (isValid: boolean) => void;
};

const DocumentVerificationSection: React.FC<DocumentVerificationProps> = ({
  form,
  isViewable,
  onValidationChange
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTouched, setIsTouched] = useState(false);
  const course = form.watch('course');
  const physicalDocumentNote = form.watch('physicalDocumentNote');

  const isValid = useMemo(() => {
    if (isViewable) return true;
    return !documents.some(
      (doc) => doc.status === PhysicalDocumentNoteStatus.PENDING && !doc.dueBy
    );
  }, [documents, isViewable, isTouched]);

  const initializeDocuments = useCallback(
    async (course: string) => {
      try {
        setLoading(true);
        setError(null);

        const existingNotes = form.getValues('physicalDocumentNote');
        if (existingNotes?.length > 0) {
          setDocuments(
            existingNotes.map((note: any, index: number) => ({
              id: `${index + 1}`,
              type: note.type || '',
              status: note.status || PhysicalDocumentNoteStatus.PENDING,
              dueBy: note.dueBy ? parse(note.dueBy, 'dd/MM/yyyy', new Date()) : undefined,
              touched: false
            }))
          );
          return;
        }

        const response = await axios.get(
          `${API_DOMAIN}/course-metadata/${course}/admission-documents`,
          { withCredentials: true }
        );

        const docList: string[] = response.data?.DATA?.documentTypeList || [];
        if (docList.length > 0) {
          const initialDocs = docList.map((docName, index) => ({
            id: `${index + 1}`,
            type: docName,
            status: PhysicalDocumentNoteStatus.PENDING,
            dueBy: undefined,
            touched: false
          }));
          setDocuments(initialDocs);
          form.setValue('physicalDocumentNote', initialDocs);
        } else {
          setError('No documents configured for this course');
        }
      } catch (error: any) {
        setError(error.response?.data?.message || error.message || 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    },
    [form]
  );

  useEffect(() => {
    if (course) initializeDocuments(course);
  }, [course, initializeDocuments]);

  useEffect(() => {
    onValidationChange?.(isValid);
  }, [isValid, onValidationChange]);

  const updateDocuments = useCallback(
    (updater: (prev: Document[]) => Document[]) => {
      setDocuments((prev) => {
        const updated = updater(prev);
        form.setValue(
          'physicalDocumentNote',
          updated.map((doc) => ({
            type: doc.type,
            status: doc.status,
            dueBy: doc.dueBy ? format(doc.dueBy, 'dd/MM/yyyy') : undefined
          }))
        );
        return updated;
      });
      setIsTouched(true);
    },
    [form]
  );

  const handleStatusChange = useCallback(
    (docId: string, status: PhysicalDocumentNoteStatus) => {
      updateDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, status, touched: true } : doc))
      );
    },
    [updateDocuments]
  );

  const handleDueDateChange = useCallback(
    (docId: string, date: Date | undefined) => {
      updateDocuments((prev) =>
        prev.map((doc) => (doc.id === docId ? { ...doc, dueBy: date, touched: true } : doc))
      );
    },
    [updateDocuments]
  );

  const getStatusIcon = useCallback((status: PhysicalDocumentNoteStatus) => {
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
  }, []);

  const renderStatusView = (status: PhysicalDocumentNoteStatus) => {
    switch (status) {
      case PhysicalDocumentNoteStatus.VERIFIED:
        return <span className="text-green-600">Verified</span>;
      case PhysicalDocumentNoteStatus.NOT_APPLICABLE:
        return <span className="text-blue-500">Not Applicable</span>;
      case PhysicalDocumentNoteStatus.PENDING:
        return <span className="text-yellow-500">Pending</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className="py-4 text-gray-500">Loading document verification...</div>;
  if (error) return <div className="py-4 text-red-500">{error}</div>;
  if (documents.length === 0)
    return <div className="py-4 text-gray-500">No documents to verify.</div>;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-4"
      defaultValue="document-verification"
    >
      <AccordionItem value="document-verification" className="border-b-0">
        <AccordionTrigger className="w-full items-center">
          <h3 className="font-inter text-[16px] font-semibold">Document Verification Section</h3>
          <hr className="flex-1 border-t border-[#DADADA] ml-2" />
        </AccordionTrigger>
        <AccordionContent className="p-6 bg-white rounded-[10px] space-y-8">
          {documents.map((doc) => (
            <div key={doc.id} className="space-y-2">
              <div className="text-sm font-semibold text-gray-800">
                {doc.type.replace(/_/g, ' ')}
              </div>
              <div className="flex flex-row items-center">
                {isViewable ? (
                  <div className="flex items-center w-[400px]">
                    {renderStatusView(doc.status)}
                    {getStatusIcon(doc.status)}
                  </div>
                ) : (
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
                        <SelectItem value={PhysicalDocumentNoteStatus.VERIFIED}>
                          Verified
                        </SelectItem>
                        <SelectItem value={PhysicalDocumentNoteStatus.PENDING}>Pending</SelectItem>
                        <SelectItem value={PhysicalDocumentNoteStatus.NOT_APPLICABLE}>
                          Not Applicable
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {getStatusIcon(doc.status)}
                  </div>
                )}
                <div>
                  {isViewable ? (
                    <div className="ml-5 w-[200px] text-left">
                      {doc.dueBy ? format(doc.dueBy, 'dd/MM/yyyy') : '-'}
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
              {/* {!isViewable &&
                doc.touched &&
                doc.status === PhysicalDocumentNoteStatus.PENDING &&
                !doc.dueBy && (
                  <p className="text-red-500 text-sm">Due date is required for pending documents</p>
                )} */}
            </div>
          ))}
          {!isValid && !isViewable && isTouched && (
            <div className="text-red-500 text-sm">Set due dates for all pending documents</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DocumentVerificationSection;
