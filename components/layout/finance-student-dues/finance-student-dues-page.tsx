'use client'

import TechnoDataTable from "@/components/custom-ui/data-table/techno-data-table";
import TechnoPageHeading from "@/components/custom-ui/page-heading/techno-page-heading";
import FeesPaidTag from "./fees-paid-status-tag";
import { Button } from "@/components/ui/button";
import { LuDownload } from "react-icons/lu"; 
import { StudentDue, StudentDuesApiResponse } from "@/types/finance"; 
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStudentDuesMock } from "./helpers/mock-api";
import { FeesPaidStatus } from "@/types/enum";
import { useRouter } from "next/navigation";
import { SITE_MAP } from "@/common/constants/frontendRouting";
import BulkFeeUpdateDialogue from "./bulk-fees-update-dialogue";
import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";

interface RefinedStudentDue extends StudentDue {
  id: number
}

export default function StudentDuesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortState, setSortState] = useState<any>({
    sortBy: ['studentName'],
    orderBy: ['asc'],
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
      orderBy: sortState.orderBy
    };
  };

  const queryParams = getQueryParams();

  const duesQuery = useQuery<StudentDuesApiResponse, Error>({
    queryKey: ['studentDues', queryParams],
    queryFn: () => fetchStudentDuesMock({ queryKey: ['studentDues', queryParams] } as any),
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (duesQuery.data) {
      setTotalPages(duesQuery.data.totalPages);
      setTotalEntries(duesQuery.data.total);
    }
  }, [duesQuery.data]);

  const isLoading = duesQuery.isLoading || duesQuery.isFetching;
  const isError = duesQuery.isError;
  const tableData = duesQuery.data?.dues ?? [];

  const handleViewMore = (studentData: StudentDue) => {
    router.push(SITE_MAP.FINANCE.STUDENT_DUES_ID(studentData._id));
  }

  const columns = [
    { accessorKey: 'id', header: 'S. No' },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'studentId', header: 'Student Id' },
    { accessorKey: 'studentPhoneNumber', header: "Student's Phone Number" },
    { accessorKey: 'fatherName', header: 'Father Name' },
    { accessorKey: 'fatherPhoneNumber', header: "Father's Phone Number" },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'semester', header: 'Semester' },
    {
      accessorKey: 'feeStatus', 
      header: 'Fee Status', 
      cell: ({ row }: any) => {
        const statusValue = row.original.feeStatus;
        return <FeesPaidTag status={statusValue as FeesPaidStatus} />;
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      meta: { align: 'center' },
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => handleViewMore(row.original)}
        >
          <span className="font-inter font-semibold text-[12px] text-primary">View More</span>
        </Button>
      )
    }
  ]

  if (isError) {
    return <div>Error loading student dues data. Please try again later.</div>;
  }

  return (
    <>
      <TechnoPageHeading title="Student Dues" />
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
      />
    </>
  )
}

function TableActionButton() {
  return (
    <>
      <TechnoFilterProvider key="bul-update">
        <BulkFeeUpdateDialogue />
      </TechnoFilterProvider>
      <Button disabled className="h-8 rounded-[10px] border" icon={LuDownload}>
        <span className="font-inter font-semibold text-[12px]">Download</span>
      </Button>
    </>
  )
}