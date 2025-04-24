'use client';

import TechnoTopHeader from '@/components/custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '@/components/custom-ui/breadcrump/techno-breadcrumb';
import { useTopHeaderContext } from '@/components/custom-ui/top-header/top-header-context';
import { useEffect } from 'react';
import { useSidebarContext } from '@/components/custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { usePathname } from 'next/navigation';
import { ADMISSION_STEPS } from '@/common/constants/admissionSteps';
import { AdmissionStepper } from '@/components/custom-ui/stepper/admission-stepper';

const HEADER_ITEMS = {
    APPLICATION_PROCESS: { title: "Application Process", route: SITE_MAP.ADMISSIONS.DEFAULT }
}

export default function AdmissionFormLayout({ children }: { children: React.ReactNode }) {
    const { setHeaderActiveItem } = useTopHeaderContext();
    const { setSidebarActiveItem } = useSidebarContext();
    const pathname = usePathname();

    const pathSegments = pathname.split('/');
    const currentStepPath = pathSegments.find(segment => ADMISSION_STEPS.some(step => step.path === segment));

    useEffect(() => {
        setHeaderActiveItem(HEADER_ITEMS.APPLICATION_PROCESS.title);
        setSidebarActiveItem(SIDEBAR_ITEMS.ADMISSIONS);
    }, [setHeaderActiveItem, setSidebarActiveItem]);

    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />

            <div className="flex flex-col px-4 py-4 gap-6">
                <TechnoBreadCrumb rootUrl='/c/admissions' />

                <div className='flex items-center'>
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                        Admission Application Process
                    </h1>

                    <div className="w-2/4 mb-6 px-4 md:px-8 lg:px-16">
                        <AdmissionStepper steps={ADMISSION_STEPS} currentStepPath={currentStepPath} />
                    </div>
                </div>

                <div className="">
                    {children}
                </div>
            </div>
        </>
    );
}