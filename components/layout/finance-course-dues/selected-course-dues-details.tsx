'use client';
import { StudentDuesApiResponse } from '@/types/finance';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { Label } from '@/components/ui/label';
import { fetchStudentFeeInformation } from '../finance-student-dues/helpers/fetch-data';

export default function SelectedCourseDuesDetails() {
  const param = useParams();
  const courseName = param.course as string;
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
      courseName: courseName,
      courseYear: courseYear
    };
  };

  const queryParams = getQueryParams();

  const duesQuery = useQuery<any, Error>({
    queryKey: ['studentDues', queryParams],
    queryFn: () => fetchStudentFeeInformation({ queryKey: ['studentDues', queryParams] } as any),
    placeholderData: (previousData:any) => previousData
  });

  const isLoading = duesQuery.isLoading || duesQuery.isFetching;
  const tableData = duesQuery.data?.dues ?? [];

  const columns = [
    { accessorKey: 'id', header: 'S. No' },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'studentId', header: 'Student Id' },
    { accessorKey: 'totalDue', header: 'Total Dues' },
    { accessorKey: 'studentPhoneNumber', header: "Student's Phone Number" },
    { accessorKey: 'fatherName', header: 'Father Name' },
    { accessorKey: 'fatherPhoneNumber', header: "Father's Phone Number" }
  ];

  return (
    <>
      <TechnoPageHeading title={`${courseName} Dues`} />
      <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Course</Label>
          <Label>{courseName}</Label>
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Course Year</Label>
          <Label>{courseYear}</Label>
        </div>
      </div>

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
        headerStyles={"text-[#5B31D1] bg-[#F7F4FF]"}
        tableStyles={"w-3/4"}
      />
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
