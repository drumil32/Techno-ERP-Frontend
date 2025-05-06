'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import { CourseDue, CourseDuesApiResponse } from '@/types/finance';
import { fetchCourseDuesMock } from './helpers/course-dues-mock-api';
import { Label } from '@/components/ui/label';
import { CollegeNames } from '@/types/enum';
import TechnoFilter from '@/components/custom-ui/filter/techno-filter';
import {
  TechnoFilterProvider,
  useTechnoFilterContext
} from '@/components/custom-ui/filter/filter-context';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';

const collegeOptions = Object.values(CollegeNames).map((college) => ({
  id: college,
  label: college
}));

export default function CourseDuesDetails() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortState, setSortState] = useState<any>({
    sortBy: ['course'],
    orderBy: ['asc']
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Prepare query parameters
  const getQueryParams = () => {
    return {
      page,
      limit,
      search: debouncedSearch,
      sortBy: sortState.sortBy,
      orderBy: sortState.orderBy
    };
  };

  const queryParams = getQueryParams();

  // Use React Query to fetch data
  const courseDuesQuery = useQuery<CourseDuesApiResponse, Error>({
    queryKey: ['courseDues', queryParams],
    queryFn: fetchCourseDuesMock,
    placeholderData: (previousData) => previousData
  });

  // This is already updated in the previous modification

  // Update pagination state when data changes
  useEffect(() => {
    if (courseDuesQuery.data) {
      setTotalPages(courseDuesQuery.data.totalPages);
      setTotalEntries(courseDuesQuery.data.total);
    }
  }, [courseDuesQuery.data]);

  // Prepare table state
  const isLoading = courseDuesQuery.isLoading || courseDuesQuery.isFetching;
  const isError = courseDuesQuery.isError;
  const tableData = courseDuesQuery.data?.courseDues ?? [];

  // Error handling
  if (isError) {
    console.error('Query error:', courseDuesQuery.error);
  }

  // Define table columns
  const columns = [
    { accessorKey: 'sno', header: 'S. No' },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'numberOfStudents', header: 'No of Students' },
    {
      accessorKey: 'totalDue',
      header: 'Total Due',
      meta: { align: 'right' },
      cell: ({ row }: any) => {
        const amount = parseFloat(row.original.totalDue);
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0
        }).format(amount);
      }
    },
    { accessorKey: 'courseHead', header: 'Course Head' },
    { accessorKey: 'courseHeadContact', header: 'Course Head Contact' }
  ];

  const { filters, updateFilter } = useTechnoFilterContext();

  const handleViewMore = (courseDueData: CourseDue) => {
    router.push(
      SITE_MAP.FINANCE.SELECTED_COURSE_DUES(courseDueData.course, courseDueData.courseYear)
    );
  };

  return (
    <>
      <TechnoPageHeading title="All Course Dues" />

      <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Update Date</Label>
          <Label>20/04/25</Label>
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">College</Label>
          <TechnoFilter
            filterKey="college"
            filterLabel="College"
            filterPlaceholder="College"
            multiSelect={true}
            options={collegeOptions}
            applyFilters={() => { }}
          />
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Academic Year</Label>
          <Label>2025-26</Label>
        </div>
      </div>

      {isError && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
          An error occurred while loading data. Please try again.
        </div>
      )}

      <TechnoDataTable
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        columns={columns}
        data={tableData}
        tableName="Course Dues"
        tableActionButton={<CourseTableActionButton />}
        currentPage={page}
        totalPages={totalPages}
        pageLimit={limit}
        totalEntries={totalEntries}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        searchTerm={search}
        isLoading={isLoading}
        handleViewMore={handleViewMore}
        headerStyles={"text-[#5B31D1] bg-[#F7F4FF]"}
      />
    </>
  );
}

function CourseTableActionButton() {
  const handleDownload = () => {
    console.log('Download Course Dues data...');
  };

  return (
    <>
      <Button onClick={handleDownload} className="h-8 rounded-[10px] border" icon={LuDownload}>
        <span className="font-inter font-semibold text-[12px]">Download</span>
      </Button>
    </>
  );
}
