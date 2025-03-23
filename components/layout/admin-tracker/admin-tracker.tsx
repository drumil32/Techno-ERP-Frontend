import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminTrackerContext } from './admin-tracker-context';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import { AdminAnalyticsResponse } from './interfaces';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import { Locations } from '@/static/enum';
import TechnoAnalyticCardsGroup, {
  CardItem
} from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { refineAnalytics } from './helpers/refine-data';

const AdminTracker = () => {
  const { filters } = useTechnoFilterContext();
  const { getAnalytics } = useAdminTrackerContext();
  const [appliedFilters, setAppliedFilters] = useState<any>();
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
        label:'Date',
        isDateFilter: true
      },
      {
        filterKey: 'location',
        label:'Location',
        options: Object.values(Locations),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'assignedTo',
        label:'Assigned To',
        options: assignedToDropdownData.map((item: any) => item.name || item._id || String(item)),
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

  if (!data) return <p className="text-center text-gray-500">No data available</p>;

  return (
    <>
      {/* Filters Section */}
      <TechnoFiltersGroup filters={getFiltersData()} handleFilters={applyFilter} />

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
      <div className="mt-[32px]">
      <h1 className="font-inter font-semibold text-[16px] mb-2 text-[#4E4E4E]">
        Final conversion from those who visited the campus
      </h1>
      {finalCampusConversion && <TechnoAnalyticCardsGroup cardsData={finalCampusConversion} />}
      </div>
    </>
  );
};

export default AdminTracker;
