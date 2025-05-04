// React and React Hook Form imports
import React from 'react';
import { FieldValues } from 'react-hook-form';

// UI component imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Utility and type imports
import { getOrdinalSuffix } from '@/lib/utils';
import ResultsTable from './result-table';
import { Semester } from './helpers/interface';

interface SingleSemesterDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  semesterNo: number;
  semester: Semester;
}

const SingleSemesterDetailsSection: React.FC<SingleSemesterDetailsFormPropInterface> = ({
  semesterNo,
  semester
}) => {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`${getOrdinalSuffix(semesterNo)}-semester-details`}
    >
      <AccordionItem value={`${getOrdinalSuffix(semesterNo)}-semester-details`}>
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3> {getOrdinalSuffix(semesterNo)} Semester Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <ResultsTable subjects={semester?.subjects || []} />
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default SingleSemesterDetailsSection;
