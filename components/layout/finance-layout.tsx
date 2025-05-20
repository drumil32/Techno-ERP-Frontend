'use client'

import { SITE_MAP } from "@/common/constants/frontendRouting";
import { useSidebarContext } from "../custom-ui/sidebar/sidebar-context";
import { useEffect } from "react";
import { SIDEBAR_ITEMS } from "@/common/constants/sidebarItems";
import TechnoTopHeader from "../custom-ui/top-header/techno-top-header";

const HEADER_ITEMS = {
    STUDENT_DUES: { title: 'Student Dues', route: SITE_MAP.FINANCE.STUDENT_DUES },
    COURSE_DUES: { title: 'Course Dues', route: SITE_MAP.FINANCE.COURSE_DUES },
    ADMIN_TRACKER: { title: 'Admin Tracker', route: SITE_MAP.FINANCE.ADMIN_TRACKER },
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
                {children}
            </div>
        </>
    )
}
