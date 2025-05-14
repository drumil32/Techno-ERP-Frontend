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

type BreadCrumbProps = {
  rootUrl?: string;
};

export default function PremiumBreadCrumb({ rootUrl }: BreadCrumbProps) {
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
  // awesome logic for implementation
  const isLinkActive = (href: string) => {
    const allSitePaths = Object.values(SITE_MAP).flatMap((group) => Object.values(group).flat());
    return allSitePaths.some((path) => path === href);
  };

  const sidebarKey = findSidebarKey();
  const sidebarTitle = SIDEBAR_ITEMS[sidebarKey as keyof typeof SIDEBAR_ITEMS] || 'Marketing';

  const generateBreadcrumbs = () => {
    const breadcrumbs = [];

    breadcrumbs.push(
      <BreadcrumbItem key="sidebar">
        <BreadcrumbLink
          href={rootUrl}
          className="transition-colors hover:text-primary/80 text-primary/90"
        >
          {sidebarTitle}
        </BreadcrumbLink>
      </BreadcrumbItem>
    );

    for (let i = 2; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const formattedSegment = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

      const href = `/${pathSegments.slice(0, i + 1).join('/')}`;
      const isLastItem = i === pathSegments.length - 1;
      const isActiveLink = isLinkActive(href);

      breadcrumbs.push(
        <React.Fragment key={href}>
          <BreadcrumbSeparator className="text-muted-foreground/50" />
          <BreadcrumbItem>
            {isLastItem ? (
              <BreadcrumbPage className="text-primary font-semibold">
                {formattedSegment}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href={isActiveLink ? href : undefined}
                className={`transition-colors ${isActiveLink ? 'hover:text-primary/80 text-primary/70' : 'text-muted-foreground cursor-default'}`}
              >
                {formattedSegment}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      );
    }

    return breadcrumbs;
  };

  return (
    <Breadcrumb className="mt-4">
      <BreadcrumbList className="text-[18px] flex items-center">
        {generateBreadcrumbs()}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
