import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, DollarSign, Calendar, Filter } from 'lucide-react';

// Mock data
const mockCourseData = [
  {
    id: 1,
    course: 'MBA',
    totalStudents: 75,
    totalExpectedRevenue: 7500000,
    totalCollections: 7500000,
    totalRemainingDues: 2250000,
    yearWiseData: [
      {
        year: 'First',
        students: 37,
        expectedRevenue: 3700000,
        collections: 3700000,
        remainingDues: 1110000
      },
      {
        year: 'Second',
        students: 38,
        expectedRevenue: 3800000,
        collections: 3800000,
        remainingDues: 1140000
      }
    ]
  },
  {
    id: 2,
    course: 'BCA',
    totalStudents: 60,
    totalExpectedRevenue: 1800000,
    totalCollections: 1800000,
    totalRemainingDues: 540000,
    yearWiseData: [
      {
        year: 'First',
        students: 20,
        expectedRevenue: 600000,
        collections: 600000,
        remainingDues: 180000
      },
      {
        year: 'Second',
        students: 20,
        expectedRevenue: 600000,
        collections: 600000,
        remainingDues: 180000
      },
      {
        year: 'Third',
        students: 20,
        expectedRevenue: 600000,
        collections: 600000,
        remainingDues: 180000
      }
    ]
  },
  {
    id: 3,
    course: 'MCA',
    totalStudents: 45,
    totalExpectedRevenue: 2250000,
    totalCollections: 2250000,
    totalRemainingDues: 675000,
    yearWiseData: [
      {
        year: 'First',
        students: 22,
        expectedRevenue: 1100000,
        collections: 1100000,
        remainingDues: 330000
      },
      {
        year: 'Second',
        students: 23,
        expectedRevenue: 1150000,
        collections: 1150000,
        remainingDues: 345000
      }
    ]
  },
  {
    id: 4,
    course: 'B.Tech',
    totalStudents: 120,
    totalExpectedRevenue: 6000000,
    totalCollections: 6000000,
    totalRemainingDues: 1800000,
    yearWiseData: [
      {
        year: 'First',
        students: 30,
        expectedRevenue: 1500000,
        collections: 1500000,
        remainingDues: 450000
      },
      {
        year: 'Second',
        students: 30,
        expectedRevenue: 1500000,
        collections: 1500000,
        remainingDues: 450000
      },
      {
        year: 'Third',
        students: 30,
        expectedRevenue: 1500000,
        collections: 1500000,
        remainingDues: 450000
      },
      {
        year: 'Fourth',
        students: 30,
        expectedRevenue: 1500000,
        collections: 1500000,
        remainingDues: 450000
      }
    ]
  }
];

