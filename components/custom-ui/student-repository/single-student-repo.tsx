'use client';

// External dependencies
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Internal types and constants
import { StudentData } from './helpers/interface';
import { StudentRepositoryTabs } from './helpers/enum';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { removeNullValues } from '@/lib/utils';
import { updateStudentDetailsRequestSchema } from './helpers/schema';

// Components
import MoreDetailsHeader from './more-details-header/more-details-header';
import { useMoreDetailsHeaderContext } from './more-details-header/more-details-header-context';
import StudentDetailsTab from './tabs/student-details-tab';
import AcademicDetailsTab from './tabs/academic-details-tab';
import StudentProfileView from './student-profile-view';

// API
import { fetchStudent } from './helpers/api';
import { getPersonalDetailsFormData } from './helpers/helper';
import AllDocumentsTab from './tabs/all-documents-tab';

const SingleStudentRepositoryPage: React.FC = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const { headerActiveItem } = useMoreDetailsHeaderContext();
  const [studentData, setStudentData] = React.useState<StudentData | null>(null);

  // Form initialization for personal details
  const personalDetailsForm = useForm<z.infer<typeof updateStudentDetailsRequestSchema>>({
    resolver: zodResolver(updateStudentDetailsRequestSchema),
    mode: 'all'
  });

  const HEADER_ITEMS = {
    [StudentRepositoryTabs.STUDENT_DETAILS]: {
      title: 'Student Details',
      route: SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(
        universityId,
        'student-details',
        studentId || ''
      )
    },
    [StudentRepositoryTabs.ACADEMIC_DETAILS]: {
      title: 'Academic Details',
      route: SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(
        universityId,
        'academic-details',
        studentId || ''
      )
    },
    [StudentRepositoryTabs.ALL_DOCUMENTS]: {
      title: 'All Documents',
      route: SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(
        universityId,
        'all-documents',
        studentId || ''
      )
    },
    [StudentRepositoryTabs.OFFICE_DETAILS]: {
      title: 'Office Details',
      route: SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(
        universityId,
        'office-details',
        studentId || ''
      )
    }
  };

  // Fetch student data
  const studentQuery = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => fetchStudent(studentId || ''),
    enabled: !!studentId
  });

  // Process student data when it's available
  useEffect(() => {
    if (!studentQuery.data) return;

    const cleanedData: StudentData = removeNullValues(studentQuery.data);

    setStudentData(cleanedData);

    initializeFormWithStudentData(cleanedData);
  }, [studentQuery.data]);

  const initializeFormWithStudentData = (data: StudentData) => {
    const formData = getPersonalDetailsFormData(data);
    personalDetailsForm.reset(formData);
  };

  // Common class names for styling
  const commonFormItemClass = 'col-span-1 min-h-[50px] gap-y-0';
  const commonFieldClass = 'gap-y-0';

  const renderTabContent = () => {
    if (!headerActiveItem) return null;

    if (headerActiveItem === HEADER_ITEMS[StudentRepositoryTabs.STUDENT_DETAILS].title) {
      return (
        studentData && (
          <StudentDetailsTab
            personalDetailsForm={personalDetailsForm}
            commonFormItemClass={commonFormItemClass}
            commonFieldClass={commonFieldClass}
            studentData={studentData}
            setStudentData={setStudentData}
          />
        )
      );
    }

    if (
      headerActiveItem === HEADER_ITEMS[StudentRepositoryTabs.ACADEMIC_DETAILS].title &&
      studentData
    ) {
      return <AcademicDetailsTab studentData={studentData} />;
    }

    if (
      headerActiveItem === HEADER_ITEMS[StudentRepositoryTabs.ALL_DOCUMENTS].title &&
      studentData
    ) {
      return <AllDocumentsTab studentData={studentData} setStudentData={setStudentData} />;
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center mb-2">
        <h1 className="text-xl font-bold">Student Profile</h1>
      </div>

      {/* Student Profile View */}
      {studentData && <StudentProfileView studentData={studentData} />}

      {/* Tabs Navigation */}
      <MoreDetailsHeader headerItems={HEADER_ITEMS} />

      {/* Tab Content */}
      <div className="mt-2">{renderTabContent()}</div>
    </div>
  );
};

export default SingleStudentRepositoryPage;
