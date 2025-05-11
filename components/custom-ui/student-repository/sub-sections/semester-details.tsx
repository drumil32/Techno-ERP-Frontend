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
import SingleSemesterDetailsSection from '../single-semester-details';
import { Semester, StudentData } from '../helpers/interface';

interface AddressDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  studentData: StudentData;
}

const SemesterDetailsSection: React.FC<AddressDetailsFormPropInterface> = ({ studentData }) => {
  const totalSemester = studentData?.totalSemester;
  const semesterData: Semester[] = studentData?.semester;

  return (
    <Accordion type="single" collapsible defaultValue="semester-details">
      <AccordionItem value="semester-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3 className="font-inter text-[16px] font-semibold">Semester Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            {Array.from({ length: totalSemester }, (_, index) => index + 1).map((semester) => (
              <SingleSemesterDetailsSection
                key={semester}
                semesterNo={semester}
                semester={semesterData[semester - 1] || {}}
              />
            ))}
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default SemesterDetailsSection;
