'use client'

import TechnoPageHeading from "@/components/custom-ui/page-heading/techno-page-heading"
import { StudentDetails, StudentFeeInformationResponse } from "@/types/finance"
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchStudentDetails } from "./helpers/mock-api"
import SemesterWiseFeesDetails from "./details-tables/semester-wise-fees-details"
import AllTransactionsDetails from "./details-tables/all-transaction-details"
import FeesBreakupDetails from "./details-tables/fee-breakup-details"
import { FeesPaidStatus } from "@/types/enum"
import { fetchStudentFeeInformation } from "./helpers/fetch-data"
import StudentData from "./student-data"

export default function SelectedStudentDuesDetails() {
  const param = useParams()
  const studentDuesId = param.studentDuesId as string

  const studentDetails = useQuery<StudentDetails, Error>({
    queryKey: ['studentDetails', studentDuesId],
    queryFn: fetchStudentDetails,
    placeholderData: (previousData) => previousData,

  })

  const studentFeesInfomationQuery = useQuery<StudentFeeInformationResponse, Error>({
    queryKey: ['studentFeesInfomation', studentDuesId],
    queryFn: (context) => fetchStudentFeeInformation(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData,
  })

  const studentFeesInfomation = studentFeesInfomationQuery.data

  const studentData: StudentDetails = {
    studentName: studentFeesInfomation?.studentName || '',
    fatherName: studentFeesInfomation?.fatherName || '',
    feeStatus: studentFeesInfomation?.feeStatus as FeesPaidStatus || '',
    studentID: studentFeesInfomation?.studentID || '',
    course: studentFeesInfomation?.course || '',
    HOD: studentFeesInfomation?.HOD || ''
  }

  const semesterWiseFeesDetails = studentFeesInfomation?.semesterWiseFeeInformation || []
  const transactionHistory = studentFeesInfomation?.transactionHistory || []
  const semFeeBreakUp = studentFeesInfomation?.semesterBreakUp || []

  return (
    <div className="flex flex-col gap-6 pb-6">
      <TechnoPageHeading title="Student Dues" />
      <StudentData studentData={studentData} />
      <SemesterWiseFeesDetails semesterWiseFeesInformation={semesterWiseFeesDetails} studentDetails={studentData} />
      <AllTransactionsDetails transactionHistory={transactionHistory} studentDuesId={studentDuesId} />
      <FeesBreakupDetails semFeesBreakUp={semFeeBreakUp} studentName={studentDetails.data?.studentName} />
    </div>
  )
}
