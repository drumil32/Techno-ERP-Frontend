'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SectionSkeleton = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border rounded-2xl shadow-sm p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-40" /> {/* Simulate section title */}
      <Skeleton className="h-4 w-6" /> {/* Simulate toggle icon */}
    </div>
    {children}
  </div>
);

const EnquiryFormSkeleton = () => {
  return (
    <div className="p-8 space-y-8 w-full">
      {/* Student Details Skeleton */}
      <SectionSkeleton title="Student Details">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </SectionSkeleton>

      {/* Address Details Skeleton */}
      <SectionSkeleton title="Address Details">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </SectionSkeleton>

      {/* Academic Details Skeleton */}
      <SectionSkeleton title="Academic Details">
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="grid grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </SectionSkeleton>

      {/* Filled By College Section Skeleton */}
      <SectionSkeleton title="Filled By College">
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </SectionSkeleton>

      {/* Confirmation Checkbox Skeleton */}
      <SectionSkeleton title="Confirmation">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </SectionSkeleton>
    </div>
  );
};

export default EnquiryFormSkeleton;
