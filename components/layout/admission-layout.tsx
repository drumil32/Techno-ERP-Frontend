'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider, useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import { useEffect } from 'react';
import AdmissionsLandingPage from './admissions/admission-page';
import { useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';

const HEADER_ITEMS = {
    APPLICATION_PROCESS: {title:"Application Process", route: SITE_MAP.ADMISSIONS.DEFAULT}
}

export default function AdmissionLayout() {
    return (
        <TopHeaderProvider>
            <AdmissionContent />
        </TopHeaderProvider>
    );
}

function AdmissionContent() {
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
                <TechnoBreadCrumb />
                <ContentRenderer />
            </div>
        </>
    );
}

function ContentRenderer() {
    const { headerActiveItem } = useTopHeaderContext();

    switch (headerActiveItem) {
        case HEADER_ITEMS.APPLICATION_PROCESS.title:
            return <AdmissionsLandingPage />;
        default:
            return <div>Default Page</div>;
    }
}
