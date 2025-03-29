'use client';

import { ROUTE_MAP } from '@/common/constants/frontendRouting';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function TechnoBreadCrumb() {
    const pathname = usePathname();
    
    // Extract relevant path segments (e.g., "/c/crm/all-leads/details" → ["crm", "all-leads", "details"])
    const pathSegments = pathname.split('/').filter(Boolean);

    // Determine the sidebar section
    const sidebarKey = Object.keys(ROUTE_MAP).find((key) =>
        ROUTE_MAP[key as keyof typeof ROUTE_MAP].includes(pathSegments[1]) // Match second segment as section
    );
    const sidebarTitle = sidebarKey ? SIDEBAR_ITEMS[sidebarKey as keyof typeof SIDEBAR_ITEMS] : 'Dashboard';

    return (
        <Breadcrumb className="my-4">
            <BreadcrumbList className="text-lg flex items-center">
                {/* First breadcrumb - Sidebar Section */}
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">{sidebarTitle}</BreadcrumbLink>
                </BreadcrumbItem>

                {/* Dynamic Breadcrumbs for remaining path segments */}
                {pathSegments.slice(2).map((segment, index) => {
                    const formattedSegment = segment
                        .replace(/-/g, ' ') // Convert kebab-case
                        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize words
                    
                    const href = `/${pathSegments.slice(0, index + 2).join('/')}`; // Generate URL for breadcrumb link

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {index === pathSegments.length - 3 ? (
                                    <BreadcrumbPage className="text-primary font-bold">{formattedSegment}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
