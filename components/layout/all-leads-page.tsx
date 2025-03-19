import TechnoAnalyticCardsGroup, {
    CardItem
} from '../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoLeadTypeTag, { TechnoLeadType } from '../custom-ui/lead-type-tag/techno-lead-type-tag';
import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TechnoRightDrawer from '../custom-ui/drawer/techno-right-drawer';
import LeadViewEdit from './allLeads/leads-view-edit';
import { Course, Locations } from '@/static/enum';

const fetchLeads = async ({ queryKey }: any) => {
    const [, params] = queryKey;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/crm/fetch-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

const fetchLeadsAnalytics = async ({ queryKey }: any) => {
    const [, params] = queryKey;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/crm/analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

const fetchAssignedToDropdown = async ({ queryKey }: any) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/user/fetch-dropdown?moduleName=MARKETING`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();

}

const refineLeads = (data: any) => {
    const refinedLeads = data.leads.map((lead: any, index: number) => ({
        _id: lead._id,
        id: index + 1,
        date: lead.date,
        name: lead.name,
        phoneNumber: lead.phoneNumber,
        altPhoneNumber: lead.altPhoneNumber ?? '-',
        email: lead.email ?? '-',
        gender: lead.gender,
        location: lead.location,
        course: lead.course ?? '-',
        leadType: TechnoLeadType[lead.leadType as keyof typeof TechnoLeadType] ?? lead.leadType,
        _leadType: lead.leadType,
        source: lead.source ?? '-',
        assignedTo: lead.assignedTo ?? '-',
        nextDueDate: lead.nextDueDate ?? '-',
        createdAt: new Date(lead.createdAt).toLocaleString(),
        updatedAt: new Date(lead.updatedAt).toLocaleString(),
    }));

    return {
        leads: refinedLeads,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total,
    };
};


const refineAnalytics = (analytics: any) => {
    const totalLeads = analytics.totalLeads ?? 0;

    const calculatePercentage = (count: number) => {
        if (totalLeads === 0) return '0%';
        return `${Math.round((count / totalLeads) * 100)}%`;
    };
    const analyticsCardsData: CardItem[] = [
        {
            heading: analytics.totalLeads ?? '',
            subheading: '100%',
            title: 'Total Leads',
            color: 'text-black'
        },
        {
            heading: analytics.openLeads ?? '',
            subheading: calculatePercentage(analytics.openLeads),
            title: 'Open Leads',
            color: 'text-orange-600'
        },
        {
            heading: analytics.interestedLeads ?? '',
            subheading: calculatePercentage(analytics.interestedLeads),
            title: 'Yellow Leads',
            color: 'text-yellow-600'
        },
        {
            heading: analytics.notInterestedLeads ?? '',
            subheading: calculatePercentage(analytics.notInterestedLeads),
            title: 'Not Interested',
            color: 'text-red-700'
        }
    ];
    return analyticsCardsData;
};

export default function AllLeadsPage() {

    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>()
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [editRow, setEditRow] = useState<any>(null)

    const assignedToQuery = useQuery({
        queryKey: ['assignedToDropdown'],
        queryFn: fetchAssignedToDropdown,
    });

    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleViewMore = (row: any) => {
        setEditRow(row)
        setIsDrawerOpen(true);
    };

    const { filters } = useTechnoFilterContext();

    const currentFiltersRef = useRef(null);

    const applyFilter = () => {
        currentFiltersRef.current = { ...filters };
        setPage(1)
        setAppliedFilters({ ...filters });
        setRefreshKey(prevKey => prevKey + 1);

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


    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
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


    const getQueryParams = () => {
        return {
            page,
            limit,
            search: debouncedSearch,
            ...(currentFiltersRef.current || {}),
            refreshKey
        };
    };

    const filterParams = getQueryParams();;
    const analyticsParams = {};

    const leadsQuery = useQuery({
        queryKey: ['leads', filterParams, appliedFilters, debouncedSearch],
        queryFn: fetchLeads,
        placeholderData: (previousData) => previousData,
        enabled: true
    });

    const analyticsQuery = useQuery({
        queryKey: ['leadsAnalytics', analyticsParams, appliedFilters],
        queryFn: fetchLeadsAnalytics,
        placeholderData: (previousData) => previousData,
        enabled: true
    });

    const isLoading = leadsQuery.isLoading || analyticsQuery.isLoading;
    const isError = leadsQuery.isError || analyticsQuery.isError;
    const leads = leadsQuery.data ? refineLeads(leadsQuery.data.DATA) : null;
    const analytics = analyticsQuery.data ? refineAnalytics(analyticsQuery.data.DATA) : [];
    const assignedToDropdownData = assignedToQuery.data ? assignedToQuery.data.DATA : []

    useEffect(() => {
        if (leads) {
            setTotalPages(leads.totalPages);
            setTotalEntries(leads.total);
        }
    }, [leads]);

    const columns = [
        { accessorKey: 'id', header: 'Serial No.' },
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'phoneNumber', header: 'Phone Number' },
        { accessorKey: 'gender', header: 'Gender' },
        { accessorKey: 'location', header: 'Location' },
        { accessorKey: 'course', header: 'Course' },
        {
            accessorKey: 'leadType',
            header: 'Lead Type',
            cell: ({ row }: any) => <TechnoLeadTypeTag type={row.original.leadType as TechnoLeadType} />
        },
        { accessorKey: 'nextDueDate', header: 'Next Due Date' },
        { accessorKey: 'createdAt', header: 'Timestamp' },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <Button onClick={() => handleViewMore({ ...row.original, leadType: row.original._leadType })}>
                    View More
                </Button>
            )
        }
    ];

    const getFiltersData = () => {
        return [
            {
                filterKey: 'date',
                isDateFilter: true
            },
            {
                filterKey: 'location',
                options: Object.values(Locations),
                hasSearch: true,
                multiSelect: true
            },
            {
                filterKey: 'course',
                options: Object.values(Course),
                hasSearch: true,
                multiSelect: true
            },
            {
                filterKey: 'leadType',
                options: Object.values(TechnoLeadType),
                multiSelect: true
            },
            {
                filterKey: 'assignedTo',
                options: assignedToDropdownData.map((item: any) => ({
                    id: item._id,
                    label: item.name || item._id || String(item)
                })),
                hasSearch: true,
                multiSelect: true
            }
        ];
    };

    return (
        <>
            <TechnoFiltersGroup filters={getFiltersData()} handleFilters={applyFilter} />
            {analytics && <TechnoAnalyticCardsGroup cardsData={analytics} />}
            {leads?.leads && (
                <TechnoDataTable
                    columns={columns}
                    data={leads.leads}
                    tableName="All Leads Data"
                    currentPage={page}
                    totalPages={totalPages}
                    pageLimit={limit}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    onSearch={handleSearch}
                    searchTerm={search}
                />
            )}
            <TechnoRightDrawer title={"Lead Details"} isOpen={isDrawerOpen} onClose={() => {setIsDrawerOpen(false);
                setRefreshKey(prev => prev+1)
            }}>
                {editRow && <LeadViewEdit data={editRow} />}
            </TechnoRightDrawer>
        </>
    );
}
