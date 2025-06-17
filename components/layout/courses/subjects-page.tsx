'use client';

import { useTechnoFilterContext } from '@/components/custom-ui/filter/filter-context';
import { FilterOption } from '@/components/custom-ui/filter/techno-filter';
import TechnoFiltersGroup from '@/components/custom-ui/filter/techno-filters-group';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import {
  fetchFilteredSubjects,
  fetchUniqueCourses
} from './helpers/fetch-data';
import TechnoDataTableAdvanced from '@/components/custom-ui/data-table/techno-data-table-advanced';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { useRouter } from 'next/navigation';
import FilterBadges from '../allLeads/components/filter-badges';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface UniqueCourseInformation {
  courseCode: string;
  courseName: string;
}

interface Subjects {
  serialNo?: number;
  courseId: string;
  semesterId: string;
  subjectId: string;
  instructorId: string;
  departmentMetaDataId: string;
  subjectName: string;
  subjectCode: string;
  instructor: string;
  courseName: string;
  courseCode: string;
  courseYear: string;
  semester: number;
  academicYear: string;
}

export const AllSubjectsPage = () => {
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const routerNav = useRouter();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewMore = (row: Subjects) => {
    const redirectionPath = `${SITE_MAP.ACADEMICS.COURSES}/${row.courseName}/${row.subjectCode}?crsi=${row.courseId}&si=${row.semesterId}&subi=${row.subjectId}&ii=${row.instructorId}`;
    routerNav.push(redirectionPath);
  };

  const { filters, updateFilter } = useTechnoFilterContext();

  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

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

    updateFilter('courseCode', undefined);
    updateFilter('semester', undefined);

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

  const subjectQuery = useQuery({
    queryKey: ['subjects', appliedFilters, debouncedSearch],
    queryFn: fetchFilteredSubjects,
    placeholderData: (previousData) => previousData,
    enabled: filtersReady,
  });

  const uniqueCourseQuery = useQuery({
    queryKey: ['unique-courses'],
    queryFn: fetchUniqueCourses,
    placeholderData: (previousData) => previousData,
    enabled: true
  });

  let uniqueCourses = (uniqueCourseQuery.data as UniqueCourseInformation[]) || [];

  const subjectResponse: Subjects[] = subjectQuery.data as Subjects[];
  let subjects = subjectResponse || [];

  subjects.forEach((subject, index) => {
    subject.serialNo = index + 1;
  });

  // const pagination = courseResponse?.pagination;

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = subjectQuery.isLoading || subjectQuery.isLoading;
    const hasError = subjectQuery.isError || subjectQuery.isError;
    const isSuccess = subjectQuery.isSuccess && subjectQuery.isSuccess;
    const isFetching = subjectQuery.isFetching || subjectQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading subject data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load subject data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Subject data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load subject data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading subject data...', {
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
    subjectQuery.isLoading,
    subjectQuery.isError,
    subjectQuery.isSuccess,
    subjectQuery.isFetching
  ]);

  const columns = [
    { accessorKey: 'serialNo', header: 'S. No' },
    { accessorKey: 'subjectName', header: 'Subject Name' },
    { accessorKey: 'subjectCode', header: 'Subject Code' },
    { accessorKey: 'instructor', header: 'Instructor' },
    { accessorKey: 'courseName', header: 'Course Name' },
    { accessorKey: 'courseCode', header: 'Course Code' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'semester', header: 'Semester' },
    { accessorKey: 'academicYear', header: 'Academic Year' },
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
      )
    }
  ];

  const getFiltersData = () => {
    // const coursesOptions = [ "CName", "updatecourse", "BTECH", "MTECH", "ATECH", "CTECH"]

    const courseOptions: FilterOption[] = uniqueCourses.map((course: UniqueCourseInformation) => ({
      // label: `${course.courseCode} - ${course.courseName}`,
      label: `${course.courseCode}`,
      id: `${course.courseCode}`
    }));

    const semesterOptions = Array.from({ length: 12 }, (_, i) => ({
      label: `${i + 1}`,
      id: `${i + 1}`
    }));

    const academicYearOptions: FilterOption[] = generateAcademicYearDropdown(0,1).map(
      (year: string) => ({
        label: year,
        id: year
      })
    );

    return [
      {
        filterKey: 'academicYear',
        label: 'Academic Year',
        options: academicYearOptions,
        placeholder: 'Academic Year',
        hasSearch: true,
        multiSelect: false
      },
      {
        filterKey: 'courseCode',
        label: 'Course Code',
        options: courseOptions,
        placeholder: 'Courses',
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'semester',
        label: 'Semester',
        options: semesterOptions,
        placeholder: 'Semester',
        hasSearch: true,
        multiSelect: true
      }
    ];
  };

  return (
    <>
      <TechnoPageHeading title={'All Subjects'} />

      <div className="flex flex-col md:flex-row items-center justify-between">
        <TechnoFiltersGroup
          filters={getFiltersData()}
          handleFilters={applyFilter}
          clearFilters={clearFilters}
        />

        <Tooltip >
          <TooltipTrigger className=" flex items-center cursor-pointer">
            <span className="text-sm text-[#5B31D1]">Want to add a subject?&nbsp;</span>
            <InfoIcon className="w-5 h-5 text-[#5B31D1]" />
          </TooltipTrigger>
          <TooltipContent className="bg-white text-black shadow-md m-2">
            <span className="text-sm text-[#A1A1A1]">
              <b className='m-[2px]'>Steps to add a subject</b>
              <p className='m-[2px]'>Step 1 - Go to Courses tab </p>
              <p className='m-[2px]'>Step 2 - Select the Course</p>
              <p className='m-[2px]'>Step 3 - Click on Add Subject</p>
            </span>
          </TooltipContent>
        </Tooltip>
      </div>

      <TechnoDataTableAdvanced
        columns={columns}
        data={subjects}
        tableName="Subjects List"
        currentPage={page}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearch={handleSearch}
        searchTerm={search}
        handleViewMore={handleViewMore}
        showPagination={false}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
      >
        <FilterBadges onFilterRemove={handleFilterRemove} appliedFilters={appliedFilters} />
      </TechnoDataTableAdvanced>
    </>
  );
};
