import { FeeBreakupResponse, SemesterFeesResponse } from "@/types/finance"
import { useQuery } from "@tanstack/react-query"
import { fetchFeeBreakup, fetchSemesterFees } from "../helpers/mock-api"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FeesBreakupDetails({ studentDuesId }: { studentDuesId: string }) {
  const [selectedSemester, setSelectedSemester] = useState(1)

  const semWiseFeesBreakUpDetails = useQuery<FeeBreakupResponse, Error>({
    queryKey: ['semwiseFeesBreakupDetails', selectedSemester, studentDuesId],
    queryFn: fetchFeeBreakup,
    placeholderData: (previousData) => previousData,
  })

  const semesterWise = useQuery<SemesterFeesResponse, Error>({
    queryKey: ['semesterFeeDetail', studentDuesId],
    queryFn: fetchSemesterFees,
    placeholderData: (previousData) => previousData,
  })

  const feeTotals = semWiseFeesBreakUpDetails.data?.breakup.reduce(
    (totals, item) => {
      totals.finalFees += item.finalFees ?? 0
      totals.feesPaid += item.feesPaid ?? 0
      totals.totalDues += item.totalDues ?? 0
      return totals
    },
    { finalFees: 0, feesPaid: 0, totalDues: 0 }
  )

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(parseInt(value))
  }

  return (
    <div className="w-full p-3 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-full flex p-2 items-center">
        <div className="font-semibold text-[16px]">Fee Breakup</div>
        <Button
          variant="outline"
          className="h-9 rounded-[10px] border ml-auto"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Breakup
        </Button>
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
            {semesterWise.data?.details.map((item) => (
              <SelectItem key={item.semester} value={item.semester.toString()}>
                {`Semester ${item.semester.toString().padStart(2, '0')}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {semWiseFeesBreakUpDetails.isLoading ? (
        <div className="flex justify-center items-center h-40">Loading...</div>
      ) : semWiseFeesBreakUpDetails.isError ? (
        <div className="flex justify-center items-center h-40 text-red-500">
          Error loading fee breakup: {semWiseFeesBreakUpDetails.error.message}
        </div>
      ) : (
        <Table className="w-auto">
          <TableHeader className="bg-[#F7F7F7]">
            <TableRow>
              <TableHead className="w-[150px] rounded-l-[5px]">Fees Category</TableHead>
              <TableHead className="w-[110px]">Schedule</TableHead>
              <TableHead className="w-[100px] text-right">Final Fees</TableHead>
              <TableHead className="w-[100px] text-right">Fees paid</TableHead>
              <TableHead className="w-[100px] rounded-r-[5px] text-right">Total Dues</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semWiseFeesBreakUpDetails.data?.breakup.map((item) => (
              <TableRow key={item.feesCategory}>
                <TableCell className="w-[150px]">{item.feesCategory}</TableCell>
                <TableCell className="w-[110px]">{item.schedule}</TableCell>
                <TableCell className="w-[100px] text-right">{item.finalFees != null ? `₹ ${item.finalFees}` : '__'}</TableCell>
                <TableCell className="w-[100px] text-right">{item.feesPaid != null ? `₹ ${item.feesPaid}` : '__'}</TableCell>
                <TableCell className="w-[100px] text-right">{item.totalDues != null ? `₹ ${item.totalDues}` : '__'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="rounded-l-[5px]" colSpan={2}>Total</TableCell>
              <TableCell className="text-right">₹{feeTotals?.finalFees}</TableCell>
              <TableCell className="text-right">₹{feeTotals?.feesPaid}</TableCell>
              <TableCell className="text-right rounded-r-[5px]">₹{feeTotals?.totalDues}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  )
}
