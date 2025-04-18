'use client'

import TechnoAnalyticCardsGroup from '../../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { Button } from '../../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TechnoRightDrawer from '../../custom-ui/drawer/techno-right-drawer';

import LeadViewEdit, { LeadData } from './leads-view-edit';
import { Course, LeadType, Locations } from '@/static/enum';
import { fetchLeads, fetchAssignedToDropdown, fetchLeadsAnalytics } from './helpers/fetch-data';
import { refineLeads, refineAnalytics } from './helpers/refine-data';
import FilterBadges from './components/filter-badges';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import { toast } from 'sonner';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { apiRequest } from '@/lib/apiClient';
import LeadTypeSelect from '@/components/custom-ui/lead-type-select/lead-type-select';
import { cityDropdown } from '../admin-tracker/helpers/fetch-data';

export default function AllLeadsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editRow, setEditRow] = useState<any>(null);
  const [sortState, setSortState] = useState<any>({
    sortBy: ["date", "nextDueDate"],
    orderBy: ["desc", "desc"]
  })
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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
  const cityDropdownQuery = useQuery({
    queryKey: ['cities'],
    queryFn: cityDropdown
  })
  const cityDropdownData = Array.isArray(cityDropdownQuery.data) ? cityDropdownQuery.data : [];
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
    { accessorKey: 'dateView', header: 'Date' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'phoneNumber', header: 'Phone Number' },
    { accessorKey: 'areaView', header: 'Area' },
    { accessorKey: 'cityView', header: 'City' },
    { accessorKey: 'courseView', header: 'Course' },
    {
      accessorKey: 'leadType',
      header: 'Lead Type',
      cell: ({ row }: any) => {
        const [selectedType, setSelectedType] = useState<LeadType>(row.original.leadType);

        const handleDropdownChange = async (value: LeadType) => {
          setSelectedType(value);

          const {
            id,
            altPhoneNumberView,
            emailView,
            genderView,
            areaView,
            cityView,
            dateView,
            courseView,
            _leadType,
            source,
            sourceView,
            assignedToView,
            assignedToName,
            nextDueDateView,
            createdAt,
            updatedAt,
            remarks,
            remarksView,
            leadTypeModifiedDate,
            ...cleanedRow
          } = row.original;

          const updatedData = {
            ...cleanedRow,
            leadType: value,
          };
          // const{leadTypeModifiedDate, ...updatedData} = {
          //   ...row.original,
          //   leadType: value,
          // };

          const response: LeadData | null = await apiRequest(
            API_METHODS.PUT,
            API_ENDPOINTS.updateLead,
            updatedData
          );

          if (response) {
            toast.success('Lead type updated successfully');
            setRefreshKey((prevKey) => prevKey + 1);
          } else {
            toast.error('Failed to update lead type');
            setSelectedType(row.original.leadType); // rollback
          }
        };

        return (
          <LeadTypeSelect value={selectedType} onChange={handleDropdownChange} />
        );
      },
    },

    { accessorKey: 'assignedToName', header: 'Assigned To' },
    { accessorKey: 'nextDueDateView', header: 'Next Due Date' },
    {
      accessorKey: 'leadsFollowUpCount',
      header: 'Follow Ups',
      cell: ({ row }: any) => {
        const [selectedValue, setSelectedValue] = useState(row.original.leadsFollowUpCount);

        const handleDropdownChange = async (newValue: number) => {
          const previousValue = selectedValue;
          setSelectedValue(newValue); // optimistic update

          const filteredData = {
            ...row.original,
            leadsFollowUpCount: newValue,
          };

          const {
            id,
            altPhoneNumberView,
            emailView,
            genderView,
            areaView,
            courseView,
            _leadType,
            dateView,
            source,
            sourceView,
            cityView,
            assignedToView,
            assignedToName,
            nextDueDateView,
            createdAt,
            updatedAt,
            remarks,
            remarksView,
            leadTypeModifiedDate,
            ...cleanedRow
          } = filteredData;

          const response: LeadData | null = await apiRequest(
            API_METHODS.PUT,
            API_ENDPOINTS.updateLead,
            cleanedRow
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
            className="border rounded px-2 py-1 cursor-pointer"
            aria-label="Follow-up count"
          >
            {Array.from({ length: selectedValue + 2 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        );
      },
    }
    ,
    { accessorKey: 'leadTypeModifiedDate', header: 'Timestamp' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => handleViewMore({ ...row.original, leadType: row.original._leadType })}
        >
          <span className="font-inter font-semibold text-[12px] text-primary">View More</span>
        </Button>
      ),
    },
  ];

  const getFiltersData = () => {
    return [
      {
        filterKey: 'date',
        label: 'Date',
        isDateFilter: true
      },
      {
        filterKey: 'city',
        label: 'City',
        options: cityDropdownData.map((item: string) => {
          return {
            label: item,
            id: item
          };
        }),
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
        options: Object.values(LeadType),
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
          handleViewMore={handleViewMore}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
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
          setSelectedRowId(null);
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
