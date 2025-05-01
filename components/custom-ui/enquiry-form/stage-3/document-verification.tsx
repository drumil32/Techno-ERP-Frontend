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
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DocumentType } from '@/types/enum';

type VerificationStatus = 'verified' | 'pending' | 'not-applicable';

type Document = {
  id: string;
  type: DocumentType;
  verificationStatus: VerificationStatus;
  dueDate?: Date;
};
type DocumentVerificationProps = {
  form: any;
};
const DocumentVerificationSection: React.FC<DocumentVerificationProps> = ({ form }) => {
  const [documents, setDocuments] = useState<Document[]>(
    Object.values(DocumentType).map((type, index) => ({
      id: `${index + 1}`,
      type,
      verificationStatus: 'pending' as VerificationStatus
    }))
  );

  const handleStatusChange = (docId: string, status: VerificationStatus) => {
    setDocuments((docs) =>
      docs.map((doc) => (doc.id === docId ? { ...doc, verificationStatus: status } : doc))
    );
  };

  const handleDueDateChange = (docId: string, date: Date | undefined) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === docId ? { ...doc, dueDate: date } : doc)));
  };

  const onSubmit = () => {
    console.log('Submitting verification data:', documents);
  };

  const getStatusIcon = (status: VerificationStatus) => {
    const iconClass = 'h-5 w-5 ml-2';
    switch (status) {
      case 'verified':
        return <CheckCircle2 className={cn(iconClass, 'text-green-500')} />;
      case 'not-applicable':
        return <XCircle className={cn(iconClass, 'text-gray-500')} />;
      case 'pending':
        return <Clock className={cn(iconClass, 'text-yellow-500')} />;
      default:
        return null;
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      <AccordionItem value="document-verification" className="border-b-0">
        <AccordionTrigger className="w-full items-center">
          <h3 className="font-inter text-[16px] font-semibold">Document Verification Section</h3>
          <hr className="flex-1 border-t border-[#DADADA] ml-2" />
        </AccordionTrigger>

        <AccordionContent className="p-6 bg-white rounded-[10px]">
          <div className="w-full space-y-6">
            {documents.map((doc) => (
              <div key={doc.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-4 font-medium">{doc.type.replace(/_/g, ' ')}</div>

                <div className="md:col-span-3 flex items-center">
                  <Select
                    value={doc.verificationStatus}
                    onValueChange={(value) =>
                      handleStatusChange(doc.id, value as VerificationStatus)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="not-applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                  {getStatusIcon(doc.verificationStatus)}
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !doc.dueDate && 'text-muted-foreground'
                        )}
                      >
                        {doc.dueDate ? format(doc.dueDate, 'dd/MM/yyyy') : 'Pick a due date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={doc.dueDate}
                        onSelect={(date) => handleDueDateChange(doc.id, date)}
                        disabled={(date) => date <= new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-6">
              <Button onClick={onSubmit}>Save Verification Details</Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DocumentVerificationSection;
