import TechnoAnalyticCardsGroup, { CardItem } from '../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoLeadTypeTag, { TechnoLeadType } from '../custom-ui/lead-type-tag/techno-lead-type-tag';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

// TODO: Create the drawer for the edit when view more click
// TODO: Update the table based on the params selected
// TODO: Implement the search Functionality
// TODO: Limit parameter in the table

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
            <Button onClick={() => console.log('View More:', row.original)}>View More</Button>
        )
    }
];

const fetchLeads = async ({ queryKey }: any) => {
    const [, params] = queryKey;
    const authToken = Cookies.get('token');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/crm/fetch-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(params),
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

const fetchLeadsAnalytics = async ({ queryKey }: any) => {
    const [, params] = queryKey;
    const authToken = Cookies.get('token');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/crm/analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(params),
        credentials: 'include'
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
}

const refineLeads = (data: any) => {
    console.log(data)
    const refinedLeads = data.leads.map((lead: any, index: number) => ({
        id: index + 1,
        date: lead.date,
        name: lead.name,
        phoneNumber: lead.phoneNumber,
        gender: lead.gender,
        location: lead.location,
        course: lead.course ?? "-",
        leadType: TechnoLeadType[lead.leadType as keyof typeof TechnoLeadType] ?? lead.leadType,
        nextDueDate: lead.nextDueDate ?? "-",
        createdAt: new Date(lead.createdAt).toLocaleString()
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
            heading: analytics.totalLeads ?? "",
            subheading: "100%",
            title: "Total Leads",
            color: "text-black",
        },
        {
            heading: analytics.openLeads ?? "",
            subheading: calculatePercentage(analytics.openLeads),
            title: "Open Leads",
            color: "text-orange-600",
        }, {
            heading: analytics.interestedLeads ?? "",
            subheading: calculatePercentage(analytics.interestedLeads),
            title: "Yellow Leads",
            color: "text-yellow-600",
        }, {
            heading: analytics.notInterestedLeads ?? "",
            subheading: calculatePercentage(analytics.notInterestedLeads),
            title: "Not Interested",
            color: "text-red-700",
        },
    ]
    return analyticsCardsData
}

export default function AllLeadsPage() {
    const [filtersData, setFiltersData] = useState(
        [
            {
                filterKey: 'date',
                isDateFilter: true
            },
            {
                filterKey: 'location',
                options: [],
                hasSearch: true,
                multiSelect: true
            },
            {
                filterKey: 'course',
                options: [],
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
        ]
    )
    const [hasError, setHasError] = useState(false);

    const { filters } = useTechnoFilterContext();
    const applyFilter = () => {
        console.log(filters);
    };

    const [pagesState, setPagesState] = useState(
        {
            currentPage: 1,
            totalPages: 0,
            totalEntries: 0,
        }
    )

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagesState.totalPages) {
            setPagesState((prev: any) => ({ ...prev, currentPage: newPage }));
        }
    };

    const [page, setPage] = useState(1);
    const limit = 10;

    const initialParams = { page, limit };

    const filterParams = { ...filters, page: pagesState.currentPage, limit };
    const analyticsParams = { ...filters }

    const results = useQueries({
        queries: [
            {
                queryKey: ['leads'],
                queryFn: fetchLeads,
                placeholderData: (previousData: any) => previousData,
                enabled: true
            },
            {
                queryKey: ['leadsAnalytics'],
                queryFn: fetchLeadsAnalytics,
                placeholderData: (previousData: any) => previousData,
                enabled: true
            }
        ]
    })

    const leadsQuery = results[0];
    const analyticsQuery = results[1];

    const isLoading = leadsQuery.isLoading || analyticsQuery.isLoading;
    const isError = leadsQuery.isError || analyticsQuery.isError;
    const leads = leadsQuery.data ? refineLeads(leadsQuery.data) : null;
    const analytics = analyticsQuery.data ? refineAnalytics(analyticsQuery.data) : [];

    useEffect(() => {
        if (
            leads &&
            (pagesState.currentPage !== leads.currentPage ||
                pagesState.totalPages !== leads.totalPages ||
                pagesState.totalEntries !== leads.total)
        ) {
            setPagesState({
                currentPage: leads.currentPage,
                totalPages: leads.totalPages,
                totalEntries: leads.total,
            });
        }
    }, [leads]);

    return (
        <>
            <TechnoFiltersGroup filters={filtersData} handleFilters={applyFilter} />
            {analytics &&
                <TechnoAnalyticCardsGroup cardsData={analytics} />
            }
            {leads?.leads && (
                <TechnoDataTable
                    columns={columns}
                    data={leads.leads}
                    tableName="All Leads Data"
                    currentPage={pagesState.currentPage}
                    totalPages={pagesState.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
}
