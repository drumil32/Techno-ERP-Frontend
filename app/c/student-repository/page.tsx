import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import StudentRepositoryPage from '@/components/custom-ui/student-repository/student-repo';
import StudentRepositoryLayout from '@/components/layout/student-repository-layout';
import React from 'react';

const StudentRepository = () => {
  return (
    <StudentRepositoryLayout>
      <TechnoFilterProvider key="student-repository" sectionKey="student-repository">
        <StudentRepositoryPage />
      </TechnoFilterProvider>
    </StudentRepositoryLayout>
  );
};

export default StudentRepository;
