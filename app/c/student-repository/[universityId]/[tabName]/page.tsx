import { MoreDetailsHeaderProvider } from '@/components/custom-ui/student-repository/more-details-header/more-details-header-context';
import SingleStudentRepositoryPage from '@/components/custom-ui/student-repository/single-student-repo';
import StudentRepositoryLayout from '@/components/layout/student-repository-layout';
import React from 'react';

const SingleStudentRepository = () => {
  return (
    <MoreDetailsHeaderProvider>
      <StudentRepositoryLayout>
        <SingleStudentRepositoryPage />
      </StudentRepositoryLayout>
    </MoreDetailsHeaderProvider>
  );
};

export default SingleStudentRepository;
