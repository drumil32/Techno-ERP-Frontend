import { Label } from "@/components/ui/label";
import { FeesPaidStatus } from "@/types/enum";
import { StudentDetails } from "@/types/finance";
import FeesPaidTag from "./fees-paid-status-tag";

export default function StudentData({ studentData }: { studentData: StudentDetails }) {
  return (
    <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-2/6 flex flex-col gap-3 ">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">Student Name</Label>
          <Label>{studentData.studentName}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">Student ID</Label>
          <Label>{studentData.studentID}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">Father's Name</Label>
          <Label>{studentData.fatherName}</Label>
        </div>
      </div>
      <div className="w-2/6 flex flex-col gap-3">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">Fees Status</Label>
          {studentData.feeStatus &&
            <FeesPaidTag status={studentData.feeStatus as FeesPaidStatus} />
          }
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">Course</Label>
          <Label>{studentData.course}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">HOD</Label>
          <Label>{studentData.HOD}</Label>
        </div>
      </div>
      <div className="w-2/6 flex flex-col gap-3">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/2">Extra Balance</Label>
          <Label>{studentData.extraBalance ? `₹ ${studentData.extraBalance.toLocaleString()}` : "--"}</Label>
        </div>
      </div>
    </div>
  )
}
