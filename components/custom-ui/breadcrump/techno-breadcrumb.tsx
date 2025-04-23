'use client';

import { SITE_MAP } from '@/common/constants/frontendRouting';
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
type BreadCrumbProps={
    rootUrl:string;
}
export default function TechnoBreadCrumb({rootUrl}:BreadCrumbProps) {
    const pathname = usePathname();

    const pathSegments = pathname.split('/').filter(Boolean);

    const findSidebarKey = () => {
        if (pathSegments.length < 2) return 'MARKETING';

        const currentPath = `/${pathSegments.slice(0, 2).join('/')}`;

        for (const [key, value] of Object.entries(SITE_MAP)) {
            const paths = Object.values(value);
            for (const path of paths) {
                if (currentPath === path || pathname.startsWith(path as string)) {
                    return key;
                }
            }
        }

        return 'MARKETING';
    };

    const sidebarKey = findSidebarKey();
    const sidebarTitle = SIDEBAR_ITEMS[sidebarKey as keyof typeof SIDEBAR_ITEMS] || 'Marketing';

    const generateBreadcrumbs = () => {
        const breadcrumbs = [];

        breadcrumbs.push(
            <BreadcrumbItem key="sidebar">
                <BreadcrumbLink href={rootUrl}>{sidebarTitle}</BreadcrumbLink>
            </BreadcrumbItem>
        );

        // Start from the third segment
        for (let i = 2; i < Math.min(pathSegments.length,3); i++) {
            const segment = pathSegments[i];
            const formattedSegment = segment
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (char) => char.toUpperCase());

            const href = `/${pathSegments.slice(0, i + 1).join('/')}`;
            const isLastItem = i === Math.min(pathSegments.length-1,2);

            breadcrumbs.push(
                <React.Fragment key={href}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {isLastItem ? (
                            <BreadcrumbPage className="text-primary font-bold">{formattedSegment}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={href}>{formattedSegment}</BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                </React.Fragment>
            );
        }

        return breadcrumbs;
    };

    return (
        <Breadcrumb className="mt-20">
            <BreadcrumbList className="text-lg flex items-center">
                {generateBreadcrumbs()}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
