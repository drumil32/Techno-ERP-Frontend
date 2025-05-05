import { SemesterWiseFeeInformation, StudentDetails } from "@/types/finance"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RecordPaymentDialogue from "./record-payment-dialogue"

type ExtendedSemesterWiseFeeInformation = SemesterWiseFeeInformation & {
  sno: number;
  dueFees: number;
};

export default function SemesterWiseFeesDetails({ studentDetails, semesterWiseFeesInformation }: { studentDetails: StudentDetails, semesterWiseFeesInformation: SemesterWiseFeeInformation[] }) {

  const extendedSemesterWiseFeesInformation: ExtendedSemesterWiseFeeInformation[] =
    semesterWiseFeesInformation.map((item, index) => ({
      ...item,
      sno: index + 1,
      dueFees: (item.finalFee ?? 0) - (item.paidAmount ?? 0),
    }));


  const feeTotals = semesterWiseFeesInformation.reduce(
    (totals, item) => {
      totals.finalFee += item.finalFee ?? 0
      totals.paidAmount += item.paidAmount ?? 0
      totals.dueFees += (item.finalFee - item.paidAmount)
      return totals
    },
    { finalFee: 0, paidAmount: 0, dueFees: 0 }
  )

  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center">
        <div className="font-semibold text-[16px]">Semester-wise Fees Details</div>
        <RecordPaymentDialogue studentDetails={studentDetails} />
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
          {extendedSemesterWiseFeesInformation.map((semFee) => (
            <TableRow key={semFee.sno}>
              <TableCell>{semFee.sno}</TableCell>
              <TableCell>{semFee.academicYear}</TableCell>
              <TableCell>{semFee.semesterNumber}</TableCell>
              <TableCell>{studentDetails.course}</TableCell>
              <TableCell className="text-right">{semFee.finalFee != null ? `₹ ${semFee.finalFee}` : '__'}</TableCell>
              <TableCell className="text-right">{semFee.paidAmount != null ? `₹ ${semFee.paidAmount}` : '__'}</TableCell>
              <TableCell className="text-right">{semFee.dueFees != null ? `₹ ${semFee.dueFees}` : '__'}</TableCell>
              {/* <TableCell className=" pl-8">{semFee.dueDate ?? '--'}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="rounded-l-[5px]" colSpan={4}>Total</TableCell>
            <TableCell className="text-right">₹{feeTotals?.finalFee}</TableCell>
            <TableCell className="text-right">₹{feeTotals?.paidAmount}</TableCell>
            <TableCell className="text-right">₹{feeTotals?.dueFees}</TableCell>
            <TableCell className="rounded-r-[5px]">{""}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
