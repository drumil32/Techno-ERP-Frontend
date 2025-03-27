'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider, useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import { TechnoFilterProvider } from '../custom-ui/filter/filter-context';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';

const HEADER_ITEMS = {
    ALL_LEADS: "All Leads",
    YELLOW_LEADS: "Yellow Leads",
    ADMIN_TRACKER: "Admin Tracker"
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    const { setHeaderActiveItem } = useTopHeaderContext()
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setHeaderActiveItem(HEADER_ITEMS.ALL_LEADS);
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


// function CRMContent() {
//     const { setHeaderActiveItem } = useTopHeaderContext()
//     const { setSidebarActiveItem } = useSidebarContext()
//     useEffect(() => {
//         setHeaderActiveItem(HEADER_ITEMS.ALL_LEADS);
//         setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING)
//     }, []);
//     return (
//         <>
//             <TechnoTopHeader headerItems={HEADER_ITEMS} />
//             <div className="flex flex-col px-4 gap-4">
//                 <TechnoBreadCrumb />
//                 <ContentRenderer />
//             </div>
//         </>
//     );
// }

// function ContentRenderer() {
//     const { headerActiveItem } = useTopHeaderContext();

//     switch (headerActiveItem) {
//         case HEADER_ITEMS.ALL_LEADS:
//             return (
//                 <TechnoFilterProvider key="all-leads">
//                     <AllLeadsPage />
//                 </TechnoFilterProvider>
//             );
//         case HEADER_ITEMS.YELLOW_LEADS:
//             return (
//                 <TechnoFilterProvider key="yellow-leads">
//                     <YellowLeadsTracker />
//                 </TechnoFilterProvider>
//             );
//         case HEADER_ITEMS.ADMIN_TRACKER:
//             return (
//                 <TechnoFilterProvider key="admin-tracker">
//                 <AdminTrackerProvider key="admin-tracker">
//                     <AdminTracker />
//                 </AdminTrackerProvider>
//                 </TechnoFilterProvider>

//             );
//         default:
//             return <div>Default Page</div>;
//     }
// }