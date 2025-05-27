import { AdmissionCourseYearWiseResponse } from '@/types/admissions';
import { useQuery } from '@tanstack/react-query';
import { fetchAdmissionsCourseYearAnalyticsData } from '../../helpers/fetch-data';
import { AdmissionAggregationType } from '@/types/enum';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
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
import { UsersRound, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export default function CourseYearWiseTable() {
  const [activeSortColumn, setActiveSortColumn] = useState('course');
  const [sortDirection, setSortDirection] = useState('asc');

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

  const sortedTableData = useMemo(() => {
    if (!tableData.length) return tableData;

    return [...tableData].sort((a, b) => {
      let compareValue = 0;

      if (activeSortColumn === 'course') {
        compareValue = a.course.localeCompare(b.course);
      } else {
        const columnIndex = yearColumns.findIndex((col) => col.key === activeSortColumn);
        if (columnIndex !== -1) {
          const aValue = a.numberOfAdmissions[columnIndex] || 0;
          const bValue = b.numberOfAdmissions[columnIndex] || 0;
          compareValue = aValue - bValue;
        }
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [tableData, activeSortColumn, sortDirection, yearColumns]);

  const handleSort = (columnName: string) => {
    if (activeSortColumn === columnName) {
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      setSortDirection(newDirection);
    } else {
      setActiveSortColumn(columnName);
      setSortDirection(columnName === 'course' ? 'asc' : 'desc');
    }
  };

  const getSortIcon = (columnName: string) => {
    console.log('Column: ', columnName);
    if (activeSortColumn === columnName) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="w-4 h-4 text-purple-700" />
      ) : (
        <ArrowDown className="w-4 h-4 text-purple-700" />
      );
    }
    return <ArrowUpDown className="w-4 h-4 text-purple-400 opacity-60" />;
  };

  console.log(sortedTableData, yearColumns, columnTotals, grandTotal);

  return (
    <Card className="h-full col-span-2 col-start-1 rounded-2xl ">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-900">
          <UsersRound className="h-6 w-6 text-purple-600" />
          Admissions Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="">
        <div className="rounded-lg w-full h-[740px]  overflow-auto border border-gray-100 relative">
          <Table>
            <TableHeader className="bg-purple-50 sticky top-0">
              <TableRow className="hover:bg-purple-50/50">
                <TableHead
                  className="w-[150px] text-purple-900 font-semibold py-4 cursor-pointer select-none hover:bg-purple-100/50 transition-colors"
                  onClick={() => handleSort('course')}
                >
                  <div className="flex items-center gap-2">
                    Course
                    {getSortIcon('course')}
                  </div>
                </TableHead>
                {yearColumns.map((item) => (
                  <TableHead
                    key={item.key}
                    className="w-[150px] text-purple-900 font-semibold py-4 text-center cursor-pointer select-none hover:bg-purple-100/50 transition-colors"
                    onClick={() => handleSort(item.key)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {item.label}
                      {getSortIcon(item.key)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {sortedTableData.map((item) => (
                <TableRow
                  key={item.course}
                  className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors"
                >
                  <TableCell className="font-medium py-4 px-4">{item.course}</TableCell>
                  {item.numberOfAdmissions.map((count, index) => (
                    <TableCell key={index} className="py-4 px-4 text-center">
                      {count}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

            <TableFooter className="sticky -bottom-2">
              <TableRow className="bg-purple-100">
                <TableCell className="font-semibold py-4 px-4">Total</TableCell>
                {yearColumns.map((col) => (
                  <TableCell key={col.key} className="font-semibold py-4 px-4 text-center">
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

  const allCourses = Array.from(
    new Set(data.yearWise.flatMap((year) => year.courseWise.map((course) => course.courseCode)))
  ).sort();

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
