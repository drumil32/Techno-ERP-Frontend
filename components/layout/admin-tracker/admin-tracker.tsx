'use client';

import Loading from '@/app/loading';
import TechnoAnalyticCardsGroup from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { FilterData } from '@/components/custom-ui/filter/type';
import TechnoPageTitle from '@/components/custom-ui/page-title/techno-page-title';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import FilterBadges from '../allLeads/components/filter-badges';
import { useAdminTrackerContext } from './admin-tracker-context';
import {
  cityDropdown,
  fetchAssignedToDropdown,
  marketingSourcesDropdown
} from './helpers/fetch-data';
import { refineAnalytics } from './helpers/refine-data';
import { AdminAnalyticsResponse } from './interfaces';
import { LeadConversionDashboard } from './leads-conversion-dashboard';
import { LeadTables } from './analytics-tables';
import { PerformanceDashboard } from './performance-dashboard';
import { Card } from '@/components/ui/card';
import AdminTrackerCardGroup, { CardItem } from './admin-tracker-cards-group';
import { useSidebarContext } from '@/components/custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
// import { FilterData } from '@/components/custom-ui/student-repository/helpers/interface';

const AdminTracker = () => {
  const { filters, updateFilter } = useTechnoFilterContext();
  const { getAnalytics } = useAdminTrackerContext();
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  // const [refreshKey, setRefreshKey] = useState(0);
  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);
  const authStore = useAuthStore();
  const isRoleLeadMarketing = authStore.hasRole(UserRoles.LEAD_MARKETING);
  const { setSidebarActiveItem } = useSidebarContext();
  const [data, setData] = useState()
  const [finalCampusConversion, setFinalCampusConversion] = useState <CardItem[] | undefined> (undefined)
  const [yellowLeadsVisited, setYellowLeadsVisited] = useState <CardItem[] | undefined> (undefined)
  const [yellowLeadsConverted, setYellowLeadsConverted] = useState<CardItem[] | undefined>(undefined)
  const [totalLeadsReached, setTotalLeadsReached] = useState<CardItem[] | undefined>(undefined)
  useEffect(() => {
    setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING)
  }, [])

  const getQueryParams = () => {
    const params: { [key: string]: any } = {
      ...(currentFiltersRef.current || {}),
      // refreshKey
    };

    return params;
  };
  const filterParams = getQueryParams();
  const assignedToQuery = useQuery({
    queryKey: ['assignedToDropdown', filterParams, appliedFilters],
    queryFn: fetchAssignedToDropdown
  });
  const marketingSourceQuery = useQuery({
    queryKey: ['marketingSources'],
    queryFn: marketingSourcesDropdown
  });
  const cityDropdownQuery = useQuery({
    queryKey: ['cities'],
    queryFn: cityDropdown
  });
  const cityDropdownData = Array.isArray(cityDropdownQuery.data) ? cityDropdownQuery.data : [];
  const assignedToDropdownData = Array.isArray(assignedToQuery.data) ? assignedToQuery.data : [];
  const marketingSource = Array.isArray(marketingSourceQuery.data) ? marketingSourceQuery.data : [];

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
      ...(isRoleLeadMarketing
        ? [
          {
            filterKey: 'assignedTo',
            label: 'Assigned To',
            placeholder: 'person',
            options: assignedToDropdownData.map((item: any) => {
              return {
                label: item.name,
                id: item._id
              };
            }),
            hasSearch: true,
            multiSelect: true
          }
        ]
        : [])
    ];
  };

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setAppliedFilters({ ...filters });
    // setRefreshKey((prevKey) => prevKey + 1);
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
    // setRefreshKey((prevKey) => prevKey + 1);
  };
  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = appliedFilters ? { ...appliedFilters } : {};

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
    // setRefreshKey((prevKey) => prevKey + 1);
  };

  
  useEffect(() => {
    async function fetchData() {
      const getdata = await getAnalytics()
      setData(getdata);
      
      const gettotalLeadsReached = refineAnalytics(
        {
          allLeads: getdata?.allLeadsAnalytics?.allLeads,
          reached: getdata?.allLeadsAnalytics?.reached,
          notReached: getdata?.allLeadsAnalytics?.notReached
        },
        'allLeads',
        {
          allLeads: 'All Leads',
          reached: 'Reached Leads',
          notReached: 'Not Reached'
        },
        {
          allLeads: 'text-black',
          reached: 'text-green-600',
          notReached: 'text-red-600'
        }
      );
    
      const getyellowLeadsConverted = refineAnalytics(
        {
          reached: getdata?.allLeadsAnalytics?.reached,
          white: getdata?.allLeadsAnalytics?.white,
          black: getdata?.allLeadsAnalytics?.black,
          invalidType: getdata?.allLeadsAnalytics?.invalidType,
          red: getdata?.allLeadsAnalytics?.red,
          blue: getdata?.allLeadsAnalytics?.blue,
          activeLeads: getdata?.allLeadsAnalytics?.activeLeads
        },
        'reached',
        {
          reached: 'Reached',
          white: 'Did Not Pick',
          black: 'Course NA',
          red: 'Dead Data',
          blue: 'Neutral Data',
          activeLeads: 'Active Data',
          invalidType: 'Invalid Data'
        },
        {
          reached: 'text-black',
          white: 'text-gray-500',
          black: 'text-black',
          red: 'text-red-600',
          blue: 'text-blue-600',
          orange: 'text-orange-600',
          activeLeads: 'text-green-600',
          invalidType: 'text-yellow-600'
        }
      );
    
      const getyellowLeadsVisited = refineAnalytics(
        {
          activeLeads: getdata?.allLeadsAnalytics?.activeLeads,
          footFall: getdata?.yellowLeadsAnalytics?.footFall,
          noFootFall: getdata?.yellowLeadsAnalytics?.noFootFall
        },
        'activeLeads',
        {
          activeLeads: 'Active Data',
          footFall: 'Footfall',
          noFootFall: 'No Footfall'
        },
        {
          activeLeads: 'text-black',
          footFall: 'text-[#E06C06]',
          noFootFall: 'text-[#A67B0A]'
        }
      );
    
      const getfinalCampusConversion = refineAnalytics(
        {
          footFall: getdata?.yellowLeadsAnalytics?.footFall,
          neutral: getdata?.yellowLeadsAnalytics?.neutral,
          dead: getdata?.yellowLeadsAnalytics?.dead,
          admissions: getdata?.yellowLeadsAnalytics?.admissions
        },
        'footFall',
        {
          footFall: 'Footfall',
          neutral: 'Neutral',
          dead: 'Dead Data',
          admissions: 'Admissions'
        },
        {
          footFall: 'text-[#000000]',
          neutral: 'text-[#006ED8]',
          dead: 'text-[#A67B0A]',
          admissions: 'text-[#0EA80E]'
        }
      );

      setTotalLeadsReached(gettotalLeadsReached)
      setYellowLeadsConverted(getyellowLeadsConverted)
      setYellowLeadsVisited(getyellowLeadsVisited)
      setFinalCampusConversion(getfinalCampusConversion)
    }
    fetchData();

  }, [appliedFilters])

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = assignedToQuery.isLoading || !data;
    const hasError = assignedToQuery.isError;
    const isSuccess = assignedToQuery.isSuccess && data;
    const isFetching = assignedToQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading admin tracker data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load admin tracker data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Admin tracker data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load admin tracker data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading admin tracker data...', {
        duration: Infinity
      });
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [
    // refreshKey,
    // assignedToQuery.isLoading,
    // assignedToQuery.isError,
    // assignedToQuery.isSuccess,
    // assignedToQuery.isFetching,
    data
  ]);

  if (!data) {
    return <Loading />;
  }

  return (
    data && (
      <>
        <TechnoPageTitle title="Admin Tracker" />

        {/* Filters Section */}

        <>
          <PerformanceDashboard />

          <LeadTables />

          <Card className="w-7xl mb-8">
            <div className="ml-5">
              <h2 className="text-2xl font-bold">Overall Leads Performance</h2>
              <p className="text-muted-foreground">
                Track and Visualize overall leads performance and filter your analytics with
                ease{' '}
              </p>
            </div>
            {/* Total Leads Reached Section */}
            <div className="ml-[32px] ">
              <TechnoFiltersGroup
                filters={getFiltersData()}
                handleFilters={applyFilter}
                clearFilters={clearFilters}
              />
            </div>
            <div className="ml-[32px] ">
              <FilterBadges
                onFilterRemove={handleFilterRemove}
                assignedToData={assignedToDropdownData}
                appliedFilters={appliedFilters}
              />
            </div>
            <div className="ml-[32px] mt-[32px]">
              <h1 className="font-inter font-semibold text-[20px] mb-2 text-[#4E4E4E]">
                Total number of leads reached
              </h1>
              {totalLeadsReached && <AdminTrackerCardGroup cardsData={totalLeadsReached} />}
            </div>

            {/* Active Leads Conversion Section */}
            <div className="ml-[32px] mt-[32px]">
              <h1 className="font-inter w-full font-semibold text-[20px] mb-2 text-[#4E4E4E]">
                How many leads were converted to Active Leads?
              </h1>
              {yellowLeadsConverted && <LeadConversionDashboard data={yellowLeadsConverted} />}
            </div>
            {/* Active Leads Campus Visit Section */}
            <div className="ml-[32px] mt-[32px]">
              <h1 className="font-inter font-semibold text-[20px] mb-2 text-[#4E4E4E]">
                How many Active leads visited the campus?
              </h1>
              {yellowLeadsVisited && <AdminTrackerCardGroup cardsData={yellowLeadsVisited} />}
            </div>

            {/* Final Campus Conversion Section */}
            <div className="ml-[32px] mt-[32px] mb-[68px]">
              <h1 className="font-inter font-semibold text-[20px] mb-2 text-[#4E4E4E]">
                Lead Type from those who visited the campus
              </h1>
              {finalCampusConversion && <AdminTrackerCardGroup cardsData={finalCampusConversion} />}
            </div>
          </Card>
        </>
      </>
    )
  );
};

export default AdminTracker;
