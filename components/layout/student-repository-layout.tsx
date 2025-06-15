'use client';

import TechnoTopHeader from '@/components/custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '@/components/custom-ui/breadcrump/techno-breadcrumb';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import useAuthStore from '@/stores/auth-store';
import { useEffect } from 'react';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { UserRoles } from '@/types/enum';

const HEADER_ITEMS = {
    ALL_STUDENTS: { title: "All Students", route: SITE_MAP.STUDENT_REPOSITORY.DEFAULT }
}

export default function StudentRepositoryLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />

            <div className="flex flex-col px-4 gap-6">
                <TechnoBreadCrumb rootUrl='/c/student-repository' />

                <div className="">
                    {children}
                </div>
            </div>
        </>
    );
}