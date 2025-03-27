import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchAdmissionsData } from "./helpers/fetch-data";
import TechnoDataTable from "@/components/custom-ui/data-table/techno-data-table";
import { refineAdmissions } from "./helpers/refine-data";
import { AdmissionTableRowType } from "@/types/admissions";
import TechnoRightDrawer from "@/components/custom-ui/drawer/techno-right-drawer";
import AdmissionCard from "@/components/custom-ui/admission-card/techno-admission-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TechnoPageTitle from "@/components/custom-ui/page-title/techno-page-title";

export default function AdmissionsLandingPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editRow, setEditRow] = useState<AdmissionTableRowType>()
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");


    const handleViewMore = (row: AdmissionTableRowType) => {
        setEditRow(row)
        setIsDrawerOpen(true);
    };
    const columns = [
        { accessorKey: 'id', header: 'S. No' },
        { accessorKey: 'dateOfEnquiry', header: 'Date Of Enquiry' },
        { accessorKey: 'studentName', header: 'Name' },
        { accessorKey: 'studentPhoneNumber', header: 'Phone Number' },
        { accessorKey: 'genderDisplay', header: 'Gender' },
        { accessorKey: 'district', header: 'District' },
        { accessorKey: 'course', header: 'Course' },
        { accessorKey: 'applicationStatus', header: 'Application Status' },

        { accessorKey: 'fatherPhoneNumber', header: 'Father P No.' },
        { accessorKey: 'motherPhoneNumber', header: 'Mother P No.' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <Button variant='ghost' onClick={() => handleViewMore({ ...row.original })}>
                    <span
                        className='font-inter font-semibold text-[12px] text-primary '
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

    const isLoading = admissionsQuery.isLoading
    const isError = admissionsQuery.isError
    const admissionsData = admissionsQuery.data ? refineAdmissions(admissionsQuery.data) : []

    console.log(admissionsData)


    return (
        <>
            <TechnoPageTitle title="Admission Application Process" />
            <div className="flex gap-[32px]">
                <AdmissionCard
                    heading="New Application"
                    subheading="Start a new admission application"
                >
                    <Button className="w-2/3"> Create New Admission</Button>
                </AdmissionCard>

                <AdmissionCard
                    heading="Ongoing Application"
                    subheading="Search for ongoing application"
                >
                    <div className="flex gap-2">
                        <div className="relative">
                            <Input
                                placeholder="Search for leads"
                                className="max-w-[243px] h-[32px] rounded-md bg-[#f3f3f3] px-4 py-2 pr-10 text-gray-600 placeholder-gray-400"
                            />
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <Search className="h-4 w-4 text-gray-500" />
                            </span>
                        </div>
                        <Button className="w-1/4"> Search</Button>
                    </div>
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
            <TechnoRightDrawer title={"Admission Data"} isOpen={isDrawerOpen} onClose={() => {
                setIsDrawerOpen(false);
            }}>
            </TechnoRightDrawer>
        </>
    )
}
