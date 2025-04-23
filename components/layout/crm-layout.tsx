'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TechnoFilterProvider } from '../custom-ui/filter/filter-context';
import { useEffect } from 'react';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { SITE_MAP } from '@/common/constants/frontendRouting';

const HEADER_ITEMS = {
    ALL_LEADS: { title: "All Leads", route: SITE_MAP.MARKETING.ALL_LEADS },
    ACTIVE_LEADS: { title: "Active Leads", route: SITE_MAP.MARKETING.ACTIVE_LEADS },
    ADMIN_TRACKER: { title: "Admin Tracker", route: SITE_MAP.MARKETING.ADMIN_TRACKER }
};


export default function CRMLayout({ children }: { children: React.ReactNode }) {
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING)
    }, []);
    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb rootUrl='/c/marketing/all-leads' />
                <TechnoFilterProvider>
                    {children}
                </TechnoFilterProvider>
            </div>
        </>
    );
}
