'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TechnoFilterProvider } from '../custom-ui/filter/filter-context';
import { useEffect } from 'react';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';

interface HeaderItem {
  title: string;
  route: string;
  requiredRoles?: UserRoles[];
}

interface HeaderItems {
  [key: string]: HeaderItem;
}

const HEADER_ITEMS: HeaderItems = {
  ALL_LEADS: {
    title: 'All Leads',
    route: SITE_MAP.MARKETING.ALL_LEADS
  },
  ACTIVE_LEADS: {
    title: 'Active Leads',
    route: SITE_MAP.MARKETING.ACTIVE_LEADS
  },
  ADMIN_TRACKER: {
    title: 'Admin Tracker',
    route: SITE_MAP.MARKETING.ADMIN_TRACKER,
    requiredRoles: [UserRoles.ADMIN, UserRoles.LEAD_MARKETING]
  }
};

interface FilteredHeaders {
  [key: string]: {
    title: string;
    route: string;
  };
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const { setSidebarActiveItem } = useSidebarContext();
  const { hasRole } = useAuthStore();

  useEffect(() => {
    setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING);
  }, []);

  const filteredHeaders: FilteredHeaders = Object.entries(HEADER_ITEMS).reduce(
    (acc, [key, item]) => {
      if (
        !('requiredRoles' in item) ||
        (item.requiredRoles && item.requiredRoles.some((role) => hasRole(role)))
      ) {
        acc[key] = { title: item.title, route: item.route };
      }
      return acc;
    },
    {} as FilteredHeaders
  );

  return (
    <>
      <TechnoTopHeader headerItems={filteredHeaders} />
      <div className="flex flex-col px-4 gap-4">
        <TechnoBreadCrumb rootUrl="/c/marketing/all-leads" />
        <TechnoFilterProvider>{children}</TechnoFilterProvider>
      </div>
    </>
  );
}
