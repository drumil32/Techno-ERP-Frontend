'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider, useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import { TechnoFilterProvider } from '../custom-ui/filter/filter-context';
import AdminTracker from './admin-tracker/admin-tracker';
import { AdminTrackerProvider } from './admin-tracker/admin-tracker-context';
import AllLeadsPage from './allLeads/all-leads-page';
import YellowLeadsTracker from './yellowLeads/yellow-leads-tracker';
import { useEffect } from 'react';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';

const HEADER_ITEMS = {
    ALL_LEADS: "All Leads",
    YELLOW_LEADS: "Yellow Leads",
    ADMIN_TRACKER: "Admin Tracker"
}

export default function CRMLayout() {
    return (
        <TopHeaderProvider>
            <TechnoFilterProvider>
                <AdminTrackerProvider>
                    <CRMContent />
                </AdminTrackerProvider>
            </TechnoFilterProvider>
        </TopHeaderProvider>
    );
}

function CRMContent() {
    const { setHeaderActiveItem } = useTopHeaderContext()
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setHeaderActiveItem(HEADER_ITEMS.ALL_LEADS);
        setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING)
    }, []);
    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb />
                <ContentRenderer />
            </div>
        </>
    );
}

function ContentRenderer() {
    const { headerActiveItem } = useTopHeaderContext();

    switch (headerActiveItem) {
        case HEADER_ITEMS.ALL_LEADS:
            return <AllLeadsPage />;
        case HEADER_ITEMS.YELLOW_LEADS:
            return <YellowLeadsTracker />;
        case HEADER_ITEMS.ADMIN_TRACKER:
            return <AdminTracker />;
        default:
            return <div>Default Page</div>;
    }

}
