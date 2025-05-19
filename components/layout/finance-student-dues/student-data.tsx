import { Label } from "@/components/ui/label";
import { FeesPaidStatus } from "@/types/enum";
import { StudentDetails } from "@/types/finance";
import FeesPaidTag from "./fees-paid-status-tag";

export default function StudentData({ studentData }: { studentData: StudentDetails }) {
  return (
    <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-1/4 flex flex-col gap-3 ">
        <div className="flex h-7">
          <Label className="text-[#666666] w-1/3">Student Name</Label>
          <Label className="w-1/2">{studentData.studentName}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/3">Student ID</Label>
          <Label className="w-1/2">{studentData.studentID}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/3">Father's Name</Label>
          <Label className="w-1/2">{studentData.fatherName}</Label>
        </div>
      </div>
      <div className="w-1/4 flex flex-col gap-3">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/3">Fees Status</Label>
          {studentData.feeStatus &&
            <FeesPaidTag status={studentData.feeStatus as FeesPaidStatus} />
          }
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/3">Course</Label>
          <Label className="w-1/2">{studentData.course}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/3">Semester</Label>
          <Label className="w-1/2">{studentData.currentSemester ? `Semester 0${studentData.currentSemester}` : '--'}</Label>
        </div>
      </div>
      <div className="w-1/4 flex flex-col gap-3">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/3">Extra Balance</Label>
          <Label className="w-1/2">
            {studentData.extraBalance != null ? `₹ ${studentData.extraBalance.toLocaleString()}` : "--"}
          </Label>
        </div>
      </div>
    </div>
  )
}
