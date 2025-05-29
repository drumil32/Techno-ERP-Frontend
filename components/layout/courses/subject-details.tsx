import {
  BookOpen,
  Building,
  Calendar,
  Code,
  GraduationCap,
  Layers,
  LibraryBig,
  User,
  UserSquare,
  Bookmark
} from 'lucide-react';

type SubjectDetailsType = {
  'Subject Name': string;
  'Subject Code': string;
  Instructor: string;
  'Course Name': string;
  'Course Year': string;
  Semester: string;
  'Academic Year': string;
  'Course Code': string;
  Department: string;
  HOD: string;
  'College Name': string;
};

export default function SubjectDetails({ subjectData }: { subjectData: SubjectDetailsType }) {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-800 mb-4 pb-3 border-b border-gray-100">
        <Bookmark className="size-5 text-purple-700" />
        Subject Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <BookOpen className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Subject Name</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Subject Name'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <Code className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Subject Code</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Subject Code'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
          <User className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Instructor</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Instructor'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
          <LibraryBig className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Course Name</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Course Name'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
          <GraduationCap className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Course Year</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Course Year'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
          <Layers className="size-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Semester</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Semester'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <Calendar className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Academic Year</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Academic Year'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <Code className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Course Code</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Course Code'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <Building className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">Department</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['Department'] || '-'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
          <UserSquare className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">HOD</p>
            <p className="text-sm font-medium text-gray-800 mt-1">{subjectData['HOD'] || '-'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
          <Building className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500">College Name</p>
            <p className="text-sm font-medium text-gray-800 mt-1">
              {subjectData['College Name'] || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
