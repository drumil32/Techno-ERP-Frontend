import {
  BookOpen,
  Building,
  Calendar,
  Code,
  GraduationCap,
  Layers,
  LibraryBig,
  UserSquare
} from 'lucide-react';

type CourseDisplayDetailsType = {
  courseName: string;
  courseYear: string;
  semester: string;
  academicYear: string;
  courseCode: string;
  department: string;
  hod: string;
  collegeName: string;
};

export default function CourseDisplayDetails({
  courseData
}: {
  courseData: CourseDisplayDetailsType;
}) {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-4 pb-3 border-b border-gray-100">
        <LibraryBig className="size-6 text-blue-700" />
        Course Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="flex  items-center gap-3 p-3 rounded-lg">
          <BookOpen className="size-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Course Name</p>
            <p className="text-sm font-medium text-gray-800">{courseData.courseName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3  rounded-lg">
          <GraduationCap className="size-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Course Year</p>
            <p className="text-sm font-medium text-gray-800">{courseData.courseYear}</p>
          </div>
        </div>

        <div className="flex item-center gap-3 p-3  rounded-lg">
          <Layers className="size-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Semester</p>
            <p className="text-sm font-medium text-gray-800 ">{courseData.semester}</p>
          </div>
        </div>

        <div className="flex item-center gap-3 p-3  rounded-lg">
          <Calendar className="size-6 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Academic Year</p>
            <p className="text-sm font-medium text-gray-800 ">{courseData.academicYear}</p>
          </div>
        </div>

        <div className="flex item-center gap-3 p-3  rounded-lg">
          <Code className="size-6 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Course Code</p>
            <p className="text-sm font-medium text-gray-800 ">{courseData.courseCode}</p>
          </div>
        </div>

        <div className="flex item-center gap-3 p-3  rounded-lg">
          <Building className="size-6 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Department</p>
            <p className="text-sm font-medium text-gray-800 ">{courseData.department}</p>
          </div>
        </div>

        <div className="flex item-center gap-3 p-3  rounded-lg">
          <UserSquare className="size-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">HOD</p>
            <p className="text-sm font-medium text-gray-800 ">{courseData.hod}</p>
          </div>
        </div>

        <div className="flex item-center gap-3 p-3  rounded-lg">
          <Building className="size-6 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">College Name</p>
            <p className="text-sm font-medium text-gray-800 ">{courseData.collegeName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
