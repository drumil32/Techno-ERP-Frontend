import TechnoAnalyticCardsGroup, {
    CardItem
} from '../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoLeadTypeTag, { TechnoLeadType } from '../custom-ui/lead-type-tag/techno-lead-type-tag';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import TechnoRightDrawer from '../custom-ui/drawer/techno-right-drawer';
import LeadViewEdit from './allLeads/leads-view-edit';
import { Course, Locations } from '@/static/enum';

const fetchLeads = async ({ queryKey }: any) => {
    const [, params] = queryKey;
    console.log(params)
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

const refineLeads = (data: any) => {
    const refinedLeads = data.leads.map((lead: any, index: number) => ({
        _id: lead._id,
        id: index + 1,
        date: lead.date,
        name: lead.name,
        phoneNumber: lead.phoneNumber,
        gender: lead.gender,
        location: lead.location,
        course: lead.course ?? '-',
        leadType: TechnoLeadType[lead.leadType as keyof typeof TechnoLeadType] ?? lead.leadType,
        nextDueDate: lead.nextDueDate ?? '-',
        createdAt: new Date(lead.createdAt).toLocaleString()
    }));

    return {
        leads: refinedLeads,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total
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

const filtersData = [
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
        filterKey: 'lead',
        options: Object.values(TechnoLeadType),
        multiSelect: true
    },
    {
        filterKey: 'assignedTo',
        options: [],
        hasSearch: true,
        multiSelect: true
    }
];

export default function AllLeadsPage() {

    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>()

    const handleViewMore = (id: any) => {
        setSelectedLeadId(id);
        console.log(id)
        setIsDrawerOpen(true);
    };

    const { filters } = useTechnoFilterContext();
    const applyFilter = () => {
        setAppliedFilters(filters)
        console.log(filters)
    };

    // Single source of truth for pagination
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

    const filterParams = { page, limit };
    const analyticsParams = {};

    const leadsQuery = useQuery({
        queryKey: ['leads', filterParams, appliedFilters],
        queryFn: fetchLeads,
        placeholderData: (previousData) => previousData,
        enabled: true
    });

    const analyticsQuery = useQuery({
        queryKey: ['leadsAnalytics', analyticsParams],
        queryFn: fetchLeadsAnalytics,
        placeholderData: (previousData) => previousData,
        enabled: true
    });

    const isLoading = leadsQuery.isLoading || analyticsQuery.isLoading;
    const isError = leadsQuery.isError || analyticsQuery.isError;
    const leads = leadsQuery.data ? refineLeads(leadsQuery.data) : null;
    const analytics = analyticsQuery.data ? refineAnalytics(analyticsQuery.data) : [];

    console.log(leads)
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
                <Button onClick={() => handleViewMore(row.original._id)}>View More</Button>
            )
        }
    ];

    return (
        <>
            <TechnoFiltersGroup filters={filtersData} handleFilters={applyFilter} />
            {analytics && <TechnoAnalyticCardsGroup cardsData={analytics} />}
            {leads?.leads && (
                <TechnoDataTable
                    columns={columns}
                    data={leads.leads}
                    tableName="All Leads Data"
                    currentPage={page} // Use the single source of truth
                    totalPages={totalPages}
                    pageLimit={limit} // Pass the current limit
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            )}
            <TechnoRightDrawer title={"Lead Details"} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                {selectedLeadId && <LeadViewEdit id={selectedLeadId} />}
            </TechnoRightDrawer>

        </>
    );
}
