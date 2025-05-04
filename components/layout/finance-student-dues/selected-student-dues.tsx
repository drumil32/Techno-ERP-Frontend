'use client'

import TechnoPageHeading from "@/components/custom-ui/page-heading/techno-page-heading"
import { StudentDetails } from "@/types/finance"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchStudentDetails } from "./helpers/mock-api"
import SemesterWiseFeesDetails from "./details-tables/semester-wise-fees-details"
import AllTransactionsDetails from "./details-tables/all-transaction-details"
import FeesBreakupDetails from "./details-tables/fee-breakup-details"
import { Label } from "@/components/ui/label"
import FeesPaidTag from "./fees-paid-status-tag"
import { FeesPaidStatus } from "@/types/enum"

export default function SelectedStudentDuesDetails() {
  const param = useParams()
  const studentDuesId = param.studentDuesId as string

  const studentDetails = useQuery<StudentDetails, Error>({
    queryKey: ['studentDetails', studentDuesId],
    queryFn: fetchStudentDetails,
    placeholderData: (previousData) => previousData,

  })

  return (
    <div className="flex flex-col gap-6 pb-6">
      <TechnoPageHeading title="Student Dues" />
      <div className="w-full flex flex-row gap-40 px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
        <div className="w-1/6 flex flex-col gap-3">
          <div className="flex w-full h-7">
            <Label className="text-[#666666] w-1/2">Student Name</Label>
            <Label>{studentDetails.data?.studentName}</Label>
          </div>
          <div className="flex w-full h-7">
            <Label className="text-[#666666] w-1/2">Student ID</Label>
            <Label>{studentDetails.data?.studentId}</Label>
          </div>
          <div className="flex w-full h-7">
            <Label className="text-[#666666] w-1/2">Father's Name</Label>
            <Label>{studentDetails.data?.fatherName}</Label>
          </div>
        </div>
        <div className="w-1/6 flex flex-col gap-3">
          <div className="flex w-full h-7">
            <Label className="text-[#666666] w-1/2">Fees Status</Label>
            { studentDetails.data?.feeStatus && 
            <FeesPaidTag status={studentDetails.data?.feeStatus as FeesPaidStatus}/>
            }
          </div>
          <div className="flex w-full h-7">
            <Label className="text-[#666666] w-1/2">Course</Label>
            <Label>{studentDetails.data?.course}</Label>
          </div>
          <div className="flex w-full h-7">
            <Label className="text-[#666666] w-1/2">HOD</Label>
            <Label>{studentDetails.data?.hod}</Label>
          </div>
        </div>
      </div>
      <SemesterWiseFeesDetails studentDuesId={studentDuesId} studentDetails={studentDetails.data} />
      <AllTransactionsDetails studentDuesId={studentDuesId} />
      <FeesBreakupDetails studentDuesId={studentDuesId} studentName={studentDetails.data?.studentName} />
    </div>
  )
}
