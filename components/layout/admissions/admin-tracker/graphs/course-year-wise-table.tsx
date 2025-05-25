import { AdmissionCourseYearWiseResponse } from '@/types/admissions';
import { useQuery } from '@tanstack/react-query';
import { fetchAdmissionsCourseYearAnalyticsData } from '../../helpers/fetch-data';
import { AdmissionAggregationType } from '@/types/enum';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UserPlus2, Users } from 'lucide-react';

export default function CourseYearWiseTable() {
  const courseWiseQuery = useQuery<AdmissionCourseYearWiseResponse, Error>({
    queryKey: ['admission-course-wise'],
    queryFn: () =>
      fetchAdmissionsCourseYearAnalyticsData({
        type: AdmissionAggregationType.YEAR_AND_COURSE_WISE,
        date: format(new Date(), 'dd/MM/yyyy')
      }),
    placeholderData: (prev) => prev
  });

  const {
    tableData,
    yearColumns,
    columnTotals,
    totalAdmissions: grandTotal
  } = transformDataForTable(courseWiseQuery.data ?? { yearWise: [] });

  console.log(tableData, yearColumns, columnTotals, grandTotal);

  return (
    <Card className="col-span-2 col-start-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl ">
      <CardHeader className="px-6 ">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-900">
          <UserPlus2 className="h-6 w-6 text-purple-600" />
          Admissions Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="">
        <div className="rounded-lg overflow-auto  border border-gray-100">
          <Table>
            <TableHeader className="bg-purple-50/50">
              <TableRow className="hover:bg-purple-50/50">
                <TableHead className="w-[150px] text-purple-900 font-semibold py-4">
                  Course
                </TableHead>
                {yearColumns.map((item) => (
                  <TableHead
                    key={item.key}
                    className="w-[150px] text-purple-900 font-semibold py-4"
                  >
                    {item.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.map((item) => (
                <TableRow
                  key={item.course}
                  className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors"
                >
                  <TableCell className="font-medium flex items-center gap-3 py-4">
                    {item.course}
                  </TableCell>
                  {item.numberOfAdmissions.map((count, index) => (
                    <TableCell key={index} className="py-4">
                      {count}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow className="bg-purple-100">
                <TableCell className="font-semibold">Total</TableCell>
                {yearColumns.map((col) => (
                  <TableCell key={col.key} className="font-semibold py-4">
                    {columnTotals[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function transformDataForTable(data: AdmissionCourseYearWiseResponse) {
  if (!data?.yearWise || data.yearWise.length === 0) {
    return { tableData: [], yearColumns: [], columnTotals: {}, totalAdmissions: 0 };
  }

  // Extract all unique course codes
  const allCourses = Array.from(
    new Set(data.yearWise.flatMap((year) => year.courseWise.map((course) => course.courseCode)))
  ).sort();

  // Prepare yearColumns
  const yearColumns = data.yearWise
    .map((year) => {
      const yearFromDate = new Date(year.date).getFullYear();
      return {
        key: year.date,
        label: `${yearFromDate}-${(yearFromDate + 1).toString().slice(-2)} Admissions`,
        data: year.courseWise
      };
    })
    .reverse();

  // Prepare table data with numberOfAdmissions array
  const tableData = allCourses.map((courseCode) => {
    const numberOfAdmissions: number[] = [];

    yearColumns.forEach((yearCol) => {
      const courseData = yearCol.data.find((c) => c.courseCode === courseCode);
      numberOfAdmissions.push(courseData?.count || 0);
    });

    return {
      course: courseCode,
      numberOfAdmissions
    };
  });

  // Column totals (for footer)
  const columnTotals: Record<string, number> = {};
  let grandTotal = 0;

  yearColumns.forEach((yearCol) => {
    const total = yearCol.data.reduce((sum, course) => sum + course.count, 0);
    columnTotals[yearCol.key] = total;
    grandTotal += total;
  });

  return {
    tableData,
    yearColumns,
    columnTotals,
    totalAdmissions: grandTotal
  };
}
