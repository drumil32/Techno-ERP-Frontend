'use client'

import DynamicInfoGrid from "@/components/custom-ui/info-grid/info-grid"
import TechnoPageHeading from "@/components/custom-ui/page-heading/techno-page-heading"
import { StudentDetails } from "@/types/finance"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { fetchStudentDetails } from "./helpers/mock-api"
import SemesterWiseFeesDetails from "./details-tables/semester-wise-fees-details"
import AllTransactionsDetails from "./details-tables/all-transaction-details"
import FeesBreakupDetails from "./details-tables/fee-breakup-details"

export default function SelectedStudentDuesDetails() {
  const param = useParams()
  const studentDuesId = param.studentDuesId as string
  const rows = [3, 3];

  const studentDetails = useQuery<StudentDetails, Error>({
    queryKey: ['studentDetails', studentDuesId],
    queryFn: fetchStudentDetails,
    placeholderData: (previousData) => previousData,

  })

  return (
    <div className="flex flex-col gap-6 pb-6">
      <TechnoPageHeading title="Student Dues" />
      {/*
            <DynamicInfoGrid
                columns={3}
                rowsPerColumn={rows}
                data={studentDetails.data ?? {}}
                design={{
                    containerWidth: "1339px",
                    containerHeight: "119px",
                    columnWidth: "475px",
                    columnHeight: "96px",
                    columnGap: "65px",
                    rowGap: "12px",
                    keyWidth: "125px",
                    valueWidth: "333px",
                    fontSize: "14px"
                }}
            />
            */}
      <SemesterWiseFeesDetails studentDuesId={studentDuesId} studentDetails={studentDetails.data}/>
      <AllTransactionsDetails studentDuesId={studentDuesId} studentName={studentDetails.data?.studentName}/>
      <FeesBreakupDetails studentDuesId={studentDuesId} />
    </div>
  )
}
