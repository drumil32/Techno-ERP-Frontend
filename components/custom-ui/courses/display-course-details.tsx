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
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-50">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-4 pb-3 border-b border-gray-50">
        <LibraryBig className="size-4 text-blue-700" />
        Course Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Example: Course Name */}
        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-blue-50">
            <BookOpen className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Course Name</p>
            <p className="text-sm font-medium text-gray-800">{courseData.courseName}</p>
          </div>
        </div>

        {/* Course Year */}
        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-blue-50">
            <GraduationCap className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Course Year</p>
            <p className="text-sm font-medium text-gray-800">{courseData.courseYear}</p>
          </div>
        </div>

        {/* Repeat for the rest */}
        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-blue-50">
            <Layers className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Semester</p>
            <p className="text-sm font-medium text-gray-800">{courseData.semester}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-purple-50">
            <Calendar className="size-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Academic Year</p>
            <p className="text-sm font-medium text-gray-800">{courseData.academicYear}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-purple-50">
            <Code className="size-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Course Code</p>
            <p className="text-sm font-medium text-gray-800">{courseData.courseCode}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-purple-50">
            <Building className="size-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Department</p>
            <p className="text-sm font-medium text-gray-800">{courseData.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-green-50">
            <UserSquare className="size-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">HOD</p>
            <p className="text-sm font-medium text-gray-800">{courseData.hod}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg">
          <div className="p-2 rounded-lg bg-green-50">
            <Building className="size-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">College Name</p>
            <p className="text-sm font-medium text-gray-800">{courseData.collegeName}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
