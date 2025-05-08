'use client';

import { SITE_MAP } from "@/common/constants/frontendRouting";
import { useSidebarContext } from "../custom-ui/sidebar/sidebar-context";
import { SIDEBAR_ITEMS } from "@/common/constants/sidebarItems";
import { useEffect } from "react";
import TechnoTopHeader from "../custom-ui/top-header/techno-top-header";
import { TechnoFilterProvider } from "../custom-ui/filter/filter-context";
import CourseBreadCrumb from "../custom-ui/breadcrump/course-breadcrumb";

const HEADER_ITEMS = {
    COURSES : { title : 'Courses' , route: SITE_MAP.ACADEMICS.DEFAULT},
    SUBJECTS : { title : 'Subjects', route: SITE_MAP.ACADEMICS.SUBJECTS }
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setSidebarActiveItem(SIDEBAR_ITEMS.ACADEMICS)
    }, []);
    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <CourseBreadCrumb rootUrl={SITE_MAP.ACADEMICS.DEFAULT} />
                <TechnoFilterProvider>
                    {children}
                </TechnoFilterProvider>
            </div>
        </>
    );
}