import { SemesterFeesResponse, StudentDetails } from "@/types/finance"
import { useQuery } from "@tanstack/react-query"
import { fetchSemesterFees } from "../helpers/mock-api"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import RecordPaymentDialogue from "./record-payment-dialogue"

export default function SemesterWiseFeesDetails({ studentDuesId, studentDetails }: { studentDuesId: string, studentDetails: StudentDetails | undefined }) {
  const semesterWise = useQuery<SemesterFeesResponse, Error>({
    queryKey: ['semesterFeeDetail', studentDuesId],
    queryFn: fetchSemesterFees,
    placeholderData: (previousData) => previousData,
  })

  const feeTotals = semesterWise.data?.details.reduce(
    (totals, item) => {
      totals.finalFeesDue += item.finalFeesDue ?? 0
      totals.feesPaid += item.feesPaid ?? 0
      totals.dueFees += item.dueFees ?? 0
      return totals
    },
    { finalFeesDue: 0, feesPaid: 0, dueFees: 0 }
  )

  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center">
        <div className="font-semibold text-[16px]">Semester-wise Fees Details</div>
        <RecordPaymentDialogue studentDetails={studentDetails}/>
      </div>
      <Table className="w-3/5">
        <TableHeader className="bg-[#F7F7F7] ">
          <TableRow>
            <TableHead className="rounded-l-[5px]">S. No</TableHead>
            <TableHead>Academic Year</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Course</TableHead>
            <TableHead className="text-right">Final Fees Due</TableHead>
            <TableHead className="text-right">Fees Paid</TableHead>
            <TableHead className="text-right">Due Fees</TableHead>
            <TableHead className="rounded-r-[5px]  pl-8" >Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {semesterWise.data?.details.map((semFee) => (
            <TableRow key={semFee.semester}>
              <TableCell>{semFee.sno}</TableCell>
              <TableCell>{semFee.academicYear}</TableCell>
              <TableCell>{semFee.semester}</TableCell>
              <TableCell>{semFee.course}</TableCell>
              <TableCell className="text-right">{semFee.finalFeesDue != null ? `₹ ${semFee.finalFeesDue}` : '__'}</TableCell>
              <TableCell className="text-right">{semFee.feesPaid != null ? `₹ ${semFee.feesPaid}` : '__'}</TableCell>
              <TableCell className="text-right">{semFee.dueFees != null ? `₹ ${semFee.dueFees}` : '__'}</TableCell>
              <TableCell className=" pl-8">{semFee.dueDate ?? '--'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="rounded-l-[5px]" colSpan={4}>Total</TableCell>
            <TableCell className="text-right">₹{feeTotals?.finalFeesDue}</TableCell>
            <TableCell className="text-right">₹{feeTotals?.feesPaid}</TableCell>
            <TableCell className="text-right">₹{feeTotals?.dueFees}</TableCell>
            <TableCell className="rounded-r-[5px]">{""}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
