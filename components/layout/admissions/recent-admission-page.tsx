'use client';
import * as XLSX from "xlsx"
import { useQueries, useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { fetchAdmissionsData } from './helpers/fetch-data';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { refineAdmissions } from './helpers/refine-data';
import { AdmissionTableRow } from '@/types/admissions';
import TechnoPageTitle from '@/components/custom-ui/page-title/techno-page-title';
import { useRouter } from 'next/navigation';
import { formatApplicationStatus } from './helpers/format-application-status';
import { CellContext } from '@tanstack/react-table';
import Loading from '@/app/loading';
import { DownloadAdmissionReceiptDialog } from './admission-receipt-download-dialog';
import { AdmissionFeeReceiptDialog } from './admission-fee-receipt-download-dialog';
import { DownloadStep4 } from '@/components/custom-ui/enquiry-form/stage-4/step4-pdf';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { LuDownload, LuUpload } from 'react-icons/lu';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import useAuthStore from '@/stores/auth-store';
import { getCounsellors, getTeleCallers } from '@/components/custom-ui/enquiry-form/stage-1/enquiry-form-api';
import { AdmissionReference, UserRoles } from '@/types/enum';
import { format } from 'date-fns';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { FaCircleExclamation } from "react-icons/fa6";
export default function RecentAdmissionsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const router = useRouter();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns = [
    { accessorKey: 'id', header: 'S. No', meta: { align: 'center' } },
    { accessorKey: 'dateOfEnquiry', header: 'Date Of Enquiry', meta: { align: 'center' } },
    { accessorKey: 'studentName', header: 'Name' },
    {
      accessorKey: 'studentPhoneNumber', header: 'Phone Number', meta: {
        align: 'center'
      }
    },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'genderDisplay', header: 'Gender' },
    { accessorKey: 'district', header: 'District' },
    { accessorKey: 'fatherName', header: "Father's Name" },
    {
      accessorKey: 'fatherPhoneNumber', header: "Father's Number", meta: {
        align: 'center'
      }
    },
    {
      accessorKey: 'applicationStatus',
      header: 'Application Status',
      meta: { align: 'center' },
      cell: ({ getValue }: CellContext<AdmissionTableRow, string>) => {
        const rawStatus = getValue<string>();
        return (
          <div className="text-primary font-semibold">{formatApplicationStatus(rawStatus)}</div>
        );
      }
    },
    {
      id: 'icon',
      header: '',
      meta: { align: 'left' },
      cell: ({ row }: any) => <div className='flex justify-center items-center gap-2 '>
        <DownloadAdmissionReceiptDialog studentId={row.original._id} />
        <AdmissionFeeReceiptDialog studentId={row.original._id} />
        <DownloadStep4 studentId={row.original._id} />
      </div>
    },
    // {
    //   id: "admission",
    //   header: '',
    //   meta: { align: 'center' },
    //   cell: ({ row }: any) => <DownloadAdmissionReceiptDialog studentId={row.original._id} />
    // },
    // {
    //   id: 'receipt',
    //   header: '',
    //   meta: { align: 'center' },
    //   cell: ({ row }: any) => <AdmissionFeeReceiptDialog studentId={row.original._id} />
    // }, {
    //   id: 'Feedetails',
    //   header: '',
    //   meta: { align: 'center' },
    //   cell: ({ row }: any) => <DownloadStep4 studentId={row.original._id} />
    // }
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
        applicationStatus: ['Confirmed']
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
      <TechnoPageTitle title="Recent Admissions" />

      <TechnoDataTable
        selectedRowId={selectedRowId}
        // setSelectedRowId={setSelectedRowId}
        columns={columns}
        data={admissionsData}
        tableName={`Recent Admissions (${Object.values(admissionsData).length}) `}
        currentPage={1}
        totalPages={1}
        pageLimit={10}
        onSearch={handleSearch}
        handleViewMore={() => { }}
        searchTerm={search}
        showPagination={false}
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


  const uploadAction = async () => {
    setIsUploading(true);
  };

  const downloadAction = async () => {
    setIsDownloading(true);
    try {

      const response = await fetch(API_ENDPOINTS.admissionExcelSheetData, {
        method: 'GET',
        credentials: 'include'
      });

      const addmissionData = await response.json();
      const userName = authStore.user?.name ?? 'user';
      const dateStr = format(new Date(), 'dd-MM-yyyy');

      const excelData = Array.from(addmissionData.DATA).map((enq: any, index: number) => {
        const avaliableReferences = enq?.references

        const avaliableTelecallers = enq?.telecaller

        const avaliableCounsellors = enq?.counsellor
        return {
          "S.No": index + 1,
          "Admission Date": enq.dateOfAdmission,
          "Photo No.": enq.photoNo,
          "Course": enq.course,
          "Form No.": enq.formNo,
          "Name of Student": enq.studentName,
          "Father's Name": enq.fatherName,
          "Mother's Name": enq.motherName,
          "Address": enq.address.addressLine1 + ", " + enq.address.district + ", " + enq.address.state + ", " + enq.address.country + ", " + enq.address.pincode,
          "District": enq.address.district,
          "Pincode": enq.address.pincode,
          "State": enq.address.state,
          "Country": enq.address.country,
          "Aadhaar Number": enq.aadharNumber,
          "Date of Birth": enq.dateOfBirth,
          "Student's Number": enq.studentPhoneNumber,
          "Father's Number": enq.fatherPhoneNumber,
          "Email": enq.emailId,
          "Gender": enq.gender,
          "Religion": enq.religion,
          "Blood Group": enq.bloodGroup,
          "Category": enq.category,
          "10th": enq?.academicDetails?.[0]?.educationLevel === "10th"
            ? `School/Collage Name: ${enq.academicDetails[0].schoolCollegeName || 'N/A'}\n` +
            `University/Board Name: ${enq.academicDetails[0].universityBoardName || 'N/A'}\n` +
            `Passing Year: ${enq.academicDetails[0].passingYear || 'N/A'}\n` +
            `Percentage Obtained: ${enq.academicDetails[0].PercentageObtained || 'N/A'}\n` +
            `Mention Subjects: ${enq.academicDetails[0].subjects || 'N/A'}`
            : '',

          "12th": enq?.academicDetails?.[1]?.educationLevel === "12th"
            ? `School/Collage Name: ${enq.academicDetails[1].schoolCollegeName || 'N/A'}\n` +
            `University/Board Name: ${enq.academicDetails[1].universityBoardName || 'N/A'}\n` +
            `Passing Year: ${enq.academicDetails[1].passingYear || 'N/A'}\n` +
            `Percentage Obtained: ${enq.academicDetails[1].PercentageObtained || 'N/A'}\n` +
            `Mention Subjects: ${enq.academicDetails[1].subjects || 'N/A'}`
            : '',

          "Graduation": enq?.academicDetails?.[2]?.educationLevel === "Graduation"
            ? `School/Collage Name: ${enq.academicDetails[2].schoolCollegeName || 'N/A'}\n` +
            `University/Board Name: ${enq.academicDetails[2].universityBoardName || 'N/A'}\n` +
            `Passing Year: ${enq.academicDetails[2].passingYear || 'N/A'}\n` +
            `Percentage Obtained: ${enq.academicDetails[2].PercentageObtained || 'N/A'}\n` +
            `Mention Stream: ${enq.academicDetails[2].subjects || 'N/A'}`
            : '',

          "Doc 1": enq.physicalDocumentNote?.[0]?.type === "10th Marksheet" ?
            `Name: ${enq.physicalDocumentNote?.[0].type || 'N/A'}\n` +
            `Staus: ${enq.physicalDocumentNote?.[0].status}\n`
            : '',

          "Due Date 1": enq.physicalDocumentNote?.[0]?.type === "10th Marksheet" ?
            `${enq.physicalDocumentNote?.[0].dueBy || 'N/A'}\n`
            : '',

          "Doc 2": enq.physicalDocumentNote?.[1]?.type === "12th Marksheet" ?
            `Name: ${enq.physicalDocumentNote?.[1].type || 'N/A'}\n` +
            `Staus: ${enq.physicalDocumentNote?.[1].status}\n`
            : '',

          "Due Date 2": enq.physicalDocumentNote?.[1]?.type === "12th Marksheet" ?
            `${enq.physicalDocumentNote?.[1].dueBy || 'N/A'}\n`
            : '',

          "Doc 3": enq.physicalDocumentNote?.[2]?.type === "T.C. / Migration" ?
            `Name: ${enq.physicalDocumentNote?.[2].type || 'N/A'}\n` +
            `Staus: ${enq.physicalDocumentNote?.[2].status}\n`
            : '',

          "Due Date 3": enq.physicalDocumentNote?.[2]?.type === "T.C. / Migration" ?
            `${enq.physicalDocumentNote?.[2].dueBy || 'N/A'}\n`
            : '',

          "Doc 4": enq.physicalDocumentNote?.[3]?.type === "Gap Affidavit (If Applicable)" ?
            `Name: ${enq.physicalDocumentNote?.[3].type || 'N/A'}\n` +
            `Staus: ${enq.physicalDocumentNote?.[3].status}\n`
            : '',

          "Due Date 4": enq.physicalDocumentNote?.[3]?.type === "Gap Affidavit (If Applicable)" ?
            `${enq.physicalDocumentNote?.[3].dueBy || 'N/A'}\n`
            : '',

          "Doc 5": enq.physicalDocumentNote?.[4]?.type === "Caste Certificate (If Applicable)" ?
            `Name: ${enq.physicalDocumentNote?.[4].type || 'N/A'}\n` +
            `Staus: ${enq.physicalDocumentNote?.[4].status}\n`
            : '',

          "Due Date 5": enq.physicalDocumentNote?.[4]?.type === "Caste Certificate (If Applicable)" ?
            `${enq.physicalDocumentNote?.[4].dueBy || 'N/A'}\n`
            : '',

          "Source Reference": avaliableReferences?.map((ref: any) => ref).join(", "),
          "Telecaller(s)": avaliableTelecallers?.map((tel: any) => tel).join(", "),
          "COUNSELLOR(S)": avaliableCounsellors?.map((col: any) => col).join(", "),

          "Remark - Enquiry": enq.enquiryRemark,
          "Remark - Fees Details": enq.feeDetailsRemark,
          "Remark - Registrar Office": enq.registarOfficeRemark,
          "Remark - Finance": enq.financeOfficeRemark,
          "Applicable Fees": (enq.applicableFee ?? 0),
          "Final Fees": (enq.finalFee ?? 0),
          "Discount Applicable": (enq.discountApplicable ?? 0),
          "TOTAL DISCOUNT": (enq.totalDiscountApplicable ?? 0),
          "REFERENCE AMOUNT": (enq.srAmount ?? 0),
        }
      })


      const worksheet = XLSX.utils.json_to_sheet(excelData);
      worksheet['!cols'] = [
        { wch: 5 },   // S.No
        { wch: 15 },  // Admission Date
        { wch: 10 },  // Photo No.
        { wch: 20 },  // Course
        { wch: 10 },  // Form No.
        { wch: 25 },  // Name of Student
        { wch: 25 },  // Father's Name
        { wch: 25 },  // Mother's Name
        { wch: 40 },  // Address
        { wch: 15 },  // District
        { wch: 10 },  // Pincode
        { wch: 15 },  // State
        { wch: 15 },  // Country
        { wch: 15 },  // Aadhaar Number
        { wch: 15 },  // Date of Birth
        { wch: 15 },  // Student's Number
        { wch: 15 },  // Father's Number
        { wch: 25 },  // Email
        { wch: 10 },  // Gender
        { wch: 15 },  // Religion
        { wch: 15 },  // Blood Group
        { wch: 15 },  // Category
        { wch: 40 },  // 10th
        { wch: 40 },  // 12th
        { wch: 40 },  // Graduation
        { wch: 20 },  // Doc 1
        { wch: 15 },  // Due Date 1
        { wch: 20 },  // Doc 2
        { wch: 15 },  // Due Date 2
        { wch: 20 },  // Doc 3
        { wch: 15 },  // Due Date 3
        { wch: 20 },  // Doc 4
        { wch: 15 },  // Due Date 4
        { wch: 20 },  // Doc 5
        { wch: 15 },  // Due Date 5
        { wch: 20 },  // Source Reference
        { wch: 20 },  // Telecaller(s)
        { wch: 20 },  // COUNSELLOR(S)
        { wch: 30 },  // Remark - Enquiry
        { wch: 30 },  // Remark - Fees Details
        { wch: 30 },  // Remark - Registrar Office
        { wch: 30 },  // Remark - Finance
        { wch: 15 },  // Applicable Fees
        { wch: 15 },  // Final Fees
        { wch: 20 },  // Discount Applicable
        { wch: 15 },  // TOTAL DISCOUNT
        { wch: 15 }   // REFERENCE AMOUNT
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'admission-excel');

      XLSX.writeFile(workbook, `${dateStr} - Recent Admissions.xlsx`);

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
              Download Admission
            </DialogTitle>
            <DialogDescription className="my-3">
              Are you sure you want to download Admission data?
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