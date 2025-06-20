import { SemesterBreakUp } from '@/types/finance';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { getFinanceFeeTypeLabel, getScheduleLabel } from '@/lib/enumDisplayMapper';
import UpdateFeeDetailDialog from './update-detail-fee-dialog';
import ShowHistoryDialog from './show-history-dialog';
import { sortFeeDetailsByOrder } from '../helpers/fee-order';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePen } from 'lucide-react';

export default function FeesBreakupDetails({
  semFeesBreakUp,
  studentName
}: {
  semFeesBreakUp: SemesterBreakUp[];
  studentName: string | undefined;
}) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [semWiseFeesBreakUpDetails, setSemWiseFeesBreakUpDetails] = useState<
    SemesterBreakUp['details']
  >([]);
  const [selectedSemesterId, setSelectedSemesterId] = useState('');

  useEffect(() => {
    if (semFeesBreakUp && semFeesBreakUp.length > 0) {
      const initialSemData =
        semFeesBreakUp.find((item) => item.semesterNumber === selectedSemester) ||
        semFeesBreakUp[0];

      setSelectedSemester(initialSemData.semesterNumber);
      setSelectedSemesterId(initialSemData.semesterId);

      const sortedDetails = sortFeeDetailsByOrder(
        initialSemData.details
      ) as SemesterBreakUp['details'];

      const processedDetails =
        sortedDetails.map((item, index) => ({
          ...item,
          sno: index + 1,
          totalDues: item.finalFee - item.paidAmount
        })) ?? [];
      setSemWiseFeesBreakUpDetails(processedDetails);
    }
  }, [semFeesBreakUp]);

  useEffect(() => {
    if (semFeesBreakUp) {
      const selectedSemData = semFeesBreakUp.find(
        (item) => item.semesterNumber === selectedSemester
      );

      if (selectedSemData) {
        setSelectedSemesterId(selectedSemData.semesterId);

        const sortedDetails = sortFeeDetailsByOrder(
          selectedSemData.details
        ) as SemesterBreakUp['details'];

        const processedDetails =
          sortedDetails.map((item, index) => ({
            ...item,
            sno: index + 1,
            totalDues: item.finalFee - item.paidAmount
          })) ?? [];
        setSemWiseFeesBreakUpDetails(processedDetails);
      }
    }
  }, [selectedSemester, semFeesBreakUp]);

  const feeTotals = semWiseFeesBreakUpDetails.reduce(
    (totals, item) => {
      totals.finalFee += item.finalFee ?? 0;
      totals.paidAmount += item.paidAmount ?? 0;
      totals.totalDues += item.finalFee - item.paidAmount;
      return totals;
    },
    { finalFee: 0, paidAmount: 0, totalDues: 0 }
  );

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(parseInt(value));
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-indigo-900 pb-3 border-b border-gray-100">
          <FilePen className="h-6 w-6 text-indigo-700" />
          Fee Breakup
          {/* <EditFeeBreakupDialogue studentName={studentName} semesterNumber={selectedSemester} feesBreakup={semWiseFeesBreakUpDetails} /> */}
        </CardTitle>
      </CardHeader>
      <CardContent className="-mt-2">
        <div className="flex gap-2 mb-4 items-center">
          <div className="text-[#5F5F5F]">Select Semester</div>
          <Select value={selectedSemester.toString()} onValueChange={handleSemesterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {semFeesBreakUp &&
                semFeesBreakUp.map((item) => (
                  <SelectItem key={item.semesterNumber} value={item.semesterNumber.toString()}>
                    {`Semester ${item.semesterNumber.toString().padStart(2, '0')}`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-[5px] w-[65%] overflow-auto border-2 border-gray-100 relative">
          <Table className="w-full">
            <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1] ">
              <TableRow>
                <TableHead className="text-center ">S No.</TableHead>
                <TableHead>Fees Category</TableHead>
                <TableHead className="">Schedule</TableHead>
                <TableHead className="text-right">Final Fees</TableHead>
                <TableHead className="text-right">Fees paid</TableHead>
                <TableHead className="text-right">Total Dues</TableHead>
                <TableHead className=" text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semWiseFeesBreakUpDetails.map((item) => (
                <TableRow key={item.feeCategory}>
                  <TableCell className="text-center">{item.sno}</TableCell>
                  <TableCell className="">{getFinanceFeeTypeLabel(item.feeCategory)}</TableCell>
                  <TableCell className="">{getScheduleLabel(item.feeSchedule)}</TableCell>
                  <TableCell className="text-right">
                    {item.finalFee != null ? `${item.finalFee.toLocaleString()}` : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.paidAmount != null ? `${item.paidAmount.toLocaleString()}` : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.totalDues != null ? `${item.totalDues.toLocaleString()}` : '--'}
                  </TableCell>
                  <TableCell className="flex gap-2 items-center justify-center text-[#5B31D1]">
                    <ShowHistoryDialog
                      semesterNumber={selectedSemester}
                      semesterId={selectedSemesterId}
                      feeDetail={item}
                      studentName={studentName ?? ''}
                      // remark={remark}
                    />
                    <UpdateFeeDetailDialog
                      semesterNumber={selectedSemester}
                      semesterId={selectedSemesterId}
                      feeDetail={item}
                      studentName={studentName ?? ''}
                    />
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
                <TableCell className="text-right">
                  ₹{feeTotals?.totalDues.toLocaleString()}
                </TableCell>
                <TableCell className="text-right "></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
