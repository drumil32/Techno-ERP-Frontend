'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import React from 'react';

type AdvancedTechnoBreadcrumbItem = {
  title: string;
  route: string;
};

type AdvancedTechnoBreadcrumbProps = {
  items: AdvancedTechnoBreadcrumbItem[];
}

export default function AdvancedTechnoBreadcrumb({ items }: AdvancedTechnoBreadcrumbProps) {
  return (
    <Breadcrumb className="mt-[16px]">
      <BreadcrumbList className="text-lg flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-lg font-semibold text-gray-500 cursor-default">
                    {item.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.route}>
                    {item.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
