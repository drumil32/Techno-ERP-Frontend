import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { useParams } from 'next/navigation';
import { EnquiryDocument, SingleEnquiryUploadDocument } from './single-document-form';
import { DocumentType } from '@/types/enum';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEnquiry } from '../../stage-1/enquiry-form-api';

export const mandatoryDocuments = [
  DocumentType.PHOTO,
  DocumentType.TENTH_MARKSHEET,
  DocumentType.GRADUATION_FINAL_YEAR_MARKSHEET,
  DocumentType.TC_MIGRATION,
  DocumentType.ALLOTMENT_LETTER,
  DocumentType.GAP_AFFIDAVIT,
  DocumentType.CASTE_CERTIFICATE,
  DocumentType.EWS_CERTIFICATE
];

const otherDocuments = [
    DocumentType.TENTH_MARKSHEET,
    DocumentType.TENTH_CERTIFICATE,
    DocumentType.TWELFTH_CERTIFICATE,
    DocumentType.CHARACTER_CERTIFICATE,
    DocumentType.ANTI_RAGGING_BY_STUDENT,
    DocumentType.ANTI_RAGGING_BY_PARENT,
    DocumentType.INCOME_CERTIFICATE,
    DocumentType.NIVAS_CERTIFICATE,
    DocumentType.AADHAR,
    DocumentType.DECLARATION_FILLED,
    DocumentType.PHYSICALLY_HANDICAPPED_CERTIFICATE,
]

const AllDocuments = ({enquiryDocuments}: {enquiryDocuments:any}) => {
  const params = useParams();
  const enquiry_id = params.id as string;

  const queryClient = useQueryClient();

  // const {
  //   data: enquiryData,
  //   error,
  //   isLoading: isLoadingEnquiry
  // } = useQuery<any>({
  //   queryKey: ['enquireFormData', enquiry_id],
  //   queryFn: () => (enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null')),
  //   enabled: !!enquiry_id
  // });

  // let enquiryDocuments: EnquiryDocument[] = enquiryData?.documents ?? [];

  const findExistingDocument = (docType: DocumentType): EnquiryDocument | undefined => {
    const apiDocType = docType.toString();
    return enquiryDocuments.find((doc:any) => doc.type == apiDocType);
  };

  const onUploadSuccess = (data: any) => {
    console.log("Invalidating enquiry data after upload...");

    queryClient.invalidateQueries({ queryKey: ['enquireFormData', enquiry_id] });
    // enquiryDocuments = data.documents;
  };

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="student-details">
          <div className="space-y-2">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold">Mandatory Documents</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>

            <AccordionContent className="bg-white p-4 rounded-[10px]">
              {mandatoryDocuments.map((docType) => (
                <SingleEnquiryUploadDocument
                  key={docType.toString()}
                  enquiryId={enquiry_id}
                  documentType={docType}
                  existingDocument={findExistingDocument(docType)}
                  onUploadSuccess={onUploadSuccess}
                />
              ))}
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>

      <Accordion type="single" collapsible>
        <AccordionItem value="student-details">
          <div className="space-y-2">
            <AccordionTrigger className="w-full items-center">
              <h3 className="font-inter text-[16px] font-semibold">Other Documents</h3>
              <hr className="flex-1 border-t border-[#DADADA] ml-2" />
            </AccordionTrigger>

            <AccordionContent className="bg-white p-4 rounded-[10px]">
              {otherDocuments.map((docType) => (
                <SingleEnquiryUploadDocument
                  key={docType.toString()}
                  enquiryId={enquiry_id}
                  documentType={docType}
                  existingDocument={findExistingDocument(docType)}
                  onUploadSuccess={onUploadSuccess}
                />
              ))}
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default AllDocuments;
