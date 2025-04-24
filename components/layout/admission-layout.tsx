'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import { useEffect } from 'react';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';

const HEADER_ITEMS = {
    APPLICATION_PROCESS: { title: "Application Process", route: SITE_MAP.ADMISSIONS.DEFAULT }
}

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
    const { setHeaderActiveItem } = useTopHeaderContext()
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setHeaderActiveItem(HEADER_ITEMS.APPLICATION_PROCESS.title);
        setSidebarActiveItem(SIDEBAR_ITEMS.ADMISSIONS)
    }, []);
    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb rootUrl='/c/admissions' />
                {children}
            </div>
        </>
    );
}

