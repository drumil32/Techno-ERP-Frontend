'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useSidebarContext } from '../sidebar/sidebar-context';
import { useTopHeaderContext } from '../top-header/top-header-context';

export default function TechnoBreadCrumb() {
  const { sidebarActiveItem } = useSidebarContext();
  const { headerActiveItem } = useTopHeaderContext();

  return (
    <Breadcrumb className="mt-20">
      <BreadcrumbList className="text-lg">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{sidebarActiveItem}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="text-primary">{headerActiveItem}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
