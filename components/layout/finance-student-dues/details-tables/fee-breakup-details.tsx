import { SemesterBreakUp } from "@/types/finance"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EditFeeBreakupDialogue from "./edit-fee-breakup-dialog"
import { getFinanceFeeTypeLabel, getScheduleLabel } from "@/lib/enumDisplayMapper"

export default function FeesBreakupDetails({ semFeesBreakUp, studentName }: { semFeesBreakUp: SemesterBreakUp[], studentName: string | undefined }) {
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [semWiseFeesBreakUpDetails, setSemWiseFeesBreakUpDetails] = useState<SemesterBreakUp["details"]>([])

  useEffect(() => {
  if (semFeesBreakUp) {
    const selectedSemData = semFeesBreakUp.find(
      (item) => item.semesterNumber === selectedSemester
    )
    setSemWiseFeesBreakUpDetails(
      selectedSemData?.details.map((item) => ({
        ...item,
        totalDues: item.finalFee - item.paidAmount,
      })) ?? []
    )
  }
}, [selectedSemester, semFeesBreakUp])

  const feeTotals = semWiseFeesBreakUpDetails.reduce(
    (totals, item) => {
      totals.finalFee += item.finalFee ?? 0
      totals.paidAmount += item.paidAmount ?? 0
      totals.totalDues += item.finalFee - item.paidAmount
      return totals
    },
    { finalFee: 0, paidAmount: 0, totalDues: 0 }
  )

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(parseInt(value))
  }

  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center">
        <div className="font-semibold text-[16px]">Fee Breakup</div>
        <EditFeeBreakupDialogue studentName={studentName} semesterNumber={selectedSemester} feesBreakup={semWiseFeesBreakUpDetails} />
      </div>
      <div className="flex gap-2 mb-4 p-2 items-center">
        <div className="text-[#5F5F5F]">Select Semester</div>
        <Select
          value={selectedSemester.toString()}
          onValueChange={handleSemesterChange}
        >
          <SelectTrigger >
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semFeesBreakUp && semFeesBreakUp.map((item) => (
              <SelectItem key={item.semesterNumber} value={item.semesterNumber.toString()}>
                {`Semester ${item.semesterNumber.toString().padStart(2, '0')}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table className="w-auto">
        <TableHeader className="bg-[#F7F4FF] [&_th]:!text-[#5B31D1] ">
          <TableRow>
            <TableHead className="w-[150px] rounded-l-[5px]">Fees Category</TableHead>
            <TableHead className="w-[110px]">Schedule</TableHead>
            <TableHead className="w-[100px] text-right">Final Fees</TableHead>
            <TableHead className="w-[100px] text-right">Fees paid</TableHead>
            <TableHead className="w-[100px] rounded-r-[5px] text-right">Total Dues</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {semWiseFeesBreakUpDetails.map((item) => (
            <TableRow key={item.feeCategory}>
              <TableCell className="w-[150px]">{getFinanceFeeTypeLabel(item.feeCategory)}</TableCell>
              <TableCell className="w-[110px]">{getScheduleLabel(item.feeSchedule)}</TableCell>
              <TableCell className="w-[100px] text-right">{item.finalFee != null ? `₹ ${item.finalFee.toLocaleString()}` : '__'}</TableCell>
              <TableCell className="w-[100px] text-right">{item.paidAmount != null ? `₹ ${item.paidAmount.toLocaleString()}` : '__'}</TableCell>
              <TableCell className="w-[100px] text-right">{item.totalDues != null ? `₹ ${item.totalDues.toLocaleString()}` : '__'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="rounded-l-[5px]" colSpan={2}>Total</TableCell>
            <TableCell className="text-right">₹{feeTotals?.finalFee.toLocaleString()}</TableCell>
            <TableCell className="text-right">₹{feeTotals?.paidAmount.toLocaleString()}</TableCell>
            <TableCell className="text-right rounded-r-[5px]">₹{feeTotals?.totalDues.toLocaleString()}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
