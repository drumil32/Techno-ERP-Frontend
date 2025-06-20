import { Label } from '@/components/ui/label';
import { FeesPaidStatus } from '@/types/enum';
import { StudentDetails } from '@/types/finance';
import FeesPaidTag from './fees-paid-status-tag';
import {
  BookOpen,
  FileUser,
  IdCard,
  Landmark,
  ReceiptIndianRupee,
  School,
  StickyNote,
  User,
  Users
} from 'lucide-react';
import { TruncatedCell } from '@/components/custom-ui/data-table/techno-data-table';

export default function StudentData({ studentData }: { studentData: StudentDetails }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="flex gap-3 text-lg font-semibold text-purple-800 mb-4 pb-2 border-b border-gray-100">
        <FileUser className="size-6 text-purple-700" />
        Student Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
              <User className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Student Name</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData?.studentName || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
              <IdCard className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Student ID</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData?.studentID || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-600">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Father's Name</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData?.fatherName || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
              <BookOpen className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Course</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData.course || 'Unknown Course'}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
              <School className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Semester</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData.currentSemester ? `Semester 0${studentData.currentSemester}` : '--'}
              </p>
            </div>
          </div>

          <div className='flex items-start'>
            <div className="p-2 bg-purple-50 rounded-lg mr-3 text-purple-600">
              <StickyNote className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Remark</p>
              <p className="hover:cursor-pointer text-base font-medium text-gray-800 mt-1">
                <TruncatedCell maxWidth={80} value={studentData.step2And4Remark} />
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-600">
              <ReceiptIndianRupee className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fee Status</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData.feeStatus && (
                  <FeesPaidTag status={studentData.feeStatus as FeesPaidStatus} />
                )}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-600">
              <Landmark className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Extra Balance</p>
              <p className="text-base font-medium text-gray-800 mt-1">
                {studentData.extraBalance != null
                  ? `₹ ${studentData.extraBalance.toLocaleString()}`
                  : '--'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
