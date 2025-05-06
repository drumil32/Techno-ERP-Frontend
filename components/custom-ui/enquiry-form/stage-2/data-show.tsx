import { Admission } from '@/types/admissions';
import { Course, CourseNameMapper } from '@/types/enum';

export default function ShowStudentData({ data }: { data: Admission }) {
  return (
    <div className="p-6 flex gap-10 bg-white rounded-[10px]">
      <div className="flex flex-col gap-2 w-1/3">
        <div className="flex">
          <div className="w-1/2 text-gray-600">Student Name</div>
          <div className="w-1/2 ">{data?.studentName}</div>
        </div>
        <div className="flex">
          <div className="w-1/2 text-gray-600">Student's Phone Number</div>
          <div className="w-1/2">{data?.studentPhoneNumber}</div>
        </div>
        <div className="flex">
          <div className="w-1/2 text-gray-600">Father Name</div>
          <div className="w-1/2">{data?.fatherName}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/4">
        <div className="flex">
          <div className="w-1/2 text-gray-600">Course Applied</div>
          <div className="w-1/2">{data?.course || 'Unknown Course'}</div>
        </div>
        <div className="flex">
          <div className="w-1/2 text-gray-600">College Name</div>
          <div className="w-1/2">{data?.collegeName}</div>
        </div>
        <div className="flex">
          <div className="w-1/2 text-gray-600">Affiliation</div>
          <div className="w-1/2">{data?.affiliation}</div>
        </div>
      </div>
    </div>
  );
}
