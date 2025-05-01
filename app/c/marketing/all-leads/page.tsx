import CRMLayout from '@/components/layout/crm-layout';
import AllLeadsPage from '@/components/layout/allLeads/all-leads-page';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import { Suspense } from 'react';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

export default function AllLeads() {
  return (
    <CRMLayout>
      <TechnoFilterProvider key="all-leads">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin h-8 w-8 text-primary" />
              <span className="ml-2">Loading leads...</span>
            </div>
          }
        >
          <AllLeadsPage />
        </Suspense>
      </TechnoFilterProvider>
    </CRMLayout>
  );
}
