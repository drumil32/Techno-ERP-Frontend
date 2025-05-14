'use client';
import { StudentDue, StudentDuesApiResponse } from '@/types/finance';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { Label } from '@/components/ui/label';
import {
  fetchActiveDues,
  fetchStudentFeeInformation
} from '../finance-student-dues/helpers/fetch-data';
import { getCurrentAcademicYear } from '@/lib/getCurrentAcademicYear';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import TechnoBreadCrumb from '@/components/custom-ui/breadcrump/techno-breadcrumb';
import AdvancedTechnoBreadcrumb from '@/components/custom-ui/breadcrump/advanced-techno-breadcrumb';
import Loading from '@/app/c/marketing/loading';

export default function SelectedCourseDuesDetails() {
  const router = useRouter();
  const param = useParams();
  const courseCode = param.course as string;
  const courseYear = param.year as string;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortState, setSortState] = useState<any>({
    sortBy: ['studentName'],
    orderBy: ['asc']
  });
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

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
      page,
      limit,
      search: debouncedSearch,
      sortBy: sortState.sortBy,
      orderBy: sortState.orderBy,
      courseCode: courseCode,
      academicYear: getCurrentAcademicYear()
      // courseYear: courseYear
    };
  };

  const queryParams = getQueryParams();

  const duesQuery = useQuery<StudentDuesApiResponse, Error>({
    queryKey: ['studentDues', queryParams],
    queryFn: (context) => fetchActiveDues(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData
  });

  useEffect(() => {
    if (duesQuery.data) {
      setTotalPages(duesQuery.data.pagination.totalPages);
      setTotalEntries(duesQuery.data.pagination.totalCount);
    }
  }, [duesQuery.data]);

  const isLoading = duesQuery.isLoading || duesQuery.isFetching;
  const isError = duesQuery.isError;
  const tableData =
    duesQuery.data?.data.map((due, index) => ({
      ...due,
      sno: (page - 1) * limit + index + 1
    })) ?? [];

  const columns = [
    { accessorKey: 'sno', header: 'S. No' },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'universityId', header: 'Student Id' },
    {
      accessorKey: 'totalDueAmount',
      header: 'Total Dues',
      cell: ({ row }: any) => <span>{`₹ ${row.original.totalDueAmount.toLocaleString()}`}</span>
    },
    { accessorKey: 'studentPhoneNumber', header: "Student's Phone Number" },
    { accessorKey: 'fatherName', header: 'Father Name' },
    { accessorKey: 'fatherPhoneNumber', header: "Father's Phone Number" }
  ];

  const handleViewMore = (studentData: StudentDue) => {
    router.push(SITE_MAP.FINANCE.STUDENT_DUES_ID(studentData._id));
  };

  const breadcrumbItems = [
    { title: 'Finance', route: SITE_MAP.FINANCE.STUDENT_DUES },
    { title: 'Course Dues', route: SITE_MAP.FINANCE.COURSE_DUES },
    { title: `${courseCode}`, route: SITE_MAP.FINANCE.SELECTED_COURSE_DUES(courseCode, courseYear) }
  ];

  return (
    <>
      <AdvancedTechnoBreadcrumb items={breadcrumbItems} />
      <TechnoPageHeading title={`${courseCode} Dues`} />
      <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Course</Label>
          <Label>{courseCode}</Label>
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Course Year</Label>
          <Label>{courseYear}</Label>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <TechnoDataTable
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          columns={columns}
          data={tableData}
          tableName="Student Dues"
          tableActionButton={<TableActionButton />}
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
          tableStyles={'w-4/5'}
        />
      )}
    </>
  );
}

function TableActionButton() {
  return (
    <>
      <Button className="h-8 rounded-[10px] border" icon={LuDownload}>
        <span className="font-inter font-semibold text-[12px]">Download</span>
      </Button>
    </>
  );
}
