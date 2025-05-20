'use client';

import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchAdmissionsData } from './helpers/fetch-data';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { refineAdmissions } from './helpers/refine-data';
import { AdmissionTableRow } from '@/types/admissions';
import AdmissionCard from '@/components/custom-ui/admission-card/techno-admission-card';
import TechnoPageTitle from '@/components/custom-ui/page-title/techno-page-title';
import { useRouter } from 'next/navigation';
import { ApplicationStatus } from '@/types/enum';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { Input } from '@/components/ui/input';
import { BookPlus, Download, ReceiptIndianRupee, Search } from 'lucide-react';
import { formatApplicationStatus } from './helpers/format-application-status';
import { CellContext } from '@tanstack/react-table';
import { toast } from 'sonner';
import Loading from '@/app/loading';
import { DownloadAdmissionReceiptDialog } from './admission-receipt-download-dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { AdmissionFeeReceiptDialog } from './admission-fee-receipt-download-dialog';

export default function RecentAdmissionsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns = [
    { accessorKey: 'id', header: 'S. No', meta: { align: 'center' } },
    { accessorKey: 'dateOfEnquiry', header: 'Date Of Enquiry', meta: { align: 'center' } },
    { accessorKey: 'studentName', header: 'Name' },
    { accessorKey: 'studentPhoneNumber', header: 'Phone Number' },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'genderDisplay', header: 'Gender' },
    { accessorKey: 'district', header: 'District' },

    { accessorKey: 'fatherPhoneNumber', header: "Father's Number" },
    { accessorKey: 'motherPhoneNumber', header: "Mother's Number" },
    // {
    //   accessorKey: 'applicationStatus',
    //   header: 'Application Status',
    //   meta: { align: 'center' },
    //   cell: ({ getValue }: CellContext<AdmissionTableRow, string>) => {
    //     const rawStatus = getValue<string>();
    //     return (
    //       <div className="text-primary font-semibold">{formatApplicationStatus(rawStatus)}</div>
    //     );
    //   }
    // },
    {
      id: 'form',
      header: '',
      meta: { align: 'center' },
      cell: ({ row }: any) => <DownloadAdmissionReceiptDialog studentId={row.original._id} />
    },
    {
      id: 'receipt',
      header: '',
      meta: { align: 'center' },
      cell: ({ row }: any) => <AdmissionFeeReceiptDialog studentId={row.original._id} />
    }
  ];

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {}, 500);
  };

  const getQueryParams = () => {
    const params: { [key: string]: any } = {
      search: debouncedSearch
    };
    return params;
  };

  const filterParams = getQueryParams();

  const admissionsQuery = useQuery({
    queryKey: ['admissions', filterParams],
    queryFn: () =>
      fetchAdmissionsData({
        applicationStatus: ['Confirmed']
      }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    enabled: true
  });

  const admissionsData = admissionsQuery.data ? refineAdmissions(admissionsQuery.data) : [];
  console.log(admissionsData);

  if (!admissionsData) {
    <Loading />;
  }

  return (
    <>
      <TechnoPageTitle title="Recent Admissions" />

      <TechnoDataTable
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        columns={columns}
        data={admissionsData}
        tableName={`Recent Applications (${Object.values(admissionsData).length}) `}
        currentPage={1}
        totalPages={1}
        pageLimit={10}
        onSearch={handleSearch}
        handleViewMore={() => {}}
        searchTerm={search}
        showPagination={false}
      />
    </>
  );
}
