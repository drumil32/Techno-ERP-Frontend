'use client';

import TechnoAnalyticCardsGroup from '../../custom-ui/analytic-card/techno-analytic-cards-group';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { use, useEffect, useRef, useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import TechnoRightDrawer from '../../custom-ui/drawer/techno-right-drawer';
import LeadViewEdit, { LeadData } from './leads-view-edit';
import { Course, LeadType, Locations, UserRoles } from '@/types/enum';
import { fetchLeads, fetchAssignedToDropdown, fetchLeadsAnalytics } from './helpers/fetch-data';
import { refineLeads, refineAnalytics } from './helpers/refine-data';
import FilterBadges from './components/filter-badges';
1;
import { toast } from 'sonner';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { apiRequest } from '@/lib/apiClient';
import LeadTypeSelect from '@/components/custom-ui/lead-type-select/lead-type-select';
import {
  cityDropdown,
  courseDropdown,
  marketingSourcesDropdown
} from '../admin-tracker/helpers/fetch-data';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import Loading from '@/app/loading';
import { FilterData } from '@/components/custom-ui/filter/type';
import useAuthStore from '@/stores/auth-store';
import { LuDownload, LuUpload } from 'react-icons/lu';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { FaCircleExclamation } from 'react-icons/fa6';

export default function AllLeadsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editRow, setEditRow] = useState<any>(null);
  const [sortState, setSortState] = useState<any>({
    sortBy: ['date'],
    orderBy: ['desc']
  });
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const authStore = useAuthStore();
  const isRoleLeadMarketing = authStore.hasRole(UserRoles.LEAD_MARKETING);

  // const handleSortChange = (column: string, order: string) => {
  //   if (column === 'nextDueDateView') {
  //     column = 'nextDueDate';
  //   }
  //   if (column === 'dateView') {
  //     column = 'date';
  //   }

  //   setSortState((prevState: any) => {
  //     const currentIndex = prevState.sortBy.indexOf(column);
  //     let newOrderBy = [...prevState.orderBy];
  //     if (currentIndex != -1) {
  //       newOrderBy[currentIndex] = prevState.orderBy[currentIndex] == 'asc' ? 'desc' : 'asc';
  //     }

  //     return {
  //       ...prevState,
  //       orderBy: newOrderBy
  //     };
  //   });

  //   setPage(1);
  //   setRefreshKey((prevKey) => prevKey + 1);
  // };

  const handleSortChange = (column: string, order: string) => {
    if (column === 'nextDueDateView') {
      column = 'nextDueDate';
    }
    if (column === 'dateView') {
      column = 'date';
    }
    if (column === 'yellowLeadsFollowUpCount') {
      column = 'yellowLeadsFollowUpCount';
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

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey === 'date' || filterKey.includes('Date')) {
      const dateKeys = ['startDate', 'endDate', 'startLTCDate', 'endLTCDate', 'date'];

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
        const dateKeys = ['startDate', 'endDate', 'startLTCDate', 'endLTCDate', 'date'];

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
  const [limit, setLimit] = useState(20);
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

    params.sortBy = sortState.sortBy;
    params.orderBy = sortState.orderBy;

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
  });
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
    { accessorKey: 'id', header: 'S. No', meta: { align: 'center' } },
    { accessorKey: 'dateView', header: 'Date' },
    {
      accessorKey: 'name',
      header: 'Name',
      meta: { align: 'left', maxWidth: 120 }
    },
    { accessorKey: 'phoneNumber', header: 'Phone Number' },
    { accessorKey: 'areaView', header: 'Area', meta: { align: 'left' } },
    { accessorKey: 'cityView', header: 'City', meta: { align: 'left' } },
    { accessorKey: 'courseView', header: 'Course' },
    {
      accessorKey: 'leadType',
      meta: { align: 'center' },
      header: 'Lead Type',
      cell: ({ row }: any) => {
        const [selectedType, setSelectedType] = useState<LeadType>(row.original.leadType);
        const toastIdRef = useRef<string | number | null>(null);

        const handleDropdownChange = async (value: LeadType) => {
          if (row.original.leadType == LeadType.ACTIVE) {
            toast.info('Please refer to Active Leads page to change Active Lead Type');
            return;
          }

          setSelectedType(value);

          toastIdRef.current = toast.loading('Updating lead type...', {
            duration: Infinity
          });

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
            leadTypeModifiedDateView,
            phoneNumber,
            altPhoneNumber,
            ...cleanedRow
          } = row.original;

          const updatedData = {
            ...cleanedRow,
            leadType: value
          };

          try {
            const response: LeadData | null = await apiRequest(
              API_METHODS.PUT,
              API_ENDPOINTS.updateLead,
              updatedData
            );
            toast.dismiss(toastIdRef.current);

            if (response) {
              toast.success('Lead type updated successfully', {
                id: toastIdRef.current,
                duration: 1500
              });
              // setRefreshKey((prevKey) => prevKey + 1);
            } else {
              toast.error('Failed to update lead type', {
                id: toastIdRef.current,
                duration: 1500
              });
              setSelectedType(row.original.leadType);
            }
          } catch (error) {
            toast.error('Failed to update lead type', {
              id: toastIdRef.current,
              duration: 1500
            });
            setSelectedType(row.original.leadType);
          } finally {
            toastIdRef.current = null;
          }
        };

        return (
          <LeadTypeSelect
            disabled={row.original.leadType == LeadType.ACTIVE}
            value={selectedType}
            onChange={handleDropdownChange}
          />
        );
      }
    },

    {
      accessorKey: 'remarksView',
      header: 'Remarks',
      meta: { maxWidth: 130 }
    },

    {
      accessorKey: 'leadsFollowUpCount',
      header: 'Follow Ups',
      meta: { align: 'center' },
      cell: ({ row }: any) => {
        const [selectedValue, setSelectedValue] = useState(row.original.leadsFollowUpCount);
        const toastIdRef = useRef<string | number | null>(null);

        const handleDropdownChange = async (newValue: number) => {
          const previousValue = selectedValue;
          setSelectedValue(newValue);

          toastIdRef.current = toast.loading('Updating follow-up count...', {
            duration: Infinity
          });

          const filteredData = {
            ...row.original,
            leadsFollowUpCount: newValue
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
            leadTypeModifiedDateView,
            phoneNumber,
            altPhoneNumber,
            ...cleanedRow
          } = filteredData;

          try {
            const response: LeadData | null = await apiRequest(
              API_METHODS.PUT,
              API_ENDPOINTS.updateLead,
              cleanedRow
            );
            toast.dismiss(toastIdRef.current);
            if (response) {
              toast.success('Follow-up count updated successfully', {
                id: toastIdRef.current,
                duration: 3000
              });
              setRefreshKey((prevKey) => prevKey + 1);
            } else {
              toast.error('Failed to update follow-up count', {
                id: toastIdRef.current,
                duration: 1500
              });
              setSelectedValue(previousValue);
            }
          } catch (error) {
            toast.error('Failed to update follow-up count', {
              id: toastIdRef.current,
              duration: 1500
            });
            setSelectedValue(previousValue);
          } finally {
            toastIdRef.current = null;
          }
        };

        return (
          <Select
            value={selectedValue.toString()}
            onValueChange={(value) => handleDropdownChange(Number(value))}
          >
            <SelectTrigger className="w-[60px] mx-auto min-h-[unset] h-8 text-sm">
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
      }
    },

    { accessorKey: 'nextDueDateView', header: 'Next Due Date', meta: { align: 'center' } },
    ...(isRoleLeadMarketing
      ? [{ accessorKey: 'assignedToName', header: 'Assigned To', meta: { align: 'center' } }]
      : [])
    // { accessorKey: 'leadTypeModifiedDateView', header: 'Timestamp', meta: { align: 'center' } },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   meta: { align: 'center' },
    //   cell: ({ row }: any) => (
    //     <Button
    //       variant="ghost"
    //       className="cursor-pointer"
    //       onClick={() => {
    //         setSelectedRowId(row.id);
    //         handleViewMore({ ...row.original, leadType: row.original._leadType });
    //       }}
    //     >
    //       <span className="font-inter font-semibold text-[12px] text-primary">View More</span>
    //     </Button>
    //   )
    // },
  ];

  const marketingSourceQuery = useQuery({
    queryKey: ['marketingSources'],
    queryFn: marketingSourcesDropdown
  });
  const marketingSource = Array.isArray(marketingSourceQuery.data) ? marketingSourceQuery.data : [];

  const courseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: courseDropdown
  });
  const courses = Array.isArray(courseQuery.data) ? courseQuery.data : [];

  const getFiltersData = (): FilterData[] => {
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
        filterKey: 'leadType',
        label: 'Lead Status',
        placeholder: 'Lead Status',
        options: Object.values(LeadType),
        multiSelect: true
      },
      ...(isRoleLeadMarketing
        ? [
            {
              filterKey: 'assignedTo',
              label: 'Assigned To',
              options: assignedToDropdownData.map((item: any) => {
                return {
                  label: item.name,
                  id: item._id
                };
              }),
              placeholder: 'assignee',
              hasSearch: true,
              multiSelect: true
            }
          ]
        : [])
    ];
  };

  useEffect(() => {
    if (leads) {
      setTotalPages(leads.totalPages);
      setTotalEntries(leads.total);
    }
  }, [leads]);

  if (!leads?.leads || !analytics) {
    return <Loading />;
  }

  return (
    leads?.leads &&
    analytics && (
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
            tableName="All Leads"
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
            tableActionButton={<TableActionButton />}
            setSelectedRowId={setSelectedRowId}
            searchBarPlaceholder="Search student name or number"
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
              setIsDrawerOpen={setIsDrawerOpen}
              setSelectedRowId={setSelectedRowId}
              setRefreshKey={setRefreshKey}
              key={editRow._id}
              data={editRow}
            />
          )}
        </TechnoRightDrawer>
      </>
    )
  );
}

