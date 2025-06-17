"use client";
import DynamicInfoGrid from "@/components/custom-ui/info-grid/info-grid";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { fetchSubjects } from "./helpers/fetch-data";
import { Button } from "@/components/ui/button";
import { SITE_MAP } from "@/common/constants/frontendRouting";
import { getCurrentBreadCrumb } from "@/lib/getCurrentBreadCrumb";
import TechnoDataTableAdvanced from "@/components/custom-ui/data-table/techno-data-table-advanced";
import { CreateSubjectDialog } from "@/components/custom-ui/create-dialog/create-subject-dialog";
import CourseDisplayDetails from "@/components/custom-ui/courses/display-course-details";

interface Subject {
  serialNo?: number,
  subjectId: string,
  subjectName: string,
  subjectCode: string,
  instructorName: string,
  instructorId: string,
  numberOfLectures: number,
  disabled? : boolean
}

interface SubjectInformation {
  courseId: string,
  courseName: string,
  courseCode: string,
  semesterId: string,
  semesterNumber: string,
  academicYear: string,
  courseYear: string,
  collegeName: string,
  departmentName: string,
  departmentHOD: string,
  subjectDetails: Subject[]
}

interface SubjectApiResponse {
  subjectInformation: SubjectInformation
}

export const SingleCoursePage = () => {

  const pathname = usePathname();
  const routerNav = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("crsi");
  const semesterId = searchParams.get("si");

  const rows = [4, 4];

  const [createSubjectDialogOpen, setCreateSubjectDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleViewMore = (row: Subject) => {
    const currentCourse = getCurrentBreadCrumb(pathname);
    const redirectionPath = `${SITE_MAP.ACADEMICS.COURSES}/${currentCourse}/${row.subjectCode}?crsi=${courseId}&si=${semesterId}&subi=${row.subjectId}&ii=${row.instructorId}`;

    routerNav.push(redirectionPath);
  };

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


  const getQueryParams = () => {
    const params: { [key: string]: any } = {
      courseId: courseId,
      semesterId: semesterId,
      search: debouncedSearch,
      refreshKey
    };

    return params;
  };

  const filterParams = getQueryParams();
  const subjectQuery = useQuery({
    queryKey: ['subjectswiseinfo', filterParams, debouncedSearch],
    queryFn: fetchSubjects,
    placeholderData: (previousData) => previousData,
    enabled: true
  });


  const subjectResponse: SubjectApiResponse = subjectQuery.data as SubjectApiResponse || {};
  let subjects = subjectResponse?.subjectInformation?.subjectDetails || [];

  subjects.forEach((subject, index) => {
    subject.serialNo = index + 1;
    subject.disabled = !subject.instructorName?.trim();
  });


  const courseData = {
    "Course Name": subjectResponse?.subjectInformation?.courseName,
    "Course Year": subjectResponse?.subjectInformation?.courseYear,
    "Semester": subjectResponse?.subjectInformation?.semesterNumber,
    "Academic Year": subjectResponse?.subjectInformation?.academicYear,
    "Course Code": subjectResponse?.subjectInformation?.courseCode,
    "Department": subjectResponse?.subjectInformation?.departmentName,
    "HOD": subjectResponse?.subjectInformation?.departmentHOD,
    "College Name": subjectResponse?.subjectInformation?.collegeName
  }

  const courseDisplayData = {
    courseName: subjectResponse?.subjectInformation?.courseName,
    courseYear: subjectResponse?.subjectInformation?.courseYear,
    semester: subjectResponse?.subjectInformation?.semesterNumber,
    academicYear: subjectResponse?.subjectInformation?.academicYear,
    courseCode: subjectResponse?.subjectInformation?.courseCode,
    department: subjectResponse?.subjectInformation?.departmentName,
    hod: subjectResponse?.subjectInformation?.departmentHOD,
    collegeName: subjectResponse?.subjectInformation?.collegeName
  }


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
    subjectQuery.isFetching,
  ]);

  const columns = [
    { accessorKey: 'serialNo', header: 'S. No' },
    { accessorKey: 'subjectName', header: 'Subject Name' },
    { accessorKey: 'subjectCode', header: 'Subject Code' },
    {
      accessorKey: 'instructorName',
      header: 'Instructor',
      cell: ({ row }: any) => {
        const instructor = row.original.instructorName;
        return instructor?.trim() ? instructor : '--';
      }
    },    
    { accessorKey: 'numberOfLectures', header: 'No. of Lectures' },
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

  return (
    <>
      <CourseDisplayDetails courseData={courseDisplayData}/>

      <CreateSubjectDialog
        openDialog={createSubjectDialogOpen}
        onOpenChange={setCreateSubjectDialogOpen}
        data={{
          departmentName: subjectResponse?.subjectInformation?.departmentName!,
          courseId: courseId!,
          semesterId: semesterId!,
          courseName: subjectResponse?.subjectInformation?.courseName,
          academicYear: subjectResponse?.subjectInformation?.academicYear,
          semester: parseInt(subjectResponse?.subjectInformation?.semesterNumber!)
        }}
      />

      <TechnoDataTableAdvanced
        columns={columns}
        data={subjects}
        tableName="Subjects List"
        onSearch={handleSearch}
        searchTerm={search}
        handleViewMore={handleViewMore}
        showPagination={false}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        showAddButton={true}
        showEditButton={false}
        minVisibleRows={13}
        maxVisibleRows={10}
        addButtonPlacement={"top"}
        addBtnLabel={"Add a Subject"}
        addViaDialog={true}
        onAddClick={() => setCreateSubjectDialogOpen(true)}
      >
      </TechnoDataTableAdvanced>
    </>
  );
}
