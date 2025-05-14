'use client';

import { useEffect, useRef, useState } from 'react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import { CourseDues, CourseDueTableItem } from '@/types/finance';
import { Label } from '@/components/ui/label';
import { CollegeNames } from '@/types/enum';
import { useTechnoFilterContext } from '@/components/custom-ui/filter/filter-context';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { addDays, format } from 'date-fns';
import { fetchCourseDues } from './helpers/fetch-data';
import { convertForTableView } from './helpers/convertToTableData';
import { getCurrentAcademicYear } from '@/lib/getCurrentAcademicYear';
import TechnoBreadCrumb from '@/components/custom-ui/breadcrump/techno-breadcrumb';
import AdvancedTechnoBreadcrumb from '@/components/custom-ui/breadcrump/advanced-techno-breadcrumb';
import Loading from '@/app/c/marketing/loading';

const collegeOptions = [
  { id: 'ALL', label: 'All' },
  ...Object.values(CollegeNames).map((college) => ({
    id: college,
    label: college
  }))
];
export default function CourseDuesDetails() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const today = new Date();
  const yesterday = format(addDays(today, -1), 'dd/MM/yyyy');
  const [collegeName, setSelectedCollege] = useState('ALL');
  const collegeDropdownData = collegeOptions;
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

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

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const getQueryParams = () => {
    return {
      // page,
      // limit,
      // search: debouncedSearch,
      // sortBy: sortState.sortBy,
      // orderBy: sortState.orderBy
      collegeName,
      // date: yesterday
      date: format(today, 'dd/MM/yyyy')
    };
  };

  const queryParams = getQueryParams();

  const courseDuesQuery = useQuery<CourseDues[], Error>({
    queryKey: ['courseDues', queryParams],
    queryFn: (context) => fetchCourseDues(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData
  });

  useEffect(() => {
    if (courseDuesQuery.data) {
      // setTotalPages(courseDuesQuery.data.totalPages);
      // setTotalEntries(courseDuesQuery.data.total);
    }
  }, [courseDuesQuery.data]);

  // Prepare table state
  const isLoading = courseDuesQuery.isLoading || courseDuesQuery.isFetching;
  const isError = courseDuesQuery.isError;
  const tableData = convertForTableView(courseDuesQuery.data ?? []);

  // Error handling
  if (isError) {
    console.error('Query error:', courseDuesQuery.error);
  }

  // Define table columns
  const columns = [
    { accessorKey: 'sno', header: 'S. No' },
    { accessorKey: 'courseName', header: 'Course' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'dueStudentCount', header: 'No of Students' },
    {
      accessorKey: 'totalDue',
      header: 'Total Due',
      cell: ({ row }: any) => <span>{`₹ ${row.original.totalDue.toLocaleString()}`}</span>
    },
    { accessorKey: 'departmentHODName', header: 'Course Head' },
    { accessorKey: 'departmentHODEmail', header: 'Course Head Contact' }
  ];

  // const { filters, updateFilter } = useTechnoFilterContext();

  const handleViewMore = (courseDueData: CourseDueTableItem) => {
    router.push(
      SITE_MAP.FINANCE.SELECTED_COURSE_DUES(courseDueData.courseCode, courseDueData.courseYear)
    );
  };

  const handleCollegeChange = (value: string) => {
    setSelectedCollege(value);
  };

  const breadcrumbItems = [
    { title: 'Finance', route: SITE_MAP.FINANCE.DEFAULT },
    { title: 'Course Dues', route: SITE_MAP.FINANCE.COURSE_DUES }
  ];

  return (
    <>
      <AdvancedTechnoBreadcrumb items={breadcrumbItems} />

      <TechnoPageHeading title="All Course Dues" />

      <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Update Date</Label>
          <Label>{yesterday}</Label>
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">College</Label>

          <span>
            <div className="flex items-center gap-4">
              <Select value={collegeName.toString()} onValueChange={handleCollegeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {collegeOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </span>
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Academic Year</Label>
          <Label>{getCurrentAcademicYear()}</Label>
        </div>
      </div>

      {isError && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
          An error occurred while loading data. Please try again.
        </div>
      )}

      {isLoading && <Loading />}
      {!isLoading && !isError && (
        <TechnoDataTable
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          columns={columns}
          data={tableData}
          showPagination={false}
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
          headerStyles={'text-[#5B31D1] bg-[#F7F4FF]'}
        />
      )}
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
