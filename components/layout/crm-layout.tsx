'use client';

import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider, useTopHeaderContext } from '../custom-ui/top-header/top-header-context';
import TechnoPageTitle from '../custom-ui/page-title/techno-page-title';
import { TechnoFilterProvider } from '../custom-ui/filter/filter-context';
import AdminTracker from './admin-tracker/admin-tracker';
import { AdminTrackerProvider } from './admin-tracker/admin-tracker-context';
import AllLeadsPage from './allLeads/all-leads-page';
import YellowLeadsTracker from './yellowLeads/yellow-leads-tracker';

const headerItem = [{ title: 'All Leads' }, { title: 'Yellow Leads' }, { title: 'Admin Tracker' }];

export default function CRMLayout() {
  return (
    <TopHeaderProvider>
      <CRMContent />
    </TopHeaderProvider>
  );
}

function CRMContent() {
  return (
    <>
      <TechnoTopHeader headerItems={headerItem} />
      <div className="flex flex-col px-4 gap-4">
        <TechnoBreadCrumb />
        <ContentRenderer />
      </div>
    </>
  );
}

function ContentRenderer() {
  const { headerActiveItem } = useTopHeaderContext();

  switch (headerActiveItem) {
    case 'All Leads':
      return (
        <TechnoFilterProvider key="all-leads">
          <AllLeadsPage />
        </TechnoFilterProvider>
      );
    case 'Yellow Leads':
      return (
        <TechnoFilterProvider key="yellow-leads">
          <YellowLeadsTracker />
        </TechnoFilterProvider>
      );
    case 'Admin Tracker':
      return (
        <TechnoFilterProvider key="admin-tracker">
          <AdminTrackerProvider key="admin-tracker">
            <AdminTracker />
          </AdminTrackerProvider>
        </TechnoFilterProvider>
      );
    default:
      return <div>Default Page</div>;
  }
}
