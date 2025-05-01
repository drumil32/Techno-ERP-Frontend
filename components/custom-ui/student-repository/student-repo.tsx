'use client';

// Import statements categorized by type

// React and Next.js imports
import { useRef, useState } from 'react';
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
import { FilterData, StudentRepoRow } from './helpers/interface';
import { columns } from './helpers/columns';

// Enum imports
import { CourseYear } from '@/types/enum';

export default function StudentRepositoryPage() {

  // State Management
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);

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
  const handleViewMore = (row: StudentRepoRow) => {
    if (row && row.id) {
      router.push(SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(row.studentID, 'student-details'));
    }
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

  // const studentsQuery = useQuery({
  //   queryKey: ['students', filterParams],
  //   queryFn: fetchStudentsData,
  //   placeholderData: (previousData) => previousData,
  //   refetchOnWindowFocus: false,
  //   enabled: true
  // });

  // const studentsData = admissionsQuery.data ? refineAdmissions(admissionsQuery.data) : [];

  const studentsData = [
    {
      id: 1,
      studentID: 'STU12345',
      studentName: 'John Doe',
      studentPhoneNumber: '1234567890',
      fatherName: 'John Doe Sr.',
      fatherPhoneNumber: '0987654321',
      course: 'Computer Science',
      courseYear: 'First',
      semester: '01',
      academicYear: '2023-24'
    },
    {
      id: 2,
      studentID: 'STU12346',
      studentName: 'Jane Smith',
      studentPhoneNumber: '2345678901',
      fatherName: 'James Smith',
      fatherPhoneNumber: '9876543210',
      course: 'Information Technology',
      courseYear: 'Second',
      semester: '03',
      academicYear: '2023-24'
    },
    {
      id: 3,
      studentID: 'STU12347',
      studentName: 'Alice Johnson',
      studentPhoneNumber: '3456789012',
      fatherName: 'Robert Johnson',
      fatherPhoneNumber: '8765432109',
      course: 'Electronics',
      courseYear: 'Third',
      semester: '05',
      academicYear: '2023-24'
    },
    {
      id: 4,
      studentID: 'STU12348',
      studentName: 'Bob Brown',
      studentPhoneNumber: '4567890123',
      fatherName: 'Michael Brown',
      fatherPhoneNumber: '7654321098',
      course: 'Mechanical Engineering',
      courseYear: 'Fourth',
      semester: '07',
      academicYear: '2023-24'
    },
    {
      id: 5,
      studentID: 'STU12349',
      studentName: 'Charlie Davis',
      studentPhoneNumber: '5678901234',
      fatherName: 'David Davis',
      fatherPhoneNumber: '6543210987',
      course: 'Civil Engineering',
      courseYear: 'Fifth',
      semester: '09',
      academicYear: '2023-24'
    },
    {
      id: 6,
      studentID: 'STU12350',
      studentName: 'Eve Wilson',
      studentPhoneNumber: '6789012345',
      fatherName: 'William Wilson',
      fatherPhoneNumber: '5432109876',
      course: 'Biotechnology',
      courseYear: 'First',
      semester: '01',
      academicYear: '2023-24'
    },
    {
      id: 7,
      studentID: 'STU12351',
      studentName: 'Frank Miller',
      studentPhoneNumber: '7890123456',
      fatherName: 'George Miller',
      fatherPhoneNumber: '4321098765',
      course: 'Physics',
      courseYear: 'Second',
      semester: '03',
      academicYear: '2023-24'
    },
    {
      id: 8,
      studentID: 'STU12352',
      studentName: 'Grace Lee',
      studentPhoneNumber: '8901234567',
      fatherName: 'Henry Lee',
      fatherPhoneNumber: '3210987654',
      course: 'Chemistry',
      courseYear: 'Third',
      semester: '05',
      academicYear: '2023-24'
    },
    {
      id: 9,
      studentID: 'STU12353',
      studentName: 'Hannah Taylor',
      studentPhoneNumber: '9012345678',
      fatherName: 'Charles Taylor',
      fatherPhoneNumber: '2109876543',
      course: 'Mathematics',
      courseYear: 'Fourth',
      semester: '07',
      academicYear: '2023-24'
    },
    {
      id: 10,
      studentID: 'STU12354',
      studentName: 'Isaac Anderson',
      studentPhoneNumber: '0123456789',
      fatherName: 'Paul Anderson',
      fatherPhoneNumber: '1098765432',
      course: 'Statistics',
      courseYear: 'Fifth',
      semester: '09',
      academicYear: '2023-24'
    },
    {
      id: 11,
      studentID: 'STU12355',
      studentName: 'Jack Thomas',
      studentPhoneNumber: '1234567890',
      fatherName: 'Daniel Thomas',
      fatherPhoneNumber: '0987654321',
      course: 'Economics',
      courseYear: 'First',
      semester: '01',
      academicYear: '2023-24'
    },
    {
      id: 12,
      studentID: 'STU12356',
      studentName: 'Kathy Jackson',
      studentPhoneNumber: '2345678901',
      fatherName: 'Matthew Jackson',
      fatherPhoneNumber: '9876543210',
      course: 'History',
      courseYear: 'Second',
      semester: '03',
      academicYear: '2023-24'
    },
    {
      id: 13,
      studentID: 'STU12357',
      studentName: 'Liam White',
      studentPhoneNumber: '3456789012',
      fatherName: 'Christopher White',
      fatherPhoneNumber: '8765432109',
      course: 'Geography',
      courseYear: 'Third',
      semester: '05',
      academicYear: '2023-24'
    },
    {
      id: 14,
      studentID: 'STU12358',
      studentName: 'Mia Harris',
      studentPhoneNumber: '4567890123',
      fatherName: 'Andrew Harris',
      fatherPhoneNumber: '7654321098',
      course: 'Political Science',
      courseYear: 'Fourth',
      semester: '07',
      academicYear: '2023-24'
    },
    {
      id: 15,
      studentID: 'STU12359',
      studentName: 'Noah Martin',
      studentPhoneNumber: '5678901234',
      fatherName: 'Joshua Martin',
      fatherPhoneNumber: '6543210987',
      course: '',
      courseYear: 'Fifth',
      semester: '09',
      academicYear: '2023-24'
    },
    {
      id: 16,
      studentID: 'STU12360',
      studentName: 'Olivia Thompson',
      studentPhoneNumber: '6789012345',
      fatherName: 'David Thompson',
      fatherPhoneNumber: '5432109876',
      course: 'Philosophy',
      courseYear: 'First',
      semester: '01',
      academicYear: '2023-24'
    }
  ];

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
          data={studentsData}
          tableName="Student Records"
          currentPage={1}
          totalPages={1}
          pageLimit={10}
          onSearch={handleSearch}
          searchTerm={search}
          showPagination={false}
          handleViewMore={handleViewMore}
        >
          <FilterBadges onFilterRemove={handleFilterRemove} appliedFilters={appliedFilters} />
        </TechnoDataTable>
      )}
    </div>
  );
}
