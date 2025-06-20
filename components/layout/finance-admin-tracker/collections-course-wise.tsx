import { CourseCollection } from '@/types/finance';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus2, ArrowUp, ArrowDown, ArrowUpDown, School } from 'lucide-react'; // Added icons
import { useState, useMemo } from 'react'; // Added hooks

export default function CourseWiseCollections({
  courseWiseCollection
}: {
  courseWiseCollection: CourseCollection[];
}) {
  const [activeSortColumn, setActiveSortColumn] = useState('courseCode'); // Initial sort by course code
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Initial sort direction

  const totals = courseWiseCollection.reduce(
    (totals, item) => {
      totals.totalCollection += item.totalCollection ?? 0;
      return totals;
    },
    {
      totalCollection: 0
    }
  );

  const handleSort = (columnName: string) => {
    if (activeSortColumn === columnName) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setActiveSortColumn(columnName);
      setSortDirection('asc'); // Default to 'asc' when changing column
    }
  };

  const getSortIcon = (columnName: string) => {
    if (activeSortColumn === columnName) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="w-4 h-4 text-[#5B31D1]" />
      ) : (
        <ArrowDown className="w-4 h-4 text-[#5B31D1]" />
      );
    }
    return <ArrowUpDown className="w-4 h-4 text-[#5B31D1]/60" />;
  };

  const sortedCourseWiseCollection = useMemo(() => {
    if (!courseWiseCollection || courseWiseCollection.length === 0) {
      return [];
    }

    const sortableData = [...courseWiseCollection];

    sortableData.sort((a, b) => {
      let compareValue = 0;

      if (activeSortColumn === 'courseCode') {
        compareValue = (a.courseName || '').localeCompare(b.courseName || '');
      } else if (activeSortColumn === 'totalCollection') {
        compareValue = (a.totalCollection || 0) - (b.totalCollection || 0);
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });

    return sortableData;
  }, [courseWiseCollection, activeSortColumn, sortDirection]);

  return (
    <Card>
      <CardHeader className="">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-yellow-700 pb-3 border-b border-gray-100">
          <School className="h-6 w-6 text-yellow-700" />
          Course Wise Collections
        </CardTitle>
      </CardHeader>
      <CardContent>
        {courseWiseCollection.length > 0 ? (
          <div className="rounded-[5px] h-[660px] overflow-auto border-2 border-gray-100 relative ">
            <Table className="w-full">
              <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg [&_th]:!text-[#5B31D1] sticky top-0">
                <TableRow>
                  <TableHead className="text-center py-4">S. No</TableHead>
                  <TableHead
                    className="text-center cursor-pointer select-none py-4 transition-colors"
                    onClick={() => handleSort('courseCode')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Course
                      {getSortIcon('courseCode')}
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-right cursor-pointer select-none py-4  transition-colors"
                    onClick={() => handleSort('totalCollection')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Collections
                      {getSortIcon('totalCollection')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCourseWiseCollection.map((item, index) => (
                  <TableRow
                    key={item.courseName}
                    className="hover:bg-[#5B31D1]/5 transition-colors"
                  >
                    <TableCell className="text-center py-4">{index + 1}</TableCell>
                    <TableCell className="text-center py-4">{item.courseName}</TableCell>
                    <TableCell className="text-right py-4">
                      {item.totalCollection ? `₹${item.totalCollection?.toLocaleString()}` : '--'}
                    </TableCell>
                    <TableCell className="text-right py-4"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="font-bold sticky -bottom-1">
                <TableRow className="bg-gray-300">
                  <TableCell className="text-center py-4">Total</TableCell>
                  <TableCell className="py-4"></TableCell>
                  <TableCell className="text-right py-4">
                    ₹{totals.totalCollection?.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4"></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-[480px]">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting date to find what you're looking for.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
