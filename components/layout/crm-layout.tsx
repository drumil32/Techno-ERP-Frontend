'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider, useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import { TechnoFilterProvider } from '../custom-ui/filter/filter-context';
import { useEffect } from 'react';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';

const HEADER_ITEMS = {
    ALL_LEADS: { title: "All Leads", route: "/c/crm/all-leads" },
    YELLOW_LEADS: { title: "Yellow Leads", route: "/c/crm/yellow-leads" },
    ADMIN_TRACKER: { title: "Admin Tracker", route: "/c/crm/admin-tracker" }
};


export default function CRMLayout({ children }: { children: React.ReactNode }) {
    const { setHeaderActiveItem } = useTopHeaderContext()
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setHeaderActiveItem(HEADER_ITEMS.ALL_LEADS.title);
        setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING)
    }, []);
    return (
        <TopHeaderProvider>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb />
                <TechnoFilterProvider>
                    {children}
                </TechnoFilterProvider>
            </div>
        </TopHeaderProvider>
    );
}

