'use client';

import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { API_METHODS } from '@/common/constants/apiMethods';
import AppLayout from '@/components/layout/app-layout';
import { apiRequest } from '@/lib/apiClient';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const checkAuthentication = async () => {
      await apiRequest(API_METHODS.GET, API_ENDPOINTS.isAuthenticated);
    };
    checkAuthentication();
  }, []);

  return <AppLayout />;
}
