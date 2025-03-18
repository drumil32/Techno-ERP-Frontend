import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminTrackerContext } from './admin-tracker-context';
import { useTechnoFilterContext } from '../filter/filter-context';
import TechnoFiltersGroup from '../filter/techno-filters-group';
import { AdminAnalyticsResponse } from './interfaces';
import logger from '@/lib/logger';

const AdminTracker = () => {
  const { filters } = useTechnoFilterContext();
  const { getAnalytics } = useAdminTrackerContext();

  const [filtersData, setFiltersData] = useState([
    {
      filterKey: 'date',
      isDateFilter: true
    },
    {
      filterKey: 'location',
      options: [],
      hasSearch: true,
      multiSelect: true
    },
    {
      filterKey: 'assignedTo',
      options: [],
      hasSearch: true,
      multiSelect: true
    }
  ]);

  const applyFilter = () => {
      logger.info('Applying filter', filters);
  };

  const { data } = useQuery<AdminAnalyticsResponse['data']>({
    queryKey: ['analytics', filters],
    queryFn: getAnalytics
  });

  if (!data) return <p className="text-center text-gray-500">No data available</p>;

  return <>
    <TechnoFiltersGroup filters={filtersData} handleFilters={applyFilter} />  
    {JSON.stringify(data)}
  
  </>;
};

export default AdminTracker;
