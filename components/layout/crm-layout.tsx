'use client';

import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import { Button } from '@/components/ui/button';
import TechnoTopHeader from '../custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '../custom-ui/breadcrump/techno-breadcrumb';
import { TopHeaderProvider } from '../custom-ui/top-header/top-header-context';
import TechnoPageTitle from '../custom-ui/page-title/techno-page-title';
import TechnoAnalyticCardsGroup from '../custom-ui/analytic-card/techno-analytic-cards-group';
import TechnoFiltersGroup from '../custom-ui/filter/techno-filters-group';
import { TechnoFilterProvider, useTechnoFilterContext } from '../custom-ui/filter/filter-context';

const columns = [
  { accessorKey: 'id', header: 'Serial No.' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
  { accessorKey: 'gender', header: 'Gender' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: any) => (
      <Button onClick={() => console.log('View More:', row.original)}>View More</Button>
    )
  }
];

const data = [
  { id: '1', date: '2024-03-15', phoneNumber: '1234567890', gender: 'Male' },
  { id: '2', date: '2024-03-16', phoneNumber: '9876543210', gender: 'Female' }
];

const headerItem = [{ title: 'All Leads' }, { title: 'Yellow Leads' }, { title: 'Admin Tracker' }];

const cardData = [
  { number: 120, percentage: '15% increase', title: 'Total Leads', color: 'text-blue-500' },
  { number: 80, percentage: '10% decrease', title: 'Closed Deals', color: 'text-red-500' },
  { number: 45, percentage: '5% increase', title: 'New Prospects', color: 'text-green-500' },
  { number: 30, percentage: 'Stable', title: 'Follow-ups', color: 'text-yellow-500' }
];

const filtersData = [
  {
    filterKey: 'date',
    isDateFilter: true
  },
  {
    filterKey: 'location',
    options: ['New York', 'San Francisco', 'Los Angeles', 'Chicago'],
    hasSearch: true,
    multiSelect: true
  },
  {
    filterKey: 'course',
    options: ['Math', 'Science', 'History', 'Art'],
    hasSearch: true,
    multiSelect: true
  },
  {
    filterKey: 'lead',
    options: ['Lead 1', 'Lead 2', 'Lead 3'],
    multiSelect: true
  },
  {
    filterKey: 'assignedTo',
    options: ['Agent A', 'Agent B', 'Agent C'],
    hasSearch: true,
    multiSelect: true
  }
];

export default function CRMLayout() {
  return (
    <TopHeaderProvider>
      <TechnoFilterProvider>
        <CRMContent />
      </TechnoFilterProvider>
    </TopHeaderProvider>
  );
}

function CRMContent() {
  const { filters } = useTechnoFilterContext();
  const applyFilter = () => {
    console.log(filters);
  };
  return (
    <>
      <TechnoTopHeader headerItems={headerItem} />
      <div className="flex flex-col px-4 gap-4">
        <TechnoBreadCrumb />
        <TechnoPageTitle />
        <TechnoFiltersGroup filters={filtersData} handleFilters={applyFilter} />
        <TechnoAnalyticCardsGroup cardsData={cardData} />
        <TechnoDataTable columns={columns} data={data} tableName="User Records" />
      </div>
    </>
  );
}
