import React, { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminTrackerContext } from './admin-tracker-context';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import TechnoFiltersGroup from '../../custom-ui/filter/techno-filters-group';
import { AdminAnalyticsResponse } from './interfaces';
import logger from '@/lib/logger';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import { Locations } from '@/static/enum';

const AdminTracker = () => {
  const { filters } = useTechnoFilterContext();
  const { getAnalytics } = useAdminTrackerContext();
  const [appliedFilters, setAppliedFilters] = useState<any>()
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
    queryFn: fetchAssignedToDropdown,
  });
  const assignedToDropdownData = Array.isArray(assignedToQuery.data) ? assignedToQuery.data : []

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
              filterKey: 'assignedTo',
              options: assignedToDropdownData.map((item: any) => item.name || item._id || String(item)),
              hasSearch: true,
              multiSelect: true
            }
          ];
      };

  

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setAppliedFilters({ ...filters });
    setRefreshKey(prevKey => prevKey + 1);
  };

  const analyticsParams = {};
  
  

  const { data } = useQuery<AdminAnalyticsResponse['DATA']>({
    queryKey: ['analytics', analyticsParams, appliedFilters],
    queryFn: getAnalytics
  });

  if (!data) return <p className="text-center text-gray-500">No data available</p>;

  return <>
    <TechnoFiltersGroup filters={getFiltersData()} handleFilters={applyFilter} />  
    {JSON.stringify(data)}
  
  </>;
};

export default AdminTracker;
