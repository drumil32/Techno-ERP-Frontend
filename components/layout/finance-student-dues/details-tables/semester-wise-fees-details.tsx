import { SemesterWiseFeeInformation, StudentDetails } from "@/types/finance"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RecordPaymentDialog from "./record-payment-dialog"
import { Course, CourseNameMapper } from "@/types/enum";

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
        <RecordPaymentDialog studentDetails={studentDetails} />
      </div>
      <div className="w-full overflow-x-auto">

        <Table className="w-3/5">
          <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1] ">
            <TableRow>
              <TableHead className="rounded-l-[5px] ">S. No</TableHead>
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
                <TableCell>0{semFee.semesterNumber}</TableCell>
                <TableCell>{CourseNameMapper[studentDetails.course as Course]}</TableCell>
                <TableCell className="text-right">{semFee.finalFee != null ? `₹ ${semFee.finalFee.toLocaleString()}` : '__'}</TableCell>
                <TableCell className="text-right">{semFee.paidAmount != null ? `₹ ${semFee.paidAmount.toLocaleString()}` : '__'}</TableCell>
                <TableCell className="text-right">{semFee.dueFees != null ? `₹ ${semFee.dueFees.toLocaleString()}` : '__'}</TableCell>
                <TableCell className=" pl-8">{semFee.dueDate ?? '--'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="rounded-l-[5px]" colSpan={4}>Total</TableCell>
              <TableCell className="text-right">₹{feeTotals?.finalFee.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{feeTotals?.paidAmount.toLocaleString()}</TableCell>
              <TableCell className="text-right">₹{feeTotals?.dueFees.toLocaleString()}</TableCell>
              <TableCell className="rounded-r-[5px]">{""}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
