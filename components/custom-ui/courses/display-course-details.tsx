import { Label } from "@/components/ui/label";

type CourseDisplayDetailsType = {
  courseName: string;
  courseYear: string;
  semester: string;
  academicYear: string;
  courseCode: string;
  department: string;
  hod: string;
  collegeName: string;
}

type CourseDisplayDetailsProps = {
  courseData: CourseDisplayDetailsType
}

export default function CourseDisplayDetails({ courseData }: CourseDisplayDetailsProps) {
  return (
    <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="w-2/6 flex flex-col gap-2">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">Course Name</Label>
          <Label>{courseData.courseName}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">Course Year</Label>
          <Label>{courseData.courseYear}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">Semester</Label>
          <Label>{courseData.semester}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">Academic Year</Label>
          <Label>{courseData.academicYear}</Label>
        </div>
      </div>
      <div className="w-2/6 flex flex-col gap-2">
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">Course Code</Label>
          <Label>{courseData.courseCode}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">Department</Label>
          <Label>{courseData.department}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">HOD</Label>
          <Label>{courseData.hod}</Label>
        </div>
        <div className="flex w-full h-7">
          <Label className="text-[#666666] w-1/4">College Name</Label>
          <Label>{courseData.collegeName}</Label>
        </div>
      </div>
    </div>
  )
}
