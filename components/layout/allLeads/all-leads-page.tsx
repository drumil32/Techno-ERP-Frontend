import TechnoAnalyticCardsGroup from '../../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoLeadTypeTag, {
  TechnoLeadType
} from '../../custom-ui/lead-type-tag/techno-lead-type-tag';
import { Button } from '../../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TechnoRightDrawer from '../../custom-ui/drawer/techno-right-drawer';
import LeadViewEdit from './leads-view-edit';
import { Course, Locations } from '@/static/enum';
import { fetchLeads, fetchAssignedToDropdown, fetchLeadsAnalytics } from './helpers/fetch-data';
import { refineLeads, refineAnalytics } from './helpers/refine-data';
import FilterBadges from './components/filter-badges';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import { toast } from 'sonner';


export default function AllLeadsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editRow, setEditRow] = useState<any>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string>('asc');
  const [isEditing, setIsEditing] = useState(false);

  const toggleIsEditing = () => {
    setIsEditing(prev => !prev)
  }

  const handleSortChange = (column: string, order: string) => {

    if (column === "nextDueDateView") {
      column = "nextDueDate"
    }

    setSortBy(column);
    setOrderBy(order);
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const assignedToQuery = useQuery({
    queryKey: ['assignedToDropdown'],
    queryFn: fetchAssignedToDropdown
  });

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewMore = (row: any) => {
    setEditRow(row);
    setIsDrawerOpen(true);
  };

  const { filters, updateFilter } = useTechnoFilterContext();

  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setPage(1);
    setAppliedFilters({ ...filters });
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleFilterRemove = (filterKey: string) => {
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
    setRefreshKey((prevKey) => prevKey + 1);
  };
  const clearFilters = () => {
    getFiltersData().forEach((filter) => {
      if (filter.filterKey === 'date') {
        updateFilter('date', undefined);
        updateFilter('startDate', undefined);
        updateFilter('endDate', undefined);
      } else {
        updateFilter(filter.filterKey, undefined);
      }
    });

    setAppliedFilters({});
    currentFiltersRef.current = {};
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
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

  const analytics = analyticsQuery.data ? refineAnalytics(analyticsQuery.data) : [];
  const assignedToDropdownData = Array.isArray(assignedToQuery.data) ? assignedToQuery.data : [];
  const leads = leadsQuery.data ? refineLeads(leadsQuery.data, assignedToDropdownData) : null;

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = leadsQuery.isLoading || analyticsQuery.isLoading;
    const hasError = leadsQuery.isError || analyticsQuery.isError;
    const isSuccess = leadsQuery.isSuccess && analyticsQuery.isSuccess;
    const isFetching = leadsQuery.isFetching || analyticsQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading leads data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load leads data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Leads data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load leads data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading leads data...', {
        duration: Infinity
      });
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [
    refreshKey,
    leadsQuery.isLoading,
    leadsQuery.isError,
    leadsQuery.isSuccess,
    leadsQuery.isFetching,
    analyticsQuery.isLoading,
    analyticsQuery.isError,
    analyticsQuery.isSuccess,
    analyticsQuery.isFetching
  ]);

  const columns = [
    { accessorKey: 'id', header: 'S. No' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phoneNumber', header: 'Phone Number' },
    { accessorKey: 'genderView', header: 'Gender' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'courseView', header: 'Course' },
    {
      accessorKey: 'leadType',
      header: 'Lead Type',
      cell: ({ row }: any) => <TechnoLeadTypeTag type={row.original.leadType as TechnoLeadType} />
    },
    { accessorKey: 'assignedToName', header: 'Assigned To' },
    { accessorKey: 'nextDueDateView', header: 'Next Due Date' },
    { accessorKey: 'leadTypeModifiedDate', header: 'Timestamp' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          className='cursor-pointer'
          onClick={() => handleViewMore({ ...row.original, leadType: row.original._leadType })}
        >
          <span className="font-inter font-semibold text-[12px] text-primary ">View More</span>
        </Button>
      )
    }
  ];

  const getFiltersData = () => {
    return [
      {
        filterKey: 'date',
        label: 'Date',
        isDateFilter: true
      },
      {
        filterKey: 'location',
        label: 'Location',
        options: Object.values(Locations),
        placeholder: 'location',
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'course',
        label: 'Course',
        options: Object.values(Course),
        placeholder: 'courses',
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'leadType',
        label: 'Lead Type',
        options: Object.values(TechnoLeadType),
        multiSelect: true
      },
      {
        filterKey: 'assignedTo',
        label: 'Assigned To',
        options: assignedToDropdownData.map((item: any) => {
          return {
            label: item.name,
            id: item._id
          };
        }) as FilterOption[],
        placeholder: 'person',
        hasSearch: true,
        multiSelect: true
      }
    ];
  };

  useEffect(() => {
    if (leads) {
      setTotalPages(leads.totalPages);
      setTotalEntries(leads.total);
    }
  }, [leads]);

  return (
    <>
      <TechnoFiltersGroup
        filters={getFiltersData()}
        handleFilters={applyFilter}
        clearFilters={clearFilters}
      />

      {analytics && <TechnoAnalyticCardsGroup cardsData={analytics} />}

      {leads?.leads && (
        <TechnoDataTable
          columns={columns}
          data={leads.leads}
          tableName="All Leads Table"
          currentPage={page}
          totalPages={totalPages}
          pageLimit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearch={handleSearch}
          searchTerm={search}
          onSort={handleSortChange}
          totalEntries={totalEntries}
        >
          <FilterBadges
            onFilterRemove={handleFilterRemove}
            assignedToData={assignedToDropdownData}
            appliedFilters={appliedFilters}
          />
        </TechnoDataTable>
      )}
      <TechnoRightDrawer
        title={'Edit Lead Details'}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setRefreshKey((prev) => prev + 1);
        }}
      >
        {isDrawerOpen && editRow && (
          <LeadViewEdit
            key={editRow._id}
            data={editRow}
          />
        )}
      </TechnoRightDrawer>

    </>
  );
}
