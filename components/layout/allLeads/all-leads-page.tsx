import TechnoAnalyticCardsGroup from '../../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoLeadTypeTag, { TechnoLeadType } from '../../custom-ui/lead-type-tag/techno-lead-type-tag';
import { Button } from '../../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TechnoRightDrawer from '../../custom-ui/drawer/techno-right-drawer';
import LeadViewEdit from './leads-view-edit';
import { Course, Locations } from '@/static/enum';
import { fetchLeads, fetchAssignedToDropdown, fetchLeadsAnalytics } from './helpers/fetch-data';
import { refineLeads, refineAnalytics } from './helpers/refine-data';
import FilterBadges from './components/filter-badges';

export default function AllLeadsPage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>({}); // Initialize to empty object
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [editRow, setEditRow] = useState<any>(null)

    const [sortBy, setSortBy] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<string>('asc');


    const handleSortChange = (column: string, order: string) => {
        setSortBy(column);
        setOrderBy(order);
        setPage(1);
        setRefreshKey(prevKey => prevKey + 1);
    };


    const assignedToQuery = useQuery({
        queryKey: ['assignedToDropdown'],
        queryFn: fetchAssignedToDropdown,
    });

    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleViewMore = (row: any) => {
        setEditRow(row)
        setIsDrawerOpen(true);
    };

    const { filters, updateFilter } = useTechnoFilterContext();

    const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

    const applyFilter = () => {
        currentFiltersRef.current = { ...filters };
        setPage(1)
        console.log("Filters before apply:", filters);
        console.log("Applied filters before set:", appliedFilters);
        setAppliedFilters({ ...filters });
        console.log("Applied filters after set:", { ...filters });
        setRefreshKey(prevKey => prevKey + 1);
    };


    const handleFilterRemove = (filterKey: string) => {
        console.log("Remove filter");
        const updatedFilters = { ...appliedFilters };

        if (filterKey === 'date') {
            delete updatedFilters.startDate;
            delete updatedFilters.endDate;
            delete updatedFilters.date;
            updateFilter('date', undefined);
            updateFilter('startDate', undefined);
            updateFilter('endDate', undefined);
        } else {
            delete updatedFilters[filterKey];
            updateFilter(filterKey, undefined);
        }

        setAppliedFilters(updatedFilters);
        setPage(1);
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
        const params: { [key: string]: any } = {
            page,
            limit,
            search: debouncedSearch,
            ...appliedFilters,
            refreshKey
        };

        if (sortBy) {
            params.sortBy = sortBy;
            params.orderBy = orderBy;
        }

        return params;
    };


    const filterParams = getQueryParams();
    const analyticsParams = getQueryParams();

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
    const analytics = analyticsQuery.data ? refineAnalytics(analyticsQuery.data.DATA) : [];
    const assignedToDropdownData = assignedToQuery.data ? assignedToQuery.data.DATA : []



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
        { accessorKey: 'assignedToName', header: 'Assigned To' },
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

    const leads = leadsQuery.data ? refineLeads(leadsQuery.data.DATA, assignedToDropdownData) : null;

    useEffect(() => {
        if (leads) {
            setTotalPages(leads.totalPages);
            setTotalEntries(leads.total);
        }
    }, [leads]);


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
                    onSort={handleSortChange}
                >
                    <FilterBadges
                        onFilterRemove={handleFilterRemove}
                        assignedToData={assignedToDropdownData}
                        appliedFilters={appliedFilters}
                    />
                </TechnoDataTable>
            )}
            <TechnoRightDrawer title={"Lead Details"} isOpen={isDrawerOpen} onClose={() => {
                setIsDrawerOpen(false);
                setRefreshKey(prev => prev + 1)
            }}>
                {editRow && <LeadViewEdit data={editRow} />}
            </TechnoRightDrawer>
        </>
    );
}