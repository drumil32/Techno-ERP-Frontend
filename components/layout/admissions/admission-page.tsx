'use client';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { fetchAdmissionsData } from './helpers/fetch-data';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { refineAdmissions } from './helpers/refine-data';
import { AdmissionTableRow } from '@/types/admissions';
import AdmissionCard from '@/components/custom-ui/admission-card/techno-admission-card';
import TechnoPageTitle from '@/components/custom-ui/page-title/techno-page-title';
import { useRouter } from 'next/navigation';
import { AdmissionReference, ApplicationStatus, StepMapper, UserRoles } from '@/types/enum';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { Input } from '@/components/ui/input';
import { BookPlus, ChevronDown, Search } from 'lucide-react';
import { formatApplicationStatus } from './helpers/format-application-status';
import { CellContext } from '@tanstack/react-table';
import { toast } from 'sonner';
import Loading from '@/app/loading';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { LuDownload, LuUpload } from 'react-icons/lu';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FaCircleExclamation } from 'react-icons/fa6';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { SheetItem } from '@/types/marketing';
import { Checkbox } from '@radix-ui/react-checkbox';
import useAuthStore from '@/stores/auth-store';
import { format, formatDate } from 'date-fns';
import { getCounsellors, getTeleCallers } from '@/components/custom-ui/enquiry-form/stage-1/enquiry-form-api';



export default function AdmissionsLandingPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleViewMore = (row: AdmissionTableRow) => {
    if (row && row.id) {
      if (row.applicationStatus === 'Confirmed') {
        toast.success('Your application is already confirmed');
        return;
      }
      const gostep = StepMapper[row.applicationStatus];

      router.push(
        SITE_MAP.ADMISSIONS.GO_TO_ENQUIRY(row._id, gostep)
      );
    }
  };
  const columns = [
    { accessorKey: 'id', header: 'S. No', meta: { align: 'center', maxWidth: 60, fixedWidth: 80 } },
    { accessorKey: 'dateOfEnquiry', header: 'Date Of Enquiry', meta: { align: 'center' } },
    { accessorKey: 'studentName', header: 'Name' },
    { accessorKey: 'studentPhoneNumber', header: 'Phone Number' },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'genderDisplay', header: 'Gender' },
    { accessorKey: 'district', header: 'District' },

    { accessorKey: 'fatherName', header: "Father's Name" },
    { accessorKey: 'fatherPhoneNumber', header: "Father's Number" },
    {
      accessorKey: 'applicationStatus',
      header: 'Application Status',
      meta: { align: 'center' },
      cell: ({ getValue }: CellContext<AdmissionTableRow, string>) => {
        const rawStatus = getValue<string>();
        return (
          <div className="text-primary font-semibold">{StepMapper[rawStatus]}</div>
        );
      }
    }
  ];

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => { }, 500);
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
        applicationStatus: ['Step_1', 'Step_2', 'Step_3', 'Step_4']
      }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    enabled: true
  });



  const admissionsData = admissionsQuery.data ? refineAdmissions(admissionsQuery.data) : [];
  if (!admissionsData) {
    <Loading />;
  }

  return (
    <>
      <TechnoPageTitle title="Admission Application Process" />
      <div className="flex gap-[32px]">
        <AdmissionCard
          heading="New Application"
          subheading="Start a new admission application"
          icon={<BookPlus className="h-8 w-8 text-primary" />}
        >
          <Button
            className="w-2/3 cursor-pointer"
            onClick={() => {
              router.push(SITE_MAP.ADMISSIONS.CREATE_ADMISSION);
            }}
          >
            {' '}
            Start New Application
          </Button>
        </AdmissionCard>
      </div>

      <TechnoDataTable
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        columns={columns}
        data={admissionsData}
        tableName={`Ongoing Enquiry (${Object.values(admissionsData).length}) `}
        currentPage={1}
        totalPages={1}
        pageLimit={10}
        onSearch={handleSearch}
        searchTerm={search}
        showPagination={false}
        handleViewMore={handleViewMore}
        tableActionButton={<TableActionButton />}
      />
    </>
  );
}

