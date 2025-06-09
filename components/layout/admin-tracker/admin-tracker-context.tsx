'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useTechnoFilterContext } from '../../custom-ui/filter/filter-context';
import { AdminTrackerContextType } from './interfaces';
import { apiRequest } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';

const AdminTrackerContext = createContext<AdminTrackerContextType | null>(null);

export function AdminTrackerProvider({ children }: { children: ReactNode }) {
  const { filters } = useTechnoFilterContext();

  const getAnalytics = async () => {

    const transformedValues = {
      startDate: filters?.startDate,
      endDate: filters?.endDate,
      city: filters?.city,
      course: filters?.course,
      lead: filters?.lead,
      source: filters?.source,
      assignedTo: filters?.assignedTo
    };

    const response = await apiRequest(
      API_METHODS.POST,
      API_ENDPOINTS.getAdminAnalytics,
      transformedValues
    );

    console.log("get response ", response)
    return response;
  };

  return (
    <AdminTrackerContext.Provider value={{ getAnalytics }}>{children}</AdminTrackerContext.Provider>
  );
}

export function useAdminTrackerContext() {
  const context = useContext(AdminTrackerContext);
  if (!context) {
    throw new Error('useAdminTrackerContext must be used within a AdminTrackerProvider');
  }
  return context;
}
