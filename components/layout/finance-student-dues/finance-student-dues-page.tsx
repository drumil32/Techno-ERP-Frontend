'use client';

import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import FeesPaidTag from './fees-paid-status-tag';
import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import { StudentDue, StudentDuesApiResponse } from '@/types/finance';
import { useEffect, useRef, useState } from 'react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { FeesPaidStatus } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import BulkFeeUpdateDialogue from './bulk-fees-update-dialogue';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import { fetchActiveDues } from './helpers/fetch-data';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';
import { getCurrentAcademicYear } from '@/lib/getCurrentAcademicYear';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toWordsOrdinal } from 'number-to-words';
import { capitalize } from '@/lib/capitalize';
import AdvancedTechnoBreadcrumb from '@/components/custom-ui/breadcrump/advanced-techno-breadcrumb';
import Loading from '@/app/c/marketing/loading';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function StudentDuesPage() {
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear());
  const academicYearDropdownData = generateAcademicYearDropdown(0, 1);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);


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
      search: debouncedSearch,
      academicYear
    };
  };

  const queryParams = getQueryParams();

  const duesQuery = useQuery<StudentDuesApiResponse, Error>({
    queryKey: ['studentDues', queryParams],
    queryFn: (context) => fetchActiveDues(context as QueryFunctionContext<readonly [string, any]>),
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData
  });


  const isLoading = duesQuery.isLoading || duesQuery.isFetching;
  const isError = duesQuery.isError;
  const tableData =
    duesQuery.data?.data.map((due, index) => ({
      ...due,
      serialNo:  index + 1
    })) ?? [];

  const handleViewMore = (studentData: StudentDue) => {
    router.push(SITE_MAP.FINANCE.STUDENT_DUES_ID(studentData._id));
  };

  const columns = [
    { accessorKey: 'serialNo', header: 'S. No', meta: { align: 'center' } },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'universityId', header: 'Student ID' },
    { accessorKey: 'studentPhoneNumber', header: "Student's Number" },
    { accessorKey: 'fatherName', header: 'Father Name' },
    { accessorKey: 'fatherPhoneNumber', header: "Father's Number" },
    { accessorKey: 'courseName', header: 'Course' },
    {
      accessorKey: 'courseYear',
      header: 'Course Year',
      cell: ({ row }: any) => {
        const year = Number(row.original.courseYear);
        return <span>{!isNaN(year) ? capitalize(toWordsOrdinal(year)) : '--'}</span>;
      }
    },
    {
      accessorKey: 'currentSemester',
      header: 'Semester',
      meta: { align: 'center' },
      cell: ({ row }: any) => {
        return <span>{`0${row.original.currentSemester}`}</span>;
      }
    },
    {
      accessorKey: 'feeStatus',
      header: 'Fee Status',
      meta: { align: 'center' },
      cell: ({ row }: any) => {
        const statusValue = row.original.feeStatus;
        return <FeesPaidTag status={statusValue as FeesPaidStatus} />;
      }
    }
  ];

  if (isError) {
    return <div>Error loading student dues data. Please try again later.</div>;
  }

  const handleAcademicYearChange = (value: string) => {
    setAcademicYear(value);
  };

  const breadcrumbItems = [
    { title: 'Finance', route: SITE_MAP.FINANCE.DEFAULT },
    { title: 'Student Dues', route: SITE_MAP.FINANCE.STUDENT_DUES }
  ];
  if (!duesQuery.data) {
    return <Loading />;
  }
  return (
    <>
      <AdvancedTechnoBreadcrumb items={breadcrumbItems} />
      <TechnoPageHeading title="Student Dues" />
      <span>
        <div className="flex items-center gap-4">
          <span className="font-[500]">Academic Year: </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[200px] justify-between">
                {academicYear || 'Select Academic Year'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto min-w-[200px] max-h-[300px] overflow-y-auto">
              {academicYearDropdownData.map((item: string) => (
                <div
                  key={item}
                  onClick={() => handleAcademicYearChange(item)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Checkbox checked={academicYear === item} />
                  <span>{item}</span>
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </span>
      <TechnoDataTable
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        columns={columns}
        data={tableData}
        tableName="Student Dues"
        tableActionButton={<TableActionButton />}
        onSearch={handleSearch}
        searchTerm={search}
        isLoading={isLoading}
        searchBarPlaceholder={'Search Student Name, ID, Phone Number here'}
        headerStyles={'text-[#5B31D1] bg-[#F7F4FF]'}
        showPagination={false}
        handleViewMore={handleViewMore}
      />
    </>
  );
}

function TableActionButton() {
  return (
    <>
      <TechnoFilterProvider key="bulk-update">
        {/* <BulkFeeUpdateDialogue /> */}
        <></>
      </TechnoFilterProvider>
      <Button disabled className="h-8 rounded-[10px] border" icon={LuDownload}>
        <span className="font-inter font-semibold text-[12px]">Download</span>
      </Button>
    </>
  );
}
