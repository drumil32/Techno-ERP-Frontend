import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminTrackerContext } from './admin-tracker-context';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import { AdminAnalyticsResponse } from './interfaces';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import { Locations, MarketingSources } from '@/static/enum';
import TechnoAnalyticCardsGroup, {
  CardItem
} from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { refineAnalytics } from './helpers/refine-data';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import { toast } from 'sonner';
import FilterBadges from '../allLeads/components/filter-badges';
const AdminTracker = () => {
  const { filters, updateFilter } = useTechnoFilterContext();
  const { getAnalytics } = useAdminTrackerContext();
  const [appliedFilters, setAppliedFilters] = useState<any>({}); 
  const [refreshKey, setRefreshKey] = useState(0);
  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);
  const getQueryParams = () => {
    const params: { [key: string]: any } = {
      ...(currentFiltersRef.current || {}),
      refreshKey
    };

    return params;
  };
  const filterParams = getQueryParams();
  const assignedToQuery = useQuery({
    queryKey: ['assignedToDropdown', filterParams, appliedFilters],
    queryFn: fetchAssignedToDropdown
  });
  const assignedToDropdownData = Array.isArray(assignedToQuery.data) ? assignedToQuery.data : [];

  const getFiltersData = () => {
    return [
      {
        filterKey: 'date',
        label: 'Date',
        isDateFilter: true
      },
      {
        filterKey: 'source',
        label: 'Source',
        options: Object.values(MarketingSources),
        multiSelect: true
      },
      {
        filterKey: 'location',
        label: 'Location',
        options: Object.values(Locations),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'assignedTo',
        label: 'Assigned To',
        options: assignedToDropdownData.map((item: any) => {
          return {
            label: item.name,
            id: item._id
          }
        }) as FilterOption[],
        hasSearch: true,
        multiSelect: true
      }
    ];
  };

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setAppliedFilters({ ...filters });
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const clearFilters = () => {
    currentFiltersRef.current = {};
    setAppliedFilters({});
    setRefreshKey((prevKey) => prevKey + 1);
  }
  
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
    setRefreshKey(prevKey => prevKey + 1);
};

  const analyticsParams = {};

  const { data } = useQuery<AdminAnalyticsResponse['DATA']>({
    queryKey: ['analytics', analyticsParams, appliedFilters],
    queryFn: getAnalytics
  });

  const totalLeadsReached = refineAnalytics(
    {
      allLeads: data?.allLeadsAnalytics?.allLeads,
      reached: data?.allLeadsAnalytics?.reached,
      notReached: data?.allLeadsAnalytics?.notReached
    },
    'allLeads',
    {
      allLeads: 'Total Leads',
      reached: 'Reached Leads',
      notReached: 'Not Reached'
    },
    {
      allLeads: 'text-black',
      reached: 'text-green-600',
      notReached: 'text-red-600'
    }
  );

  

  const yellowLeadsConverted = refineAnalytics(
    {
      reached: data?.allLeadsAnalytics?.reached,
      white: data?.allLeadsAnalytics?.white,
      black: data?.allLeadsAnalytics?.black,
      red: data?.allLeadsAnalytics?.red,
      blue: data?.allLeadsAnalytics?.blue,
      yellow: data?.allLeadsAnalytics?.yellow
    },
    'reached',
    {
      reached: 'Reached Leads',
      white: 'White Leads',
      black: 'Black Leads',
      red: 'Red Leads',
      blue: 'Blue Leads',
      yellow: 'Yellow Leads'
    },
    {
      reached: 'text-black',
      white: 'text-gray-500',
      black: 'text-black',
      red: 'text-red-600',
      blue: 'text-blue-600',
      yellow: 'text-yellow-600'
    }
  );

  const yellowLeadsVisited = refineAnalytics(
    {
      yellow: data?.allLeadsAnalytics?.yellow,
      campusVisit: data?.yellowLeadsAnalytics?.campusVisit,
      noCampusVisit: data?.yellowLeadsAnalytics?.noCampusVisit
    },
    'yellow',
    {
      yellow: 'Yellow Leads',
      campusVisit: 'Campus Visit',
      noCampusVisit: 'No Campus Visit'
    },
    {
      yellow: 'text-yellow-600',
      campusVisit: 'text-green-600',
      noCampusVisit: 'text-red-600'
    }
  );

  const finalCampusConversion = refineAnalytics(
    {
      campusVisit: data?.yellowLeadsAnalytics?.campusVisit,
      unconfirmed: data?.yellowLeadsAnalytics?.unconfirmed,
      declined: data?.yellowLeadsAnalytics?.declined,
      finalConversion: data?.yellowLeadsAnalytics?.finalConversion
    },
    'campusVisit',
    {
      campusVisit: 'Campus Visit',
      unconfirmed: 'Unconfirmed',
      declined: 'Declined',
      finalConversion: 'Final Conversion'
    },
    {
      campusVisit: 'text-black',
      unconfirmed: 'text-orange-600',
      declined: 'text-red-600',
      finalConversion: 'text-green-600'
    }
  );

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
        setTimeout(() => { toastIdRef.current = null }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Admin tracker data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    }
    else if (hasError) {
      toastIdRef.current = toast.error('Failed to load admin tracker data', {
        duration: 3000
      });
    }
    else if (isLoading || isFetching) {
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
    refreshKey,
    assignedToQuery.isLoading,
    assignedToQuery.isError,
    assignedToQuery.isSuccess,
    assignedToQuery.isFetching,
    data
  ]);

  if (!data) return <p className="text-center text-gray-500">No data available</p>;

  return (
    <>
      {/* Filters Section */}
      <TechnoFiltersGroup filters={getFiltersData()} handleFilters={applyFilter} clearFilters={clearFilters} />
      <FilterBadges
        onFilterRemove={handleFilterRemove}
        assignedToData={assignedToDropdownData}
        appliedFilters={appliedFilters}
      />

      {/* Total Leads Reached Section */}
      <div className="mt-[32px]">
        <h1 className="font-inter font-semibold text-[16px] mb-2 text-[#4E4E4E]">
          Total number of leads reached
        </h1>
        {totalLeadsReached && <TechnoAnalyticCardsGroup cardsData={totalLeadsReached} />}
      </div>

      {/* Yellow Leads Conversion Section */}
      <div className="mt-[32px]">
        <h1 className="font-inter font-semibold text-[16px] mb-2 text-[#4E4E4E]">
          How many leads were converted to Yellow Leads?
        </h1>
        {yellowLeadsConverted && <TechnoAnalyticCardsGroup cardsData={yellowLeadsConverted} />}
      </div>

      {/* Yellow Leads Campus Visit Section */}
      <div className="mt-[32px]">
        <h1 className="font-inter font-semibold text-[16px] mb-2 text-[#4E4E4E]">
          How many Yellow leads visited the campus?
        </h1>
        {yellowLeadsVisited && <TechnoAnalyticCardsGroup cardsData={yellowLeadsVisited} />}
      </div>

      {/* Final Campus Conversion Section */}
      <div className="mt-[32px] mb-[68px]">
        <h1 className="font-inter font-semibold text-[16px] mb-2 text-[#4E4E4E]">
          Final conversion from those who visited the campus
        </h1>
        {finalCampusConversion && <TechnoAnalyticCardsGroup cardsData={finalCampusConversion} />}
      </div>
    </>
  );
};

export default AdminTracker;
