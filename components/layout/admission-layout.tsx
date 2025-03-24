'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider, useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import TechnoPageTitle from '../custom-ui/page-title/techno-page-title';
import { useEffect } from 'react';
import AdmissionsLandingPage from './admissions/admission-page';

const headerItem = [{ title: 'Application Process' }];

export default function AdmissionLayout() {
    return (
        <TopHeaderProvider>
            <AdmissionContent />
        </TopHeaderProvider>
    );
}

function AdmissionContent() {
    const { setHeaderActiveItem } = useTopHeaderContext()
    useEffect(() => {
        setHeaderActiveItem(headerItem[0].title);
    }, []);
    return (
        <>
            <TechnoTopHeader headerItems={headerItem} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb />
                <TechnoPageTitle />
                <ContentRenderer />
            </div>
        </>
    );
}

function ContentRenderer() {
    const { headerActiveItem } = useTopHeaderContext();

    switch (headerActiveItem) {
        case 'Application Process':
            return <AdmissionsLandingPage/>;
        default:
            return <div>Default Page</div>;
    }
}
