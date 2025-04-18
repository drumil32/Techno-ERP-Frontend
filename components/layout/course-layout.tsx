'use client';


import { SITE_MAP } from "@/common/constants/frontendRouting";
import { useSidebarContext } from "../custom-ui/sidebar/sidebar-context";
import { SIDEBAR_ITEMS } from "@/common/constants/sidebarItems";
import { useEffect } from "react";
import TechnoTopHeader from "../custom-ui/top-header/techno-top-header";
import TechnoBreadCrumb from "../custom-ui/breadcrump/techno-breadcrumb";
import { useTopHeaderContext } from "../custom-ui/top-header/top-header-context";
import { TechnoFilterProvider } from "../custom-ui/filter/filter-context";

const HEADER_ITEMS = {
    COURSES : { title : 'Courses' , route: SITE_MAP.COURSE.DEFAULT},
    SUBJECTS : { title : 'Subjects', route: SITE_MAP.COURSE.SUBJECTS }
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
    const { setHeaderActiveItem } = useTopHeaderContext()
    const { setSidebarActiveItem } = useSidebarContext()
    useEffect(() => {
        setHeaderActiveItem(HEADER_ITEMS.COURSES.title);
        setSidebarActiveItem(SIDEBAR_ITEMS.COURSE)
    }, []);
    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb />
                <TechnoFilterProvider>
                    {children}
                </TechnoFilterProvider>
            </div>
        </>
    );
}