export function TableActionButton() {
  const authStore = useAuthStore();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

  const results = useQueries({
        queries: [
          {
            queryKey: ['telecallers'],
            queryFn: getTeleCallers
          },
          {
            queryKey: ['counsellors'],
            queryFn: getCounsellors
          }
        ]
      });

  const uploadAction = async () => {
    setIsUploading(true);
  };

  const downloadAction = async () => {
    setIsDownloading(true);
    try {


      

      const telecallers: { _id: string; name: string }[] = Array.isArray(results[0].data)
        ? results[0].data.map((name: string) => ({ _id: name, name }))
        : [];

      const counsellors: { _id: string; name: string }[] = Array.isArray(results[1].data)
        ? results[1].data.map((name: string) => ({ _id: name, name }))
        : [];

      const references: { _id: string; name: string }[] = Object.values(AdmissionReference).map(
        (ref) => ({ _id: ref, name: ref })
      );


      const response = await fetch(API_ENDPOINTS.enquiryExcelSheetData, {
        method: 'GET',
        credentials: 'include'
      });

      const enquiryData = await response.json();
      const userName = authStore.user?.name ?? 'user';
      const dateStr = format(new Date(), 'dd-MM-yyyy');

      const excelData =  Array.from(enquiryData.DATA).map((enq: any, index: number) => {
        return {
          "S.No": index + 1,
          "Footfall Date": enq.dateOfEnquiry,
          "Student Name": enq.studentName,
          "Course": enq.course,
          "Source Reference": references.map((ref) => ref.name).join(", "),
          "Telecaller(s)": telecallers.map((tel) => tel.name).join(", "),
          "COUNSELLOR(S)": counsellors.map((col) => col.name).join(", "),
          "Status" : enq.applicationStatus,
          "Remark - Enquiry" : enq.enquiryRemark,
          "Remark - Fees Details": enq.feeDetailsRemark,
          "Remark - Registrar Office" : enq.registarOfficeRemark,
          "Remark - Finance" : enq.financeOfficeRemark,
          "Student Number" : enq.studentPhoneNumber,
          "Father's Name" : enq.fatherName,
          "Father's Number" : enq.fatherPhoneNumber,
          "City" : enq.address?.city || enq.address.addressLine1,
          "Address" : enq.address.district + " " + enq.address.state + " " + enq.address.country + " " + enq.address.pincode,
          "category" : enq.category,
          "Form Sold" : enq.admittedThrough,
          "Admission Model" : enq.admissionMode,
          "Fees Type": enq.isFeeApplicable == true ? "Non-Zero fees" : "Zero fees"
        }
      })


      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'enquiry-excel');

      XLSX.writeFile(workbook, `${userName}-${dateStr}-enquiry-excel-sheet.xlsx`);
      console.log(enquiryData.DATA)



      toast.success('Marketing Data Downloaded Successfully');
      setDownloadOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const isUploadDisabled = !authStore.hasRole(UserRoles.LEAD_MARKETING);
  const isDownloadDisabled =
    !authStore.hasRole(UserRoles.EMPLOYEE_MARKETING) &&
    !authStore.hasRole(UserRoles.LEAD_MARKETING);

  return (
    <>
      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={isUploadDisabled}
            variant="outline"
            className="h-8 w-[85px] rounded-[10px] border"
          >
            <LuUpload className="mr-1 h-4 w-4" />
            <span className="font-inter font-medium text-[12px]">Upload</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <FaCircleExclamation className="text-yellow-500 w-6 h-6" />
              Upload Marketing Data
            </DialogTitle>
            <DialogDescription className="my-3">
              Are you sure you want to upload marketing data?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 mt-3 mb-6">
            <span className="font-[500]">Select Sheet: </span>
            <DropdownMenu>
              {/* <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[200px] justify-between">
                  {(selectedSheet &&
                    sheetDropdownData?.find((sheet) => sheet.id === selectedSheet)?.name) ||
                    'Select Sheet'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger> */}
              {/* <DropdownMenuContent className="w-auto min-w-[200px] max-h-[300px] overflow-y-auto">
                {sheetDropdownData?.map((item: SheetItem) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSelectedSheet(item.id);
                    }}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Checkbox checked={selectedSheet === item.id} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </DropdownMenuContent> */}
            </DropdownMenu>
          </div>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <DialogClose asChild disabled={isUploading}>
              <Button variant="outline" className="font-inter text-sm" disabled={isUploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={uploadAction}
              className="font-inter text-sm"
              disabled={isUploading || !selectedSheet}
            >
              {isUploading ? 'Uploading...' : 'Confirm Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogTrigger asChild>
          <Button disabled={isDownloadDisabled} className="h-8 w-[103px] rounded-[10px] border">
            <LuDownload className="mr-1 h-4 w-4" />
            <span className="font-inter font-semibold text-[12px]">Download</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <FaCircleExclamation className="text-yellow-500 w-6 h-6" />
              Download Ongoing Enquiry
            </DialogTitle>
            <DialogDescription className="my-3">
              Are you sure you want to download Ongoing Enquiry data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <DialogClose asChild disabled={isDownloading}>
              <Button variant="outline" className="font-inter text-sm" disabled={isDownloading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={downloadAction}
              className="font-inter text-sm"
              disabled={isDownloading}
            >
              {isDownloading ? 'Downloading...' : 'Confirm Download'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}