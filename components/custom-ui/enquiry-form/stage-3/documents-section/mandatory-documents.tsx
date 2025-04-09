import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useParams } from 'next/navigation';
import { SingleEnquiryUploadDocument } from './single-document-form';
import { DocumentType } from '@/types/enum';

const MandatoryDocuments = () => {
  const params = useParams();
  const enquiry_id = params.id as string;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Mandatory Documents</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>

            <SingleEnquiryUploadDocument
              enquiryId={enquiry_id}
              documentType={DocumentType.ANTI_RAGGING_BY_STUDENT}
            />
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default MandatoryDocuments;
