'use client'

import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchAdmissionsData } from "./helpers/fetch-data";
import TechnoDataTable from "@/components/custom-ui/data-table/techno-data-table";
import { refineAdmissions } from "./helpers/refine-data";
import { AdmissionTableRow } from "@/types/admissions";
import AdmissionCard from "@/components/custom-ui/admission-card/techno-admission-card";
import TechnoPageTitle from "@/components/custom-ui/page-title/techno-page-title";
import { useRouter } from "next/navigation";
import { ApplicationStatus } from "@/types/enum";
import { SITE_MAP } from "@/common/constants/frontendRouting";
import { Input } from "@/components/ui/input";
import { BookPlus, Search } from "lucide-react";
import { formatApplicationStatus } from "./helpers/format-application-status";
import { CellContext } from "@tanstack/react-table";

export default function AdmissionsLandingPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter()

  const handleViewMore = (row: AdmissionTableRow) => {
    if (row && row.id) {
      router.push(SITE_MAP.ADMISSIONS.GO_TO_ENQUIRY(row._id, row.applicationStatus.toLocaleLowerCase()))
    }
  };
  const columns = [
    { accessorKey: 'id', header: 'S. No' },
    { accessorKey: 'dateOfEnquiry', header: 'Date Of Enquiry' },
    { accessorKey: 'studentName', header: 'Name' },
    { accessorKey: 'studentPhoneNumber', header: 'Phone Number' },
    { accessorKey: 'genderDisplay', header: 'Gender' },
    { accessorKey: 'district', header: 'District' },
    { accessorKey: 'course', header: 'Course' },
    {
      accessorKey: 'applicationStatus', header: 'Application Status', cell: ({ getValue }: CellContext<AdmissionTableRow, string>) => {
        const rawStatus = getValue<string>();
        return formatApplicationStatus(rawStatus);
      }
    },

    { accessorKey: 'fatherPhoneNumber', header: 'Father P No.' },
    { accessorKey: 'motherPhoneNumber', header: 'Mother P No.' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button variant='ghost' className='cursor-pointer' onClick={() => handleViewMore({ ...row.original })}>
          <span
            className='font-inter font-semibold text-[12px] text-primary'
          >View More</span>
        </Button>
      )
    }
  ];

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);


  const handleSearch = (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  const getQueryParams = () => {
    const params: { [key: string]: any } = {
      search: debouncedSearch,
    };
    return params;
  };

  const filterParams = getQueryParams();

  const admissionsQuery = useQuery({
    queryKey: ['admissions', filterParams],
    queryFn: fetchAdmissionsData,
    placeholderData: (previousData) => previousData,
    enabled: true
  })

  const admissionsData = admissionsQuery.data ? refineAdmissions(admissionsQuery.data) : []
  console.log(admissionsData)

  return (
    <>
      <TechnoPageTitle title="Admission Application Process" />
      <div className="flex gap-[32px]">

        <AdmissionCard
          heading="New Application"
          subheading="Start a new admission application"
          icon={<BookPlus className="h-8 w-8 text-primary" />}

        >
          <Button className="w-2/3 cursor-pointer" onClick={() => {
            router.push(SITE_MAP.ADMISSIONS.GO_TO_ENQUIRY("new", ApplicationStatus.STEP_1.toLocaleLowerCase()))

          }}> Create New Admission</Button>
        </AdmissionCard>
      </div>
      {
        admissionsData && (
          <TechnoDataTable
            columns={columns}
            data={admissionsData}
            tableName="Ongoing Admissions"
            currentPage={1}
            totalPages={1}
            pageLimit={10}
            onSearch={handleSearch}
            searchTerm={search}
          />
        )
      }
    </>
  )
}
