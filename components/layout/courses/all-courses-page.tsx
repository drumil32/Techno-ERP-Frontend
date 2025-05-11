'use client';

import { Button } from '../../ui/button';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from './helpers/fetch-data';
import { toast } from 'sonner';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { useTechnoFilterContext } from '@/components/custom-ui/filter/filter-context';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';
import TechnoFiltersGroup from '@/components/custom-ui/filter/techno-filters-group';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { CreateCourseDialog } from '@/components/custom-ui/create-dialog/create-course-dialog';
import TechnoDataTableAdvanced from '@/components/custom-ui/data-table/techno-data-table-advanced';
import FilterBadges from '../allLeads/components/filter-badges';

export interface Course {
  courseName: string;
  courseCode: string;
  courseId: string;
  semesterId: string;
  semesterNumber: number;
  courseYear: string;
  academicYear: string;
  departmentName: string;
  departmentHOD: string;
  numberOfSubjects: number;
}

interface Pagination {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CourseApiResponse {
  courseInformation: Course[];
  pagination: Pagination;
}


export default function AllCoursesPage() {
  const router = useRouter();
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewMore = (row: any) => {
    console.log("Inside handle view more!");
    console.log("Row is : ", row);
    console.log("Course ID : ", row.courseId);
    console.log("Semester ID : ", row.semesterId);
    const { courseCode, courseId, semesterId } = row;
    //DTODO : Here this will redirect to other page.
    const redirectionPath = `${SITE_MAP.ACADEMICS.COURSES}/${courseCode}?crsi=${courseId}&si=${semesterId}`
    router.push(redirectionPath);
  };


  const { filters, updateFilter } = useTechnoFilterContext();

  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setPage(1);
    console.log("Filters are : ", filters);
    setAppliedFilters({ ...filters });
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const clearFilters = () => {
    console.log("Applied filters are : ", appliedFilters);
    currentFiltersRef.current = {};
    setPage(1);
    setRefreshKey(prevKey => prevKey + 1);

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
    } 
    else {
      delete updatedFilters[filterKey];
      updateFilter(filterKey, undefined);
    }

    setAppliedFilters(updatedFilters);
    setPage(1);
    setRefreshKey((prevKey) => prevKey + 1);
  };


  const handleSearch = (value: string) => {
    setSearch(value);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const academicYearList = generateAcademicYearDropdown();
    const currentAcademicYear = academicYearList[5];
    updateFilter('academicYear', currentAcademicYear);
  }, []);
  
  useEffect(() => {
    if (filters.academicYear) {
      setFiltersReady(true);
    }
  }, [filters.academicYear]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const courseQuery = useQuery({
    queryKey: ['courses', appliedFilters, debouncedSearch],
    queryFn: fetchCourses,
    placeholderData: (previousData) => previousData,
    enabled: filtersReady,
  });        

  const courseResponse: CourseApiResponse = courseQuery.data as CourseApiResponse;
  console.log(courseResponse)
  const courses = courseResponse?.courseInformation || [];
  const coursesWithSerialNo = courses.map((course, index) => ({
    ...course,
    serialNo: (page - 1) * limit + index + 1,
  }));

  const pagination = courseResponse?.pagination;

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = courseQuery.isLoading || courseQuery.isLoading;
    const hasError = courseQuery.isError || courseQuery.isError;
    const isSuccess = courseQuery.isSuccess && courseQuery.isSuccess;
    const isFetching = courseQuery.isFetching || courseQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading course data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load course data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Course data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load course data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading course data...', {
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
    courseQuery.isLoading,
    courseQuery.isError,
    courseQuery.isSuccess,
    courseQuery.isFetching,
  ]);

  const columns = [
    { accessorKey: 'serialNo', header: 'S. No' },
    // { accessorKey: 'id', header: 'S. No' },
    { accessorKey: 'courseName', header: 'Course Name' },
    { accessorKey: 'courseCode', header: 'Course Code' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'semesterNumber', header: 'Semester' },
    { accessorKey: 'departmentName', header: 'Department' },
    { accessorKey: 'departmentHOD', header: 'HOD' },
    { accessorKey: 'academicYear', header: 'Academic Year' },
    { accessorKey: 'numberOfSubjects', header: 'No of Subjects' },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => handleViewMore(row.original)}
        >
          <span className="font-inter font-semibold text-[12px] text-primary">View More</span>
        </Button>
      ),
    },
  ];

  const getFiltersData = () => {
    const academicYearOptions: FilterOption[] = generateAcademicYearDropdown().map((year: string) => ({
      label: year,
      id: year
    }));

    return [
      {
        filterKey: 'academicYear',
        label: 'Academic Year',
        options: academicYearOptions,
        placeholder: 'Academic Year',
        hasSearch: true,
        multiSelect: false
      }
    ];
  };


  useEffect(() => {
    if (courses.length > 0) {
      setTotalPages(pagination.totalPages);
      setTotalEntries(pagination.totalItems);
    }
  }, [courses]);

  return (
    <>
      <TechnoPageHeading title={"All Courses"} />

      <span>
        <div className='flex justify-between'>
          <TechnoFiltersGroup
            filters={getFiltersData()}
            handleFilters={applyFilter}
            clearFilters={clearFilters}
            clearFiltersVisible = {false}
          />
          
          <CreateCourseDialog />
        </div>
      </span>


      <TechnoDataTableAdvanced
        columns={columns}
        data={coursesWithSerialNo}
        tableName="Course List"
        currentPage={page}
        totalPages={totalPages}
        pageLimit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        searchTerm={search}
        minVisibleRows={13}
        maxVisibleRows = {10}
        totalEntries={totalEntries}
        handleViewMore={handleViewMore}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
      >
         <FilterBadges
            onFilterRemove={handleFilterRemove}
            appliedFilters={appliedFilters}
            crossVisible = {false}
          />
      </TechnoDataTableAdvanced>
    </>
  );
}
