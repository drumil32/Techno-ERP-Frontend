import { TechnoFilterProvider } from '@/components/custom-ui/filter/filter-context';
import CRMLayout from '@/components/layout/crm-layout';
import YellowLeadsTracker from '@/components/layout/yellowLeads/yellow-leads-tracker';
import RoleGuard from '@/guards/role-guard';
import { UserRoles } from '@/types/enum';

export default function YellowLeads() {
  return (
    <CRMLayout>
      <TechnoFilterProvider key="yellow-leads" sectionKey="yellow-leads">
        <YellowLeadsTracker />
      </TechnoFilterProvider>
    </CRMLayout>
  );
}
