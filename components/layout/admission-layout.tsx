'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import { useEffect } from 'react';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import Loading from '@/app/loading';
import CourseBreadCrumb from '../custom-ui/breadcrump/course-breadcrumb';
import PremiumBreadCrumb from '../custom-ui/breadcrump/premium-breadcrumb';
import useAuthStore from '@/stores/auth-store';
import { FilteredHeaders, HeaderItems } from './crm-layout';
import { UserRoles } from '@/types/enum';

const HEADER_ITEMS: HeaderItems = {
  APPLICATION_PROCESS: {
    title: 'Application Process',
    route: SITE_MAP.ADMISSIONS.DEFAULT
  },
  RECENT_ADMISSIONS: {
    title: 'Recent Admissions',
    route: SITE_MAP.ADMISSIONS.RECENT_ADMISSIONS
  },
  ADMIN_TRACKER: {
    title: 'Admin Tracker',
    route: SITE_MAP.ADMISSIONS.ADMIN_TRACKER,
    requiredRoles: [UserRoles.ADMIN]
  }
};

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  const { hasRole } = useAuthStore();

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
        <PremiumBreadCrumb rootUrl={SITE_MAP.ADMISSIONS.DEFAULT} />
        {children}
      </div>
    </>
  );
}
