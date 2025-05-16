'use client';

import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { StudentDetails, StudentFeeInformationResponse } from '@/types/finance';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import SemesterWiseFeesDetails from './details-tables/semester-wise-fees-details';
import AllTransactionsDetails from './details-tables/all-transaction-details';
import FeesBreakupDetails from './details-tables/fee-breakup-details';
import { FeesPaidStatus } from '@/types/enum';
import { fetchStudentFeeInformation } from './helpers/fetch-data';
import StudentData from './student-data';
import AdvancedTechnoBreadcrumb from '@/components/custom-ui/breadcrump/advanced-techno-breadcrumb';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import Loading from '@/app/c/marketing/loading';

export default function SelectedStudentDuesDetails() {
  const param = useParams();
  const studentId = param.studentId as string;

  const studentFeesInformationQuery = useQuery<StudentFeeInformationResponse, Error>({
    queryKey: ['studentFeesInformation', studentId],
    queryFn: (context) =>
      fetchStudentFeeInformation(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData
  });

  const isLoading = studentFeesInformationQuery.isLoading;
  const studentFeesInformation = studentFeesInformationQuery.data;

  const studentData: StudentDetails = {
    studentName: studentFeesInformation?.studentName || '',
    fatherName: studentFeesInformation?.fatherName || '',
    feeStatus: (studentFeesInformation?.feeStatus as FeesPaidStatus) || '',
    studentID: studentFeesInformation?.studentID || '',
    course: studentFeesInformation?.course || '',
    HOD: studentFeesInformation?.HOD || '',
    currentSemester: studentFeesInformation?.currentSemester || 0,
    extraBalance: studentFeesInformation?.extraBalance
  };

  const semesterWiseFeesDetails = studentFeesInformation?.semesterWiseFeeInformation || [];
  const transactionHistory = studentFeesInformation?.transactionHistory || [];
  const semFeeBreakUp = studentFeesInformation?.semesterBreakUp || [];

  const breadcrumbItems = [
    { title: 'Finance', route: SITE_MAP.FINANCE.DEFAULT },
    { title: 'Student Dues', route: SITE_MAP.FINANCE.STUDENT_DUES },
    { title: studentData.studentID, route: SITE_MAP.FINANCE.STUDENT_DUES + '/' + studentId }
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      <AdvancedTechnoBreadcrumb items={breadcrumbItems} />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <TechnoPageHeading title="Student Dues" />
          <StudentData studentData={studentData} />
          <SemesterWiseFeesDetails
            semesterWiseFeesInformation={semesterWiseFeesDetails}
            studentDetails={studentData}
          />
          <AllTransactionsDetails transactionHistory={transactionHistory} studentId={studentId} />
          <FeesBreakupDetails
            semFeesBreakUp={semFeeBreakUp}
            studentName={studentData?.studentName}
          />
        </>
      )}
    </div>
  );
}
