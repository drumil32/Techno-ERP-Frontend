'use client'

import { SITE_MAP } from "@/common/constants/frontendRouting";
import { useSidebarContext } from "../custom-ui/sidebar/sidebar-context";
import { useEffect } from "react";
import { SIDEBAR_ITEMS } from "@/common/constants/sidebarItems";
import TechnoTopHeader from "../custom-ui/top-header/techno-top-header";
import CourseBreadCrumb from "../custom-ui/breadcrump/course-breadcrumb";
import TechnoBreadCrumb from "../custom-ui/breadcrump/techno-breadcrumb";

const HEADER_ITEMS = {
    STUDENT_DUES: { title: 'Student Dues', route: SITE_MAP.FINANCE.STUDENT_DUES },
    COURSE_DUES: { title: 'Course Dues', route: SITE_MAP.FINANCE.COURSE_DUES },
    OVERALL_DUES: { title: 'Overall Dues', route: SITE_MAP.FINANCE.OVERALL_DUES },
}

export function FinanceLayout({ children }: { children: React.ReactNode }) {
    const { setSidebarActiveItem } = useSidebarContext();
    useEffect(() => {
        setSidebarActiveItem(SIDEBAR_ITEMS.FINANCE)
    }, [])

    return (
        <>
            <TechnoTopHeader headerItems={HEADER_ITEMS} />
            <div className="flex flex-col px-4 gap-4">
                <TechnoBreadCrumb />
                {children}
            </div>
        </>
    )
}