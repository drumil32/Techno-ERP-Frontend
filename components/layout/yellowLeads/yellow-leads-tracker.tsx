'use client';

import TechnoAnalyticCardsGroup, {
  CardItem
} from '../../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import TechnoDataTable, { TruncatedCell } from '@/components/custom-ui/data-table/techno-data-table';
import { Button } from '../../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import TechnoRightDrawer from '../../custom-ui/drawer/techno-right-drawer';
import {
  fetchAssignedToDropdown,
  fetchYellowLeads,
  fetchYellowLeadsAnalytics
} from './helpers/fetch-data';
import { refineAnalytics, refineLeads, YellowLeadAnalytics } from './helpers/refine-data';
import FootFallTag, { FootFallStatus } from './foot-fall-tag';
import FinalConversionTag from './final-conversion-tag';
import FilterBadges from '../allLeads/components/filter-badges';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import YellowLeadViewEdit from './yellow-view-edit';
import { toast } from 'sonner';
import { LeadData } from '../allLeads/leads-view-edit';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { apiRequest } from '@/lib/apiClient';
import FinalConversionSelect from './final-conversion-select';
import {
  cityDropdown,
  courseDropdown,
  marketingSourcesDropdown
} from '../admin-tracker/helpers/fetch-data';
import FootFallSelect from './foot-fall-select';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import Loading from '@/app/loading';
import { FilterData } from '@/components/custom-ui/filter/type';
import useAuthStore from '@/stores/auth-store';
import { FinalConversionStatus, UserRoles } from '@/types/enum';
import { format } from 'date-fns';
import UserAnalytics from '../allLeads/user-analytics';

