import CRMLayout from '@/components/layout/crm-layout';
import AllLeadsPage from '@/components/layout/allLeads/all-leads-page';
import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

export default function AllLeads() {
  return (
    <CRMLayout>
      <TechnoFilterProvider key="all-leads">
        <AllLeadsPage />
      </TechnoFilterProvider>
    </CRMLayout>
  );
}