function TableActionButton() {
  const { hasRole } = useAuthStore();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [downloadOpen, setDownloadOpen] = useState(false);

  const uploadAction = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.uploadMarketingData, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.SUCCESS) {
        toast.success(data.MESSAGE || 'Marketing Data Uploaded Successfully');
        setUploadOpen(false);
      } else {
        throw new Error(data.ERROR || data.MESSAGE);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const downloadAction = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.downloadMarketingData, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.ERROR || errorData.MESSAGE || 'Download failed');
        } catch {
          throw new Error('Download failed');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Marketing Data Downloaded Successfully');
      setDownloadOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download failed');
    }
  };

  const isUploadDisabled = !hasRole(UserRoles.LEAD_MARKETING);
  const isDownloadDisabled =
    !hasRole(UserRoles.EMPLOYEE_MARKETING) && !hasRole(UserRoles.LEAD_MARKETING);

  return (
    <>
      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogTrigger asChild>
          <Button
            disabled={isUploadDisabled}
            variant="outline"
            className="h-8 w-[85px] rounded-[10px] border"
          >
            <LuUpload className="mr-1 h-4 w-4" />
            <span className="font-inter font-medium text-[12px]">Upload</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <FaCircleExclamation className="text-yellow-500 w-6 h-6" />
              Upload Marketing Data
            </DialogTitle>
            <DialogDescription className="my-3">
              Are you sure you want to upload marketing data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="font-inter text-sm">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={uploadAction} className="font-inter text-sm">
              Confirm Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
        <DialogTrigger asChild>
          <Button disabled={isDownloadDisabled} className="h-8 w-[103px] rounded-[10px] border">
            <LuDownload className="mr-1 h-4 w-4" />
            <span className="font-inter font-semibold text-[12px]">Download</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <FaCircleExclamation className="text-yellow-500 w-6 h-6" />
              Download Marketing Data
            </DialogTitle>
            <DialogDescription className="my-3">
              Are you sure you want to download marketing data?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="font-inter text-sm">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={downloadAction} className="font-inter text-sm">
              Confirm Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
