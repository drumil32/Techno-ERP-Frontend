'use client';

// React and Next.js imports
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Third-party library imports
import { useQuery } from '@tanstack/react-query';

// Local component imports
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoFiltersGroup from '../filter/techno-filters-group';
import FilterBadges from '@/components/layout/allLeads/components/filter-badges';

// Context and helper imports
import { useTechnoFilterContext } from '../filter/filter-context';
import { courseDropdown } from '@/components/layout/admin-tracker/helpers/fetch-data';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { FilterData, StudentListData, StudentListItem } from './helpers/interface';
import { columns } from './helpers/columns';

// Enum imports
import { CourseYear } from '@/types/enum';
import { fetchStudents } from './helpers/api';
import { refineStudents } from './helpers/refine-data';
import { Response } from '@/lib/apiClient';

export default function StudentRepositoryPage() {

  // State Management
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);


  // Refs
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

  // Hooks
  const router = useRouter();
  const { filters, updateFilter } = useTechnoFilterContext();

  // Course data query
  const courseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: courseDropdown
  });

  const courses = Array.isArray(courseQuery.data) ? courseQuery.data : [];

  // Handle Navigation to Single Student Page
  const handleViewMore = (row: StudentListItem) => {
    if (row && row._id) {
      router.push(SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(row._id, 'student-details'));
    }
  };

  // Handle Pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  // Handle Search with Debounce
  const handleSearch = (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  // Get Query Parameters for API Call
  const getQueryParams = () => {
    return {
      search: debouncedSearch
    };
  };

  // Filter Configuration
  const getFiltersData = (): FilterData[] => {
    return [
      {
        filterKey: 'course',
        label: 'Course',
        options: courses.map((item: string) => {
          return {
            label: item,
            id: item
          };
        }),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'courseYear',
        label: 'Course Year',
        options: Object.values(CourseYear),
        multiSelect: true
      },
      {
        filterKey: 'academicYear',
        label: 'Academic Year',
        options: [],
        multiSelect: true
      }
    ];
  };

  // Filter Actions
  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setPage(1);
    setAppliedFilters({ ...filters });
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const clearFilters = () => {
    getFiltersData().forEach((filter) => {
      if (filter?.filterKey === 'date' || filter?.isDateFilter) {
        //
        const dateKeys: string[] = []; // Add date keys here
        dateKeys.forEach((key) => updateFilter(key, undefined));
      } else {
        updateFilter(filter.filterKey, undefined);
      }
    });

    setAppliedFilters({});
    currentFiltersRef.current = {};
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey === 'date' || filterKey.includes('Date')) {
      const dateKeys: string[] = []; // Add date keys here

      dateKeys.forEach((key) => {
        delete updatedFilters[key];
        updateFilter(key, undefined);
      });
    } else {
      delete updatedFilters[filterKey];
      updateFilter(filterKey, undefined);
    }

    setAppliedFilters(updatedFilters);
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const filterParams = getQueryParams();

  const studentsQuery = useQuery({
    queryKey: ['students', filterParams],
    queryFn: fetchStudents,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    enabled: true
  });

  const studentsData: StudentListData = studentsQuery.data
    ? refineStudents(studentsQuery.data)
    : { students: [], pagination: { total: 0, page: 0, limit: 0, totalPages: 0 } };

  useEffect(() => {
    console.log('Students data:', studentsData);
      if (studentsData) {
        setTotalPages(studentsData.pagination.totalPages);
        setTotalEntries(studentsData.pagination.total);
      }
    }, [studentsData]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">All Students</h1>
      </div>

      <div>
        <TechnoFiltersGroup
          filters={getFiltersData()}
          handleFilters={applyFilter}
          clearFilters={clearFilters}
        />
      </div>

      {studentsData && (
        <TechnoDataTable
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          columns={columns}
          data={studentsData.students}
          tableName="Student Records"
          currentPage={page}
          totalPages={totalPages}
          pageLimit={limit}
          onSearch={handleSearch}
          searchTerm={search}
          showPagination={true}
          handleViewMore={handleViewMore}
        >
          <FilterBadges onFilterRemove={handleFilterRemove} appliedFilters={appliedFilters} />
        </TechnoDataTable>
      )}
    </div>
  );
}
