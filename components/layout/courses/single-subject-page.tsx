// export const SingleSubjectPage = () => {
//     return (
//         <div>Hello THis is schedule page!</div>
//     )
// }


"use client";
import DynamicInfoGrid from "@/components/custom-ui/info-grid/info-grid";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { fetchSchedule, fetchSubjects } from "./helpers/fetch-data";
import { Button } from "@/components/ui/button";
import TechnoDataTable from "@/components/custom-ui/data-table/techno-data-table";
import { SITE_MAP } from "@/common/constants/frontendRouting";
import { getCurrentBreadCrumb } from "@/lib/getCurrentBreadCrumb";
import { Trash2, UploadCloud } from "lucide-react";
import { LectureConfirmation } from "@/types/enum";

interface Plan{
    _id : string,
    // serialNo? : number,
    unit: number,
    lectureNumber : number,
    topicName : string,
    instructor : string,
    plannedDate? : string,
    actualDate? : string,
    classStrength? : number,
    absent? : number,
    remarks? : string,
    confirmation : string,
    documents : string[]
}

interface Schedule{
    lecturePlan? : Plan[],
    practicalPlan? : Plan[],
    additionalResources? : string[]
}

interface ScheduleApiResponse{
    courseId : string,
    semesterId : string,
    subjectId : string,
    scheduleId : string,
    instructorId : string,
    departmentMetaDataId : string,
    courseName : string,
    courseCode : string,
    courseYear : string,
    semesterNumber : number,
    subjectName : string,
    subjectCode : string,
    instructorName : string,
    departmentName : string,
    departmentHOD : string,
    collegeName : string,
    schedule : Schedule,
    academicYear : "2024-2025"
}

const calculateAttendance = (plan: Plan) => {
    const strength = plan.classStrength ?? 0;
    const absent = plan.absent ?? 0;
    return strength - absent;
};

export const SingleSubjectPage = () => {
    
    const pathname = usePathname();
    const routerNav = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("crsi");
    const semesterId = searchParams.get("si");
    const subjectId = searchParams.get("subi");
    const instructorId = searchParams.get("ii");

    console.log("COurse id : ", courseId);
    console.log("Semester Id : ", semesterId);
    console.log("Subject Id : ", subjectId);
    console.log("Instructor Id : ", instructorId);

    const rows = [3, 4, 4];

    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleViewMore = (row : any) => {
       //TODO : This won't be there anymore
    };

    const handleDelete = (row : any) => {

    }
    
    const handleUpload = (row: any) => {

    }

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
            courseId : courseId,
            semesterId : semesterId,
            subjectId : subjectId,
            instructorId : instructorId,
            search: debouncedSearch,
            refreshKey
        };

        return params;
    };

    const filterParams = getQueryParams();
    console.log("FIlter params : ", filterParams);
    const subjectQuery = useQuery({
        queryKey: ['scheduleInfo', filterParams, debouncedSearch],
        queryFn: fetchSchedule,
        placeholderData: (previousData) => previousData,
        enabled: true
    });


    const scheduleResponse : ScheduleApiResponse = subjectQuery.data as ScheduleApiResponse || {};
    console.log(scheduleResponse);
    let schedule = scheduleResponse?.schedule || [];

    let practicalPlan = schedule?.lecturePlan || [];
    let lecturePlan = schedule?.practicalPlan || [];
    let additionalResources = schedule?.additionalResources || [];

 

    lecturePlan = (schedule?.lecturePlan || []).map(plan => ({
        ...plan,
        attendance: calculateAttendance(plan)
      }));
      
      practicalPlan = (schedule?.practicalPlan || []).map(plan => ({
        ...plan,
        attendance: calculateAttendance(plan)
      }));

    // practicalPlan.forEach((plan, index) => {
    //     plan.serialNo = index + 1;
    // });
      
    // lecturePlan.forEach((plan, index) => {
    //     plan.serialNo = index + 1;
    // });

    const subjectData = {
        "Subject Name" : scheduleResponse?.subjectName,
        "Subject Code" : scheduleResponse?.subjectCode,
        "Instructor" : scheduleResponse?.instructorName,
        "Course Name" : scheduleResponse?.courseName,
        "Course Year" : scheduleResponse?.courseYear,
        "Semester" : scheduleResponse?.semesterNumber?.toString(),
        "Academic Year" : "2024-2025",
        "Course Code" : scheduleResponse?.courseCode,
        "Department" : scheduleResponse?.departmentName,
        "HOD" : scheduleResponse?.departmentHOD,
        "College Name" : scheduleResponse?.collegeName
    }

    console.log(subjectData);

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
        { accessorKey: 'unit', header: 'Unit' },
        { accessorKey: 'lectureNumber', header: 'Lecture No' },
        { accessorKey: 'topicName', header: 'Topic Name' },
        { accessorKey: 'plannedDate', header: 'Planned Date' },
        { accessorKey : 'actualDate', header : 'Actual Date'},
        { accessorKey : 'classStrength', header : 'Class Strength'},
        { accessorKey : 'attendance', header : 'Attendance'},
        { accessorKey : 'absent', header : 'Absent'},
        { accessorKey : 'remarks' , header : 'Remarks'},
        {
            accessorKey: 'confirmation',
            header: 'Confirmation',
            cell: ({ row, getValue }: any) => {
              const value = getValue() || LectureConfirmation.TO_BE_DONE;
          
              return (
                <select
                  defaultValue={value}
                  className="border rounded px-2 py-1 text-sm"
                  onChange={(e) => {
                    const updatedValue = e.target.value as LectureConfirmation;
                    console.log('Updated Confirmation:', updatedValue);
                  }}
                >
                  {Object.values(LectureConfirmation).map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              );
            },
          },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
              <div className="flex items-right gap-2">
                <center>
                <button
                  onClick={() => handleDelete(row.original)}
                  className="font-light hover:text-gray-500"
                >
                  <Trash2 size={20}/>
                </button>
                </center>
               <center>
               <button
                  onClick={() => handleUpload(row.original)}
                  className="font-light hover:text-gray-500 "
                >
                  <UploadCloud size={20} />
                </button>
               </center>
               
              </div>
            ),
          }
    ];


    return (
        <>
        <div className="pb-6">
        <DynamicInfoGrid
                columns={3}
                rowsPerColumn={rows}
                data={subjectData}
                design={{
                    containerWidth: "1339px",
                    containerHeight: "119px",
                    columnWidth: "475px",
                    columnHeight: "96px",
                    columnGap: "65px",
                    rowGap: "12px",
                    keyWidth: "125px",
                    valueWidth: "333px",
                    fontSize: "14px"
                }}
            />

        </div>
          
            <TechnoDataTable
                columns={columns}
                data={lecturePlan}
                tableName="Lecture Plan"
                onSearch={handleSearch}
                searchTerm={search}
                handleViewMore={handleViewMore}
                showPagination={false}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
            >
            </TechnoDataTable>


            <TechnoDataTable
                columns={columns}
                data={practicalPlan}
                tableName="Practical Plan"
                onSearch={handleSearch}
                searchTerm={search}
                handleViewMore={handleViewMore}
                showPagination={false}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
            >
            </TechnoDataTable>
        </>
    );
}