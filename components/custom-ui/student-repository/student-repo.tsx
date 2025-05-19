'use client';

// React and Next.js imports
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// Third-party library imports
import { useQuery } from '@tanstack/react-query';

// Local component imports
import TechnoFiltersGroup from '../filter/techno-filters-group';
import FilterBadges from '@/components/layout/allLeads/components/filter-badges';

// Context and helper imports
import { useTechnoFilterContext } from '../filter/filter-context';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { FilterData, FilterOption, StudentListData, StudentListItem } from './helpers/interface';

// Enum imports
import { courseDropdown, fetchStudents } from './helpers/api';
import { refineStudents } from './helpers/refine-data';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';
import { getCurrentAcademicYear } from '@/lib/getCurrentAcademicYear';
import { toast } from 'sonner';
import { columns, YearMap } from './helpers/constants';
import TechnoDataTableAdvanced from '../data-table/techno-data-table-advanced';

interface Course {
  courseCode: string;
  courseName: string;
}

export default function StudentRepositoryPage() {
  // State Management
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  // Refs
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

  // Hooks
  const router = useRouter();
  const { filters, updateFilter } = useTechnoFilterContext();

  // Course Dropdown
  const coursesDropdownQuery = useQuery({
    queryKey: ['courses'],
    queryFn: courseDropdown,
    placeholderData: (previousData) => previousData,
    enabled: true
  });

  const courses: Course[] = Array.isArray(coursesDropdownQuery.data)
    ? coursesDropdownQuery.data
    : [];

  // Handle Navigation to Single Student Page
  const handleViewMore = (row: StudentListItem) => {
    if (row && row._id && row.universityId) {
      router.push(
        SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(row.universityId, 'student-details', row._id)
      );
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
    const params: { [key: string]: any } = {
      page,
      limit,
      academicYear: getCurrentAcademicYear(),
      search: debouncedSearch,
      ...appliedFilters,
      refreshKey
    };

    return params;
  };

  // Filter Configuration
  const getFilterConfigurations = (): FilterData[] => {
    const academicYearOptions: FilterOption[] = generateAcademicYearDropdown(0, 1).map(
      (year: string) => ({
        label: year,
        id: year
      })
    );

    return [
      {
        filterKey: 'courseCode',
        label: 'Course',
        options: courses.map((item: Course) => {
          return {
            label: item.courseName,
            id: item.courseCode
          };
        }),
        hasSearch: true,
        multiSelect: false
      },
      {
        filterKey: 'courseYear',
        label: 'Course Year',
        options: YearMap,
        hasSearch: true,
        multiSelect: false
      },
      {
        filterKey: 'academicYear',
        label: 'Academic Year',
        options: academicYearOptions,
        hasSearch: true,
        multiSelect: false
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
    currentFiltersRef.current = {};
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);

    updateFilter('course', undefined);
    updateFilter('courseYear', undefined);

    const academicYearList = generateAcademicYearDropdown();
    const currentAcademicYear = academicYearList[5];
    updateFilter('academicYear', currentAcademicYear);
  };

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey == 'academicYear') {
      const academicYearList = generateAcademicYearDropdown();
      const currentAcademicYear = academicYearList[5];
      updateFilter('academicYear', currentAcademicYear);
    } else {
      delete updatedFilters[filterKey];
      updateFilter(filterKey, undefined);
    }

    setAppliedFilters(updatedFilters);
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const filterParams = getQueryParams();

  // ---

  const studentListQuery = useQuery({
    queryKey: ['students', appliedFilters, debouncedSearch, filterParams],
    queryFn: () => fetchStudents(filterParams),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    enabled: true
  });

  const studentsData: StudentListData = studentListQuery.data
    ? refineStudents(studentListQuery.data)
    : { students: [], pagination: { total: 0, page: 0, limit: 0, totalPages: 0 } };

  useEffect(() => {
    if (studentsData) {
      setTotalPages(studentsData.pagination.totalPages);
      setTotalEntries(studentsData.pagination.total);
    }
  }, [studentsData]);

  useEffect(() => {
    const academicYearList = generateAcademicYearDropdown();
    const currentAcademicYear = academicYearList[5];
    updateFilter('academicYear', currentAcademicYear);
  }, []);

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = coursesDropdownQuery.isLoading || studentListQuery.isLoading;
    const hasError = coursesDropdownQuery.isError || studentListQuery.isError;
    const isSuccess = coursesDropdownQuery.isSuccess && studentListQuery.isSuccess;
    const isFetching = coursesDropdownQuery.isFetching || studentListQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading Students data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load students data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Students data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load students data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading students data...', {
        duration: Infinity
      });
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [
    refreshKey,
    studentListQuery.isLoading,
    studentListQuery.isError,
    studentListQuery.isSuccess,
    studentListQuery.isFetching
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">All Students</h1>
      </div>

      <TechnoFiltersGroup
        filters={getFilterConfigurations()}
        handleFilters={applyFilter}
        clearFilters={clearFilters}
        clearFiltersVisible={false}
      />

      {studentsData && (
        <TechnoDataTableAdvanced
          columns={columns}
          data={studentsData.students}
          tableName={`Student Records` + ` (${studentsData.students.length})`}
          currentPage={page}
          totalPages={totalPages}
          pageLimit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearch={handleSearch}
          searchTerm={search}
          minVisibleRows={13}
          maxVisibleRows={10}
          totalEntries={totalEntries}
          handleViewMore={handleViewMore}
          selectedRowId={selectedRowId}
          setSelectedRowId={setSelectedRowId}
          rowHeight={50}
        >
          <FilterBadges onFilterRemove={handleFilterRemove} appliedFilters={appliedFilters} />
        </TechnoDataTableAdvanced>
      )}
    </div>
  );
}
