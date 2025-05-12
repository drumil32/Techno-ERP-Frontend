import React from 'react';
import CurrentAcademicDetailsSection from '../sub-sections/current-academic-details';
import SemesterDetailsSection from '../sub-sections/semester-details';
import { StudentData } from '../helpers/interface';

interface AcademicDetailsTabProps {
  studentData: StudentData;
}
const AcademicDetailsTab: React.FC<AcademicDetailsTabProps> = ({ studentData }) => {
  return (
    <>
      <CurrentAcademicDetailsSection studentData={studentData} />
      <SemesterDetailsSection studentData={studentData} />
    </>
  );
};

export default AcademicDetailsTab;
