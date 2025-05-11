// React and React Hook Form imports
import React from 'react';
import { FieldValues } from 'react-hook-form';

// UI components imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Utility and type imports
import { StudentData } from '../helpers/interface';
import { DisplayField } from '../display-field';
import { formatYearRange } from '@/lib/utils';

// ---

interface CurrentAcademicDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  studentData: StudentData;
}

const CurrentAcademicDetailsSection: React.FC<CurrentAcademicDetailsFormPropInterface> = ({
  studentData
}) => {
  // Fields to display when not in edit mode
  const displayFields = [
    { label: 'Course Name', value: studentData.courseName },
    { label: 'Course Code', value: studentData.courseCode },
    { label: 'Department Name', value: studentData.departmentName },
    {
      label: 'Current Year',
      value: studentData?.currentSemester
        ? Math.ceil(studentData.currentSemester / 2).toString()
        : null
    },
    { label: 'Current Semester', value: studentData?.currentSemester },
    { label: 'Academic Year', value: formatYearRange(studentData.currentAcademicYear) },
    { label: 'Cumulative CGPA', value: studentData?.cumulativeCGPA },
    { label: 'Cumulative CPGA', value: studentData?.cumulativeCPGA },
    { label: "Father's Occupation", value: studentData?.studentInfo?.fatherOccupation }
  ];

  return (
    <Accordion type="single" collapsible defaultValue="current-academic-details">
      <AccordionItem value="current-academic-details">
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="flex w-full items-center justify-between gap-2">
            {/* Title & Divider */}
            <h3 className="font-inter text-[16px] font-semibold">Current Academic Details</h3>
            <hr className="flex-1 border-t border-[#DADADA]" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid grid-cols-3 gap-y-6 bg-white p-4 rounded-[10px]">
              {displayFields.map(({ label, value }, index) => (
                <DisplayField
                  key={index}
                  label={label}
                  value={value != null ? String(value) : null}
                />
              ))}
            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default CurrentAcademicDetailsSection;
