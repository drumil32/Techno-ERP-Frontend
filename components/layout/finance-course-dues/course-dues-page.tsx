'use client';

import { useEffect, useRef, useState } from 'react';
import TechnoDataTable from '@/components/custom-ui/data-table/techno-data-table';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { Button } from '@/components/ui/button';
import { LuDownload } from 'react-icons/lu';
import { CourseDues, CourseDueTableItem } from '@/types/finance';
import { Label } from '@/components/ui/label';
import { CollegeNames } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { addDays, format } from 'date-fns';
import { fetchCourseDues } from './helpers/fetch-data';
import { convertForTableView } from './helpers/convertToTableData';
import { getCurrentAcademicYear } from '@/lib/getCurrentAcademicYear';
import AdvancedTechnoBreadcrumb from '@/components/custom-ui/breadcrump/advanced-techno-breadcrumb';
import Loading from '@/app/c/marketing/loading';
import SendEmailDialog from './send-email-dialog';
import { ChevronDown } from 'lucide-react';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

const collegeOptions = [
  { id: 'ALL', label: 'All' },
  ...Object.values(CollegeNames).map((college) => ({
    id: college,
    label: college
  }))
];

export default function CourseDuesDetails() {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const today = new Date();
  const yesterday = format(addDays(today, -1), 'dd/MM/yyyy');
  const [collegeName, setSelectedCollege] = useState('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [totalEntries, setTotalEntries] = useState(0);
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear());
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tableData, setTableData] = useState<CourseDueTableItem[]>([]);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const academicYearDropdownData = generateAcademicYearDropdown(0, 1);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);

      try {
        const params = {
          collegeName,
          date: yesterday,
          academicYear,
          search: debouncedSearch
        };


        const response = await fetchCourseDues({
          client: undefined as any,
          queryKey: ['courseDues', params],
          signal: undefined as any,
          meta: undefined,
        });
        const convertedData = convertForTableView(response ?? []);

        setTableData(convertedData);
        setTotalEntries(convertedData.length);
      } catch (error) {
        console.error('Error fetching course dues:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [academicYear, debouncedSearch, collegeName, yesterday]);

  // Define table columns
  const columns = [
    { accessorKey: 'sno', header: 'S. No' },
    { accessorKey: 'courseName', header: 'Course' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'dueStudentCount', header: 'No of Students' },
    {
      accessorKey: 'totalDue',
      header: 'Total Due',
      cell: ({ row }: any) => <span>{`₹ ${row.original.totalDue.toLocaleString()}`}</span>
    },
    { accessorKey: 'departmentHODName', header: 'Course Head' },
    {
      accessorKey: 'departmentHODEmail', header: 'Course Head Contact',
      meta: {
        align: 'center'
      },
      cell: ({ row }: any) => {
        return (
          <div className='flex gap-5 items-center justify-center w-full'>
            <div>{`${row.original.departmentHODEmail}`}</div>
            <SendEmailDialog hodName={row.original.departmentHODName} hodEmail={row.original.departmentHODEmail} />
          </div>
        )
      }
    }
  ];

  const handleViewMore = (courseDueData: CourseDueTableItem) => {
    router.push(
      SITE_MAP.FINANCE.SELECTED_COURSE_DUES(courseDueData.courseCode, courseDueData.courseYear)
    );
  };

  const handleCollegeChange = (value: string) => {
    setSelectedCollege(value);
  };

  const breadcrumbItems = [
    { title: 'Finance', route: SITE_MAP.FINANCE.DEFAULT },
    { title: 'Course Dues', route: SITE_MAP.FINANCE.COURSE_DUES }
  ];

  const handleAcademicYearChange = (value: string) => {
    setAcademicYear(value);
  };

  if (isLoading && tableData.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <AdvancedTechnoBreadcrumb items={breadcrumbItems} />
      <TechnoPageHeading title="All Course Dues" />

      <div className="w-full flex flex-row px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Update Date</Label>
          <Label>{yesterday}</Label>
        </div>
        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">College</Label>
          <span>
            <div className="flex items-center gap-4">
              <Select value={collegeName.toString()} onValueChange={handleCollegeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {collegeOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label.toString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </span>
        </div>

        <div className="flex w-1/5">
          <Label className="text-[#666666] w-1/3">Academic Year:</Label>
          <Label>{getCurrentAcademicYear()}</Label>
        </div>
        {/* <div className="flex items-center gap-4">
            <span className="font-[500]">Academic Year: </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[200px] justify-between">
                  {academicYear || 'Select Academic Year'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white w-auto min-w-[200px] max-h-[300px] overflow-y-auto">
                {academicYearDropdownData.map((item: string) => (
                  <div
                    key={item}
                    onClick={() => handleAcademicYearChange(item)}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <Checkbox checked={academicYear === item} />
                    <span>{item}</span>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

      </div>

      {isError && (
        <div className="p-4 mb-4 bg-red-50 text-red-700 rounded-md">
          An error occurred while loading data. Please try again.
        </div>
      )}

      <TechnoDataTable
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        columns={columns}
        data={tableData}
        showPagination={false}
        tableName="Course Dues"
        tableActionButton={<CourseTableActionButton />}
        totalEntries={totalEntries}
        onSearch={handleSearch}
        searchTerm={search}
        isLoading={isLoading}
        handleViewMore={handleViewMore}
        headerStyles={'text-[#5B31D1] bg-[#F7F4FF]'}
      />
    </>
  );
}

function CourseTableActionButton() {
  const handleDownload = () => {
  };

  return (
    <>
      <Button onClick={handleDownload} className="h-8 rounded-[10px] border" icon={LuDownload} disabled>
        <span className="font-inter font-semibold text-[12px]">Download</span>
      </Button>
    </>
  );
}
