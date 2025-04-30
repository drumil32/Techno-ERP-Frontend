import SingleStudentRepositoryPage from '@/components/custom-ui/student-repository/single-student-repo'
import StudentRepositoryLayout from '@/components/layout/student-repository-layout'
import React from 'react'

const SingleStudentRepository = () => {

  return (
    <StudentRepositoryLayout>
      <SingleStudentRepositoryPage />
    </StudentRepositoryLayout>
  )
}

export default SingleStudentRepository