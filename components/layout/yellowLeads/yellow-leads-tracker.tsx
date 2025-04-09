import TechnoAnalyticCardsGroup, { CardItem } from '../../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
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
import { refineAnalytics, refineLeads, YellowLeadAnalytics } from './helpers/refine-data';
import FootFallTag, { FootFallStatus } from './foot-fall-tag';
import FinalConversionTag, { FinalConversionStatus } from './final-conversion-tag';
import FilterBadges from '../allLeads/components/filter-badges';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import YellowLeadViewEdit from './yellow-view-edit';
import { toast } from 'sonner';
import { LeadData } from '../allLeads/leads-view-edit';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { apiRequest } from '@/lib/apiClient';
import FinalConversionSelect from './final-conversion-select';

export default function YellowLeadsTracker() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editRow, setEditRow] = useState<any>(null);

  const [sortState, setSortState] = useState<any>({
    sortBy: ["leadTypeModifiedDate", "nextDueDate"],
    orderBy: ["desc", "desc"]
  })

  const handleSortChange = (column: string, order: string) => {

    if (column === "nextDueDateView") {
      column = "nextDueDate"
    }

    setSortState(
      (prevState: any) => {
        const currentIndex = prevState.sortBy.indexOf(column)
        let newOrderBy = [...prevState.orderBy]
        if (currentIndex != -1) {
          newOrderBy[currentIndex] = prevState.orderBy[currentIndex] == "asc" ? "desc" : "asc"
        }

        return {
          ...prevState,
          orderBy: newOrderBy
        }
      }
    )

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


    params.sortBy = sortState.sortBy
    params.orderBy = sortState.orderBy

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

  const analyticsQuery = useQuery<YellowLeadAnalytics>({
    queryKey: ['leadsAnalytics', analyticsParams, appliedFilters],
    queryFn: fetchYellowLeadsAnalytics,
    placeholderData: (previousData) => previousData,
    enabled: true
  });

  const analytics: CardItem[] = analyticsQuery.data ? refineAnalytics(analyticsQuery?.data) : [];

  const assignedToDropdownData = Array.isArray(assignedToQuery?.data) ? assignedToQuery?.data : [];
  const leads = leadsQuery.data ? refineLeads(leadsQuery.data, assignedToDropdownData) : null;

  useEffect(() => {
    if (leads) {
      setTotalPages(leads.totalPages);
      setTotalEntries(leads.total);
    }
  }, [leads]);

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = leadsQuery.isLoading || analyticsQuery.isLoading || assignedToQuery.isLoading;
    const hasError = leadsQuery.isError || analyticsQuery.isError || assignedToQuery.isError;
    const isSuccess = leadsQuery.isSuccess && analyticsQuery.isSuccess && assignedToQuery.isSuccess;
    const isFetching =
      leadsQuery.isFetching || analyticsQuery.isFetching || assignedToQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Data load failed', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Yellow Leads data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Data load failed', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading data...', {
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
    analyticsQuery.isFetching,
    assignedToQuery.isLoading,
    assignedToQuery.isError,
    assignedToQuery.isSuccess,
    assignedToQuery.isFetching
  ]);

  const columns = [
    { accessorKey: 'id', header: 'S. No.' },
    { accessorKey: 'leadTypeModifiedDate', header: 'LTC Date' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phoneNumber', header: 'Phone Number' },
    { accessorKey: 'areaView', header: 'Area' },
    { accessorKey: 'cityView', header: 'City' },
    { accessorKey: 'courseView', header: 'Course' },
    {
      accessorKey: 'footFall',
      header: 'Foot Fall',
      cell: ({ row }: any) => (
        <FootFallTag status={row.original.footFall === true ? FootFallStatus.true : FootFallStatus.false} />
      )
    },
    { accessorKey: 'nextDueDateView', header: 'Next Call Date' },
    {
      accessorKey: 'yellowLeadsFollowUpCount',
      header: 'Follow Ups',
      cell: ({ row }: any) => {
        const [selectedValue, setSelectedValue] = useState(row.original.yellowLeadsFollowUpCount);

        const handleDropdownChange = async (newValue: number) => {
          const previousValue = selectedValue;
          setSelectedValue(newValue);

          const filteredData = {
            _id: row.original._id,
            yellowLeadsFollowUpCount: newValue,
          };

          const response: LeadData | null = await apiRequest(
            API_METHODS.PUT,
            API_ENDPOINTS.updateYellowLead,
            filteredData
          );

          if (response) {
            toast.success('Follow-up count updated successfully');
            setRefreshKey((prevKey) => prevKey + 1);
          } else {
            toast.error('Failed to update follow-up count');
            setSelectedValue(previousValue);
          }
        };

        return (
          <select
            value={selectedValue}
            onChange={(e) => handleDropdownChange(Number(e.target.value))}
            className=" border rounded px-2 py-1 cursor-pointer"
            aria-label="Follow-up count"
          >
            {[0, 1, 2, 3, 4, 5].map((option) => (
              <option key={option} value={option}>
                {option.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        );
      },
    }
    ,
    {
      accessorKey: 'finalConversion',
      header: 'Final Conversion',
      cell: ({ row }: any) => {
        const value = row.original.finalConversion as FinalConversionStatus;

        const handleChange = async (newValue: FinalConversionStatus) => {
          const updatedData = {
            _id: row.original._id,
            finalConversion: newValue,
          };
          const response: LeadData | null = await apiRequest(
            API_METHODS.PUT,
            API_ENDPOINTS.updateYellowLead,
            updatedData
          );

          if (response) {
            toast.success('Final conversion updated successfully');
            setRefreshKey((prevKey) => prevKey + 1);
          } else {
            toast.error('Failed to update final conversion');
          }
        };

        return <FinalConversionSelect value={value} onChange={handleChange} />;
      },
    },
    { accessorKey: 'assignedToName', header: 'Assigned To' },
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
        filterKey: 'leadTypeModifiedDate',
        label: 'LTC Date',
        isDateFilter: true
      },
      {
        filterKey: 'city',
        label: 'City',
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
        filterKey: 'finalConversionType',
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


    if (filterKey === 'date' || filterKey.includes('Date')) {

      const dateKeys = [
        'startDate', 'endDate',
        'startLTCDate', 'endLTCDate',
        'date'
      ];

      dateKeys.forEach(key => {
        delete updatedFilters[key];
        updateFilter(key, undefined);
      });
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
      if (filter.filterKey === 'date' || filter.isDateFilter) {
        const dateKeys = [
          'startDate', 'endDate',
          'startLTCDate', 'endLTCDate',
          'date'
        ];

        dateKeys.forEach(key => updateFilter(key, undefined));
      } else {
        updateFilter(filter.filterKey, undefined);
      }
    });

    setAppliedFilters({});
    currentFiltersRef.current = {};
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

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
          tableName="Yellow Leads Table"
          currentPage={page}
          totalPages={totalPages}
          pageLimit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearch={handleSearch}
          searchTerm={search}
          onSort={handleSortChange}
          totalEntries={totalEntries}
          handleViewMore={handleViewMore}
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
        {isDrawerOpen && editRow && (
          <YellowLeadViewEdit
            key={editRow._id}
            data={editRow}
          />
        )}
      </TechnoRightDrawer>
    </>
  );
}