const academicYearOptions = ['2024-25', '2023-24', '2022-23', '2021-22'];
const monthOptions = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const formatCurrency = (amount: any) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function CourseWiseRevenue() {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const toggleRow = (courseId: any) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(courseId)) {
      newExpandedRows.delete(courseId);
    } else {
      newExpandedRows.add(courseId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleAcademicYearChange = (year: any) => {
    setAcademicYear(year);
    setShowYearDropdown(false);
  };

  const handleMonthChange = (month: any) => {
    setSelectedMonth(month);
    setShowMonthDropdown(false);
  };

  // Calculate totals
  const totals = mockCourseData.reduce(
    (acc, course) => ({
      students: acc.students + course.totalStudents,
      expectedRevenue: acc.expectedRevenue + course.totalExpectedRevenue,
      collections: acc.collections + course.totalCollections,
      remainingDues: acc.remainingDues + course.totalRemainingDues
    }),
    { students: 0, expectedRevenue: 0, collections: 0, remainingDues: 0 }
  );

  return (
    <div className="bg-white rounded-2xl border border-purple-200 shadow-sm h-full">
      {/* Header */}
      <div className="p-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-3 text-xl font-semibold text-purple-900">
            <DollarSign className="h-6 w-6 text-purple-600" />
            Course-wise Revenue
          </h2>

          {/* Filters */}
          <div className="flex items-center gap-6">
            {/* Academic Year Filter */}
            <div className="flex items-center gap-4">
              <span className="font-[500] text-gray-800">Academic Year:</span>
              <div className="relative">
                <button
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  className="flex items-center justify-between min-w-[200px] px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {academicYear || 'Select Academic Year'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                {showYearDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-auto min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto">
                    {academicYearOptions.map((year) => (
                      <div
                        key={year}
                        onClick={() => handleAcademicYearChange(year)}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={academicYear === year}
                          readOnly
                          className="h-4 w-4 text-purple-600"
                        />
                        <span>{year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-4">
              <span className="font-[500] text-gray-800">Month:</span>
              <div className="relative">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="flex items-center justify-between min-w-[200px] px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {selectedMonth || 'Select Month'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-auto min-w-[200px] bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto">
                    {monthOptions.map((month) => (
                      <div
                        key={month}
                        onClick={() => handleMonthChange(month)}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMonth === month}
                          readOnly
                          className="h-4 w-4 text-purple-600"
                        />
                        <span>{month}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 pt-0">
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <div className="max-h-[600px] overflow-auto">
            <table className="w-full">
              <thead className="bg-purple-50 sticky top-0">
                <tr>
                  <th className="text-left p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-20">
                    S.No
                  </th>
                  <th className="text-left p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-48">
                    Course
                  </th>
                  <th className="text-center p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-24">
                    Year
                  </th>
                  <th className="text-center p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-32">
                    No. of Students
                  </th>
                  <th className="text-center p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-44">
                    Total Expected Revenue
                  </th>
                  <th className="text-center p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-32">
                    Collections
                  </th>
                  <th className="text-center p-4 text-purple-900 font-semibold text-sm border-b border-gray-200 w-36">
                    Remaining Dues
                  </th>
                </tr>
              </thead>

              <tbody className="py-2">
                {mockCourseData.map((course, index) => (
                  <>
                    <tr
                      key={course.id}
                      className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors cursor-pointer"
                      onClick={() => toggleRow(course.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {expandedRows.has(course.id) ? (
                            <ChevronUp className="h-4 w-4 text-purple-600" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-purple-600" />
                          )}
                          <span className="font-medium">{index + 1}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{course.course}</td>
                      <td className="p-4 text-center font-medium">All</td>
                      <td className="p-4 text-center">{course.totalStudents}</td>
                      <td className="p-4 text-center">
                        {formatCurrency(course.totalExpectedRevenue)}
                      </td>
                      <td className="p-4 text-center">{formatCurrency(course.totalCollections)}</td>
                      <td className="p-4 text-center">
                        {formatCurrency(course.totalRemainingDues)}
                      </td>
                    </tr>

                    {expandedRows.has(course.id) &&
                      course.yearWiseData.map((yearData, yearIndex) => (
                        <tr
                          key={`${course.id}-${yearIndex}`}
                          className="border-b border-gray-50 bg-purple-25 hover:bg-purple-50/20 transition-colors"
                        >
                          <td className="p-3 px-4"></td>
                          <td className="p-3 px-4 text-gray-700">{course.course}</td>
                          <td className="p-3 px-4 text-center text-gray-700">{yearData.year}</td>
                          <td className="p-3 px-4 text-center text-gray-700">
                            {yearData.students}
                          </td>
                          <td className="p-3 px-4 text-center text-gray-700">
                            {formatCurrency(yearData.expectedRevenue)}
                          </td>
                          <td className="p-3 px-4 text-center text-gray-700">
                            {formatCurrency(yearData.collections)}
                          </td>
                          <td className="p-3 px-4 text-center text-gray-700">
                            {formatCurrency(yearData.remainingDues)}
                          </td>
                        </tr>
                      ))}
                  </>
                ))}
              </tbody>

              <tfoot className="sticky -bottom-0">
                <tr className="bg-purple-100 hover:bg-purple-100">
                  <td className="p-4 font-semibold">Total</td>
                  <td className="p-4 font-semibold"></td>
                  <td className="p-4 font-semibold"></td>
                  <td className="p-4 text-center font-semibold">{totals.students}</td>
                  <td className="p-4 text-center font-semibold">
                    {formatCurrency(totals.expectedRevenue)}
                  </td>
                  <td className="p-4 text-center font-semibold">
                    {formatCurrency(totals.collections)}
                  </td>
                  <td className="p-4 text-center font-semibold">
                    {formatCurrency(totals.remainingDues)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
