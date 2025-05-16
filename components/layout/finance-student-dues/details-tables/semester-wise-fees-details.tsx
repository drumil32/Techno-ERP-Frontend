import { SemesterWiseFeeInformation, StudentDetails } from "@/types/finance"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import RecordPaymentDialog from "./record-payment-dialog"
import { Course, CourseNameMapper } from "@/types/enum";
import { format } from "date-fns";

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
      totals.finalFee += (item.dueDate ? item.finalFee : 0)
      totals.paidAmount += (item.dueDate ? item.paidAmount : 0)
      totals.dueFees += (item.dueDate ? item.finalFee - item.paidAmount : 0)
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
              <TableHead className="text-right">Final Fees</TableHead>
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
                <TableCell className="text-right">{semFee.finalFee != null && semFee.dueDate ? `₹ ${semFee.finalFee.toLocaleString()}` : '--'}</TableCell>
                <TableCell className="text-right">{semFee.paidAmount != null && semFee.dueDate ? `₹ ${semFee.paidAmount.toLocaleString()}` : '--'}</TableCell>
                <TableCell className="text-right">{semFee.dueFees != null && semFee.dueDate ? `₹ ${semFee.dueFees.toLocaleString()}` : '--'}</TableCell>
                <TableCell className=" pl-8">{semFee.dueDate ? format(semFee.dueDate, 'dd/MM/yyyy') : '--'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="rounded-l-[5px]" colSpan={3}>Total</TableCell>
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
