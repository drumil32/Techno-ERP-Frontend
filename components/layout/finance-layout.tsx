'use client'

import { SITE_MAP } from "@/common/constants/frontendRouting";
import { useSidebarContext } from "../custom-ui/sidebar/sidebar-context";
import { useEffect } from "react";
import { SIDEBAR_ITEMS } from "@/common/constants/sidebarItems";
import TechnoTopHeader from "../custom-ui/top-header/techno-top-header";
import { FilteredHeaders, HeaderItems } from "./crm-layout";
import { UserRoles } from "@/types/enum";
import useAuthStore from "@/stores/auth-store";

const HEADER_ITEMS: HeaderItems = {
    STUDENT_DUES: {
        title: 'Student Dues',
        route: SITE_MAP.FINANCE.STUDENT_DUES
    },
    COURSE_DUES: {
        title: 'Course Dues',
        route: SITE_MAP.FINANCE.COURSE_DUES
    },
    ADMIN_TRACKER: {
        title: 'Admin Tracker',
        route: SITE_MAP.FINANCE.ADMIN_TRACKER,
        requiredRoles: [UserRoles.ADMIN]
    },
}

export function FinanceLayout({ children }: { children: React.ReactNode }) {

    const { hasRole } = useAuthStore();

    const filteredHeaders: FilteredHeaders = Object.entries(HEADER_ITEMS).reduce(
        (acc, [key, item]) => {
            if (
                !('requiredRoles' in item) ||
                (item.requiredRoles && item.requiredRoles.some((role) => hasRole(role)))
            ) {
                acc[key] = { title: item.title, route: item.route };
            }
            return acc;
        },
        {} as FilteredHeaders
    );

    return (
        <>
            <TechnoTopHeader headerItems={filteredHeaders} />
            <div className="flex flex-col px-4 gap-4">
                {children}
            </div>
        </>
    )
}
