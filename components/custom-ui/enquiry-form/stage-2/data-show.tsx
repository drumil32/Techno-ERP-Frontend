import { Admission } from '@/types/admissions';
import { AffiliationMapper, CollegeNameMapper, Course, CourseNameMapper } from '@/types/enum';
import { User, Phone, Users, BookOpen, School, ShieldCheck } from 'lucide-react';

export default function ShowStudentData({ data }: { data: Admission }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
        Student Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Student Name</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {data?.studentName || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone Number</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {data?.studentPhoneNumber || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Father's Name</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {data?.fatherName || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Course Applied</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {data?.course ? CourseNameMapper[data.course] : 'Unknown Course'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
              <School className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">College Name</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {data?.course ? CollegeNameMapper[data.course] : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Affiliation</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {data?.course ? AffiliationMapper[data.course] : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
