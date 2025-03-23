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
import { Course, FinalConversionType, Locations } from '@/static/enum';
import {
  fetchAssignedToDropdown,
  fetchYellowLeads,
  fetchYellowLeadsAnalytics
} from './helpers/fetch-data';
import { refineAnalytics, refineLeads } from './helpers/refine-data';
import LeadViewEdit from '../allLeads/leads-view-edit';
import logger from '@/lib/logger';
import CampusVisitTag, { CampusVisitStatus } from './campus-visit-tag';
import FinalConversionTag, { FinalConversionStatus } from './final-conversion-tag';
import FilterBadges from '../allLeads/components/filter-badges';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';

export default function YellowLeadsTracker() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editRow, setEditRow] = useState<any>(null);

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [orderBy, setOrderBy] = useState<string>('asc');

  const handleSortChange = (column: string, order: string) => {
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
    queryFn: fetchYellowLeads,
    placeholderData: (previousData) => previousData,
    enabled: true
  });

  const analyticsQuery = useQuery({
    queryKey: ['leadsAnalytics', analyticsParams, appliedFilters],
    queryFn: fetchYellowLeadsAnalytics,
    placeholderData: (previousData) => previousData,
    enabled: true
  });

  const isLoading = leadsQuery.isLoading || analyticsQuery.isLoading;
  const isError = leadsQuery.isError || analyticsQuery.isError;
  const analytics = analyticsQuery.data ? refineAnalytics(analyticsQuery.data) : [];
  const assignedToDropdownData = Array.isArray(assignedToQuery?.data) ? assignedToQuery?.data : [];
  const leads = leadsQuery.data ? refineLeads(leadsQuery.data, assignedToDropdownData) : null;

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
    { accessorKey: 'altPhoneNumber', header: 'Alt. Phone Number' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'assignedToName', header: 'Assigned To' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'course', header: 'Course' },
    {
      accessorKey: 'campusVisit',
      header: 'Campus Visit',
      cell: ({ row }: any) => (
        <CampusVisitTag status={row.original.campusVisit as CampusVisitStatus} />
      )
    },
    {
      accessorKey: 'finalConversion',
      header: 'Final Conversion',
      cell: ({ row }: any) => (
        <FinalConversionTag status={row.original.finalConversion as FinalConversionStatus} />
      )
    },
    { accessorKey: 'remarks', header: 'Remarks' },
    { accessorKey: 'ltcDate', header: 'LTC Date' },
    { accessorKey: 'nextDueDate', header: 'Next Due Date' },
    { accessorKey: 'createdAt', header: 'Created At' },
    { accessorKey: 'updatedAt', header: 'Updated At' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
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
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'course',
        label: 'Course',
        options: Object.values(Course),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'finalConversion',
        label: 'Final Conversion',
        options: Object.values(FinalConversionStatus),
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
        hasSearch: true,
        multiSelect: true
      }
    ];
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

  return (
    <>
      <TechnoFiltersGroup filters={getFiltersData()} handleFilters={applyFilter} />
      {analytics && <TechnoAnalyticCardsGroup cardsData={analytics} />}
      {leads?.leads && (
        <TechnoDataTable
          columns={columns}
          data={leads.leads}
          tableName="Yellow Leads Data"
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
      <TechnoRightDrawer
        title={'Lead Details'}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setRefreshKey((prev) => prev + 1);
        }}
      >
        {editRow && <LeadViewEdit data={editRow} />}
      </TechnoRightDrawer>
    </>
  );
}