export default function YellowLeadsTracker() {
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editRow, setEditRow] = useState<any>(null);
  const authStore = useAuthStore();
  const isRoleLeadMarketing = authStore.hasRole(UserRoles.LEAD_MARKETING);

  const [sortState, setSortState] = useState<any>({
    sortBy: ['leadTypeModifiedDate'],
    orderBy: ['desc']
  });
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const handleSortChange = (column: string, order: string) => {
    if (column === 'nextDueDateView') {
      column = 'nextDueDate';
    }
    if (column === 'dateView') {
      column = 'date';
    }

    setSortState({
      ...sortState,
      sortBy: [column],
      orderBy: [order]
    });

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
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [leadData, setLeadData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

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

    params.sortBy = sortState.sortBy;
    params.orderBy = sortState.orderBy;

    return params;
  };

  const filterParams = getQueryParams();
  const analyticsParams = getQueryParams();

  const leadsQuery = useQuery({
    queryKey: ['leads', filterParams, appliedFilters, debouncedSearch],
    queryFn: fetchYellowLeads,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
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
    if (leadsQuery.data) {
      const data: any = leadsQuery.data;

      if (data) {
        if (page === 1) {
          setLeadData(leads?.leads || []);
        } else {
          let newleads = leadsQuery.data ? refineLeads(leadsQuery.data, assignedToDropdownData) : null;
          setLeadData((prev) => {
            const tleads = [...prev, ...(newleads?.leads || [])];
            // console.log(tleads);

            const allleads = tleads
              .filter(lead => lead)
              .map((lead, index) => ({
                ...lead,
                id: index + 1
              }));

            return allleads;
          });

        }
        setHasMore(leads?.total === limit);
        setTotalEntries(data?.total);
      }
    }
  }, [leadsQuery.data]);
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
        toast.success('Active Leads data loaded successfully', {
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
    {
      accessorKey: 'id',
      header: 'S.No.',
      meta: { align: 'center', maxWidth: 60, fixedWidth: 70 },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      meta: { align: 'center', maxWidth: 100, fixedWidth: 120 },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { align: 'left', maxWidth: 130, fixedWidth: 130 },
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone Number',
      meta: { maxWidth: 130, fixedWidth: 150 },
    },
    {
      accessorKey: 'courseView',
      header: 'Course',
      meta: { maxWidth: 120, fixedWidth: 140 },
    },
    {
      accessorKey: 'altPhoneNumber',
      header: 'Alt Phone Number',
      meta: { maxWidth: 130, fixedWidth: 150 },
    },
    {
      accessorKey: 'footFall',
      header: 'Footfall',
      meta: { align: 'center', fixedWidth: 100, maxWidth: 100 },
      cell: ({ row }: any) => {
        const [selectedStatus, setSelectedStatus] = useState<FootFallStatus>(
          row.original.footFall ? FootFallStatus.true : FootFallStatus.false
        );

        const handleFootfallChange = async (newValue: FootFallStatus) => {
          const previousValue = selectedStatus;
          setSelectedStatus(newValue);

          const toastId = toast.loading('Updating footfall...', { duration: Infinity });
          const updatedData = { _id: row.original._id, footFall: newValue === FootFallStatus.true };
          const { id } = row.original;

          try {
            const response: any = await apiRequest(API_METHODS.PUT, API_ENDPOINTS.updateYellowLead, updatedData);
            toast.dismiss(toastId);

            if (response) {
              toast.success('Footfall updated!', { duration: 1500 });

              const updateLeadCache = () => {
                const queryCache = queryClient.getQueryCache();
                const leadQueries = queryCache.findAll({ queryKey: ['leads'] });

                leadQueries.forEach((query) => {
                  queryClient.setQueryData(query.queryKey, (oldData: any) => {
                    if (!oldData || !oldData.yellowLeads) return oldData;

                    const newData = JSON.parse(JSON.stringify(oldData));

                    const leadIndex = newData.yellowLeads.findIndex(
                      (lead: any) => lead._id === response._id
                    );

                    if (leadIndex !== -1) {
                      setLeadData((prevLeads) => {
                        return prevLeads.map((lead, index) => {
                          if (index === id - 1) {
                            return {
                              ...lead,
                              footFall: response.footFall,
                              finalConversion: response.finalConversion,
                              lastCallDate: response.lastCallDate,
                            };
                          }
                          return lead;
                        });
                      });
                    }

                    return newData;
                  });
                });
              };

              updateLeadCache();

              queryClient.invalidateQueries({ queryKey: ['leadsAnalytics'] });
            } else {
              throw new Error();
            }
          } catch {
            toast.dismiss(toastId);
            toast.error('Update failed!', { duration: 1500 });
            setSelectedStatus(previousValue);
          }
        };

        return <FootFallSelect value={selectedStatus} onChange={handleFootfallChange} />;
      },
    },
    {
      accessorKey: 'remarksView',
      header: 'Remarks',
      meta: {
        maxWidth: 130,
        fixedWidth:130 ,
      },
      
    },
    {
      accessorKey: 'followUpCount',
      header: 'Follow Ups',
      meta: { align: 'center', maxWidth: 150, fixedWidth: 150 },
      cell: ({ row }: any) => {
        const [selectedValue, setSelectedValue] = useState(row.original.followUpCount);
        const toastIdRef = useRef<string | number | null>(null);

        const handleDropdownChange = async (value: number) => {
          const previousValue = selectedValue;
          setSelectedValue(value);
          toastIdRef.current = toast.loading('Updating...', { duration: Infinity });

          const updatedData = { _id: row.original._id, followUpCount: value };

          const { id } = row.original;
          try {
            const response: LeadData | null = await apiRequest(
              API_METHODS.PUT,
              API_ENDPOINTS.updateYellowLead,
              updatedData
            );

            toast.dismiss(toastIdRef.current);

            if (response) {
              toast.success('Follow-up count updated successfully', { duration: 1500 });


              const updateLeadCache = () => {
                const queryCache = queryClient.getQueryCache();
                const leadQueries = queryCache.findAll({ queryKey: ['leads'] });

                leadQueries.forEach((query) => {
                  queryClient.setQueryData(query.queryKey, (oldData: any) => {
                    if (!oldData || !oldData.yellowLeads) return oldData;

                    const newData = JSON.parse(JSON.stringify(oldData));

                    const leadIndex = newData.yellowLeads.findIndex(
                      (lead: any) => lead._id === response._id
                    );

                    if (leadIndex !== -1) {
                      setLeadData((prevLeads) => {
                        return prevLeads.map((lead, index) => {
                          if (index === id - 1) {
                            return {
                              ...lead,
                              followUpCount: response.followUpCount,
                              lastCallDate: response.lastCallDate,
                            };
                          }
                          return lead;
                        });
                      });
                    }

                    return newData;
                  });
                });
              };

              updateLeadCache();

              queryClient.invalidateQueries({ queryKey: ['leadsAnalytics'] });
            } else {
              throw new Error();
            }
          } catch (err) {
            console.log("err is ", err)
            toast.dismiss(toastIdRef.current);
            toast.error('Failed to update follow-up count', { duration: 1500 });
            setSelectedValue(previousValue);
          }
        };

        return (
          <Select value={selectedValue.toString()} onValueChange={(val) => handleDropdownChange(Number(val))}>
            <SelectTrigger className="w-[60px] bg-white mx-auto min-h-[unset] h-8 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="w-[60px] min-w-[unset]">
              {Array.from({ length: selectedValue + 2 }, (_, i) => (
                <SelectItem key={i} value={i.toString()} className="text-sm h-8 justify-center">
                  {i.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: 'nextDueDateView',
      header: 'Next Due Date',
      meta: { align: 'center', maxWidth: 160, fixedWidth: 190 },
    },
    {
      accessorKey: 'finalConversion',
      header: 'Lead Type',
      meta: { align: 'center', maxWidth: 170, fixedWidth: 190 },
      cell: ({ row }: any) => {
        const value = row.original.finalConversion as FinalConversionStatus;

        const handleChange = async (newValue: FinalConversionStatus) => {
          const updatedData = { _id: row.original._id, finalConversion: newValue };
          const { id } = row.original
          const response: LeadData | null = await apiRequest(
            API_METHODS.PUT,
            API_ENDPOINTS.updateYellowLead,
            updatedData
          );

          if (response) {
            toast.success('Lead Type updated successfully');

            queryClient.invalidateQueries({ queryKey: ['leadsAnalytics'] });
            const updateLeadCache = () => {
              const queryCache = queryClient.getQueryCache();
              const leadQueries = queryCache.findAll({ queryKey: ['leads'] });

              leadQueries.forEach((query) => {
                queryClient.setQueryData(query.queryKey, (oldData: any) => {
                  if (!oldData || !oldData.yellowLeads) return oldData;

                  const newData = JSON.parse(JSON.stringify(oldData));

                  const leadIndex = newData.yellowLeads.findIndex(
                    (lead: any) => lead._id === response._id
                  );

                  if (leadIndex !== -1) {
                    setLeadData((prevLeads) => {
                      return prevLeads.map((lead, index) => {
                        if (index === id - 1) {
                          return {
                            ...lead,
                            finalConversion: response.finalConversion,
                            lastCallDate: response.lastCallDate,
                          };
                        }
                        return lead;
                      });
                    });
                  }

                  return newData;
                });
              });
            };

            updateLeadCache();
          }

        };

        return <FinalConversionSelect value={value} onChange={handleChange} />;
      },
    },
    {
      accessorKey: 'areaView',
      header: 'Area',
      meta: { align: 'left', maxWidth: 120, fixedWidth: 120 },
    },
    {
      accessorKey: 'cityView',
      header: 'City',
      meta: { maxWidth: 120, fixedWidth: 120 },
    },
    ...(isRoleLeadMarketing
      ? [
        {
          accessorKey: 'assignedToName',
          header: 'Assigned To',
          meta: { align: 'left', maxWidth: 140, fixedWidth: 140 },
        },
      ]
      : []),
  ];

  const cityDropdownQuery = useQuery({
    queryKey: ['cities'],
    queryFn: cityDropdown
  });
  const marketingSourceQuery = useQuery({
    queryKey: ['marketingSources'],
    queryFn: marketingSourcesDropdown
  });
  const marketingSource = Array.isArray(marketingSourceQuery.data) ? marketingSourceQuery.data : [];

  const cityDropdownData = Array.isArray(cityDropdownQuery.data) ? cityDropdownQuery.data : [];

  const courseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: courseDropdown
  });
  const courses = Array.isArray(courseQuery.data) ? courseQuery.data : [];
  const getFiltersData = (): FilterData[] => {
    // console.log("in filters ")
    return [
      {
        filterKey: 'date',
        placeholder: 'Date',
        label: 'Date',
        isDateFilter: true
      },
      {
        filterKey: 'source',
        label: 'Source',
        placeholder: 'Source',
        options: marketingSource.map((item: string) => {
          return {
            label: item,
            id: item
          };
        }),
        multiSelect: true
      },
      {
        filterKey: 'city',
        label: 'City',
        placeholder: 'City',
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
        placeholder: 'Course',
        options: courses.map((item: string) => {
          return {
            label: item,
            id: item
          };
        }),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'finalConversionType',
        label: 'Lead Type',
        placeholder: 'Lead Type',
        options: Object.values(FinalConversionStatus),
        multiSelect: true
      },
      ...(isRoleLeadMarketing
        ? [
          {
            filterKey: 'assignedTo',
            label: 'Assigned To',
            placeholder: 'Assigned To',
            options: assignedToDropdownData?.map((item: any) => ({
              label: item.name,
              id: item._id
            })),
            hasSearch: true,
            multiSelect: true
          }
        ]
        : [])
    ];
  };

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey === 'date' || filterKey.includes('Date')) {
      const dateKeys = [
        'date',
        'nextDueDate',
        'startNextDueDate',
        'endNextDueDate',
        'activeLeadsDateFilters',
        'allLeadsDateFilters'
      ];

      dateKeys.forEach((key) => {
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
        const dateKeys = ['startDate', 'endDate', 'startLTCDate', 'endLTCDate', 'date','activeLeadsDateFilters','allLeadsDateFilters'];

        dateKeys.forEach((key) => updateFilter(key, undefined));
      } else {
        updateFilter(filter.filterKey, undefined);
      }
    });

    setAppliedFilters({});
    currentFiltersRef.current = {};
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };
  if (!leads?.leads || !analytics) {
    return <Loading />;
  }

  const handleDateFilter = (
    columnId: string,
    startDate: Date | undefined,
    endDate: Date | undefined
  ) => {
    if (columnId === 'nextDueDateView') {
      if (startDate) {
        updateFilter('startNextDueDate', format(startDate, 'dd/MM/yyyy'));
        updateFilter('endNextDueDate', format(startDate, 'dd/MM/yyyy'));
      } else {
        updateFilter('startNextDueDate', undefined);
        updateFilter('endNextDueDate', undefined);
      }

      applyFilter();
    }
  };

  return (
    leads?.leads &&
    analytics && (
      <>
        <div className="flex justify-between w-full items-center pr-2">
          <TechnoFiltersGroup
            filters={getFiltersData()}
            handleFilters={applyFilter}
            clearFilters={clearFilters}
          />
          <UserAnalytics />
        </div>
        {analytics && <TechnoAnalyticCardsGroup cardsData={analytics} />}
        {leads?.leads && (
          <TechnoDataTable
            columns={columns}
            data={leadData}
            tableName="Active Leads"
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
            searchBarPlaceholder="Search student name or number"
            onDateFilter={handleDateFilter}
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
            setSelectedRowId(null);
            setIsDrawerOpen(false);
          }}
        >
          {isDrawerOpen && editRow && (
            <YellowLeadViewEdit
              setIsDrawerOpen={setIsDrawerOpen}
              setSelectedRowId={setSelectedRowId}
              setRefreshKey={setRefreshKey}
              key={editRow._id}
              data={editRow}
              setLeadData={setLeadData}
            />
          )}
        </TechnoRightDrawer>
      </>
    )
  );
}
