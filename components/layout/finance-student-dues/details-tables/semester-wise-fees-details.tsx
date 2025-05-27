import { SemesterWiseFeeInformation, StudentDetails } from '@/types/finance';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import RecordPaymentDialog from './record-payment-dialog';
import { Course, CourseNameMapper } from '@/types/enum';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HandCoins } from 'lucide-react';

type ExtendedSemesterWiseFeeInformation = SemesterWiseFeeInformation & {
  sno: number;
  dueFees: number;
};

export default function SemesterWiseFeesDetails({
  studentDetails,
  semesterWiseFeesInformation
}: {
  studentDetails: StudentDetails;
  semesterWiseFeesInformation: SemesterWiseFeeInformation[];
}) {
  const extendedSemesterWiseFeesInformation: ExtendedSemesterWiseFeeInformation[] =
    semesterWiseFeesInformation.map((item, index) => ({
      ...item,
      sno: index + 1,
      dueFees: (item.finalFee ?? 0) - (item.paidAmount ?? 0)
    }));

  const feeTotals = semesterWiseFeesInformation.reduce(
    (totals, item) => {
      totals.finalFee += item.dueDate ? item.finalFee : 0;
      totals.paidAmount += item.dueDate ? item.paidAmount : 0;
      totals.dueFees += item.dueDate ? item.finalFee - item.paidAmount : 0;
      return totals;
    },
    { finalFee: 0, paidAmount: 0, dueFees: 0 }
  );

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-yellow-700 pb-3 border-b border-gray-100">
          <HandCoins className="h-6 w-6 text-yellow-600" />
          Semester-wise Fees Details
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between -mt-2">
        <div className="rounded-[5px] w-[65%] overflow-auto border-2 border-gray-100 relative">
          <Table className="w-full">
            <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1] ">
              <TableRow>
                <TableHead className="text-center w-[5%]">S. No</TableHead>
                <TableHead className="w-[15%]">Academic Year</TableHead>
                <TableHead className="text-center w-[7%] px-1">Semester</TableHead>
                <TableHead className="text-right w-[17%]">Final Fees</TableHead>
                <TableHead className="text-right w-[17%]">Fees Paid</TableHead>
                <TableHead className="text-right w-[17%]">Due Fees</TableHead>
                <TableHead className="text-left w-[17%] ">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extendedSemesterWiseFeesInformation.map((semFee) => (
                <TableRow key={semFee.sno}>
                  <TableCell className="text-center">{semFee.sno}</TableCell>
                  <TableCell>{semFee.academicYear}</TableCell>
                  <TableCell className="text-center w-[2%] px-0">
                    0{semFee.semesterNumber}
                  </TableCell>
                  <TableCell className="text-right pl-0">
                    {semFee.finalFee != null && semFee.dueDate
                      ? `${semFee.finalFee.toLocaleString()}`
                      : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {semFee.paidAmount != null && semFee.dueDate
                      ? `${semFee.paidAmount.toLocaleString()}`
                      : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {semFee.dueFees != null && semFee.dueDate
                      ? `${semFee.dueFees.toLocaleString()}`
                      : '--'}
                  </TableCell>
                  <TableCell className=" ">
                    {semFee.dueDate ? format(semFee.dueDate, 'dd/MM/yyyy') : '--'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="font-bold">
              <TableRow className="bg-gray-300/70">
                <TableCell className="" colSpan={3}>
                  Total
                </TableCell>
                <TableCell className="text-right">
                  ₹{feeTotals?.finalFee.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ₹{feeTotals?.paidAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">₹{feeTotals?.dueFees.toLocaleString()}</TableCell>
                <TableCell className="">{''}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <RecordPaymentDialog studentDetails={studentDetails} />
      </CardContent>
    </Card>
  );
}
