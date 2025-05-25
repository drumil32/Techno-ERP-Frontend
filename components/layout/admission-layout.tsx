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

const HEADER_ITEMS = {
  APPLICATION_PROCESS: { title: 'Application Process', route: SITE_MAP.ADMISSIONS.DEFAULT },
  RECENT_ADMISSIONS: { title: 'Recent Admissions', route: SITE_MAP.ADMISSIONS.RECENT_ADMISSIONS },
  ADMIN_TRACKER: { title: 'Admin Tracker', route: SITE_MAP.ADMISSIONS.ADMIN_TRACKER }
};

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TechnoTopHeader headerItems={HEADER_ITEMS} />
      <div className="flex flex-col px-4 gap-4">
        <PremiumBreadCrumb rootUrl={SITE_MAP.ADMISSIONS.DEFAULT} />
        {children}
      </div>
    </>
  );
}
