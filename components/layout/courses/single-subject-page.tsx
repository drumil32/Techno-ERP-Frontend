"use client";
import DynamicInfoGrid from "@/components/custom-ui/info-grid/info-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { fetchSchedule } from "./helpers/fetch-data";
import { DeleteIcon, Trash2, Upload } from "lucide-react";
import { CourseMaterialType, LectureConfirmation } from "@/types/enum";
import SubjectMaterialsSection from "@/components/custom-ui/documents/document-section";
import TechnoDataTableAdvanced from "@/components/custom-ui/data-table/techno-data-table-advanced";
import { prepareSubjectMaterial, SubjectMaterial } from "./helpers/prepare-subject-materials";
import { UploaderDialogWrapper } from "@/components/document-upload/document-upload-wrapper";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import axios from 'axios';
import { ConfirmDialog } from "@/components/custom-ui/confirm-dialog/confirm-dialog";
import { Button } from "@/components/ui/button";


export interface Plan {
    _id: string,
    // serialNo? : number,
    unit: number,
    lectureNumber: number,
    topicName: string,
    instructor: string,
    plannedDate?: string,
    actualDate?: string,
    classStrength?: number,
    absent?: number,
    remarks?: string,
    confirmation: string,
    documents: string[]
}

interface Schedule {
    lecturePlan?: Plan[],
    practicalPlan?: Plan[],
    additionalResources?: string[]
}

interface ScheduleApiResponse {
    courseId: string,
    semesterId: string,
    subjectId: string,
    scheduleId: string,
    instructorId: string,
    departmentMetaDataId: string,
    courseName: string,
    courseCode: string,
    courseYear: string,
    semesterNumber: number,
    subjectName: string,
    subjectCode: string,
    instructorName: string,
    departmentName: string,
    departmentHOD: string,
    collegeName: string,
    schedule: Schedule,
    academicYear: string,
}


const confirmationStatus: Record<LectureConfirmation, { name: string; textStyle: string; bgStyle: string }> = {
    [LectureConfirmation.TO_BE_DONE]: {
        name: "To Be Done",
        textStyle: "text-gray-700",
        bgStyle: "bg-yellow-100",
    },
    [LectureConfirmation.CONFIRMED]: {
        name: "Confirmed",
        textStyle: "text-green-800",
        bgStyle: "bg-green-100",
    },
    [LectureConfirmation.DELAYED]: {
        name: "Delayed",
        textStyle: "text-red-700",
        bgStyle: "bg-red-100",
    },
};


const calculateAttendance = (plan: Plan) => {
    const strength = plan.classStrength ?? 0;
    const absent = plan.absent ?? 0;
    return strength - absent;
};

export const SingleSubjectPage = () => {

    const queryClient = useQueryClient();
    const pathname = usePathname();
    const routerNav = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams.get("crsi");
    const semesterId = searchParams.get("si");
    const subjectId = searchParams.get("subi");
    const instructorId = searchParams.get("ii");

    console.log("Course id : ", courseId);
    console.log("Semester Id : ", semesterId);
    console.log("Subject Id : ", subjectId);
    console.log("Instructor Id : ", instructorId);

    const rows = [3, 4, 4];

    const [materials, setMaterials] = useState([{}]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showDocumentUploader, setShowDocumentUploader] = useState(false);
    const [uploadContext, setUploadContext] = useState<{
        planId: string;
        type: "LPlan" | "PPlan";
        courseId: string;
        semesterId: string;
        subjectId: string;
        instructorId: string;
    } | null>(null);

    const [additionalResourcesContext, setAdditionalResourcesContext] = useState<{
        courseId: string;
        semesterId: string;
        subjectId: string;
        instructorId: string;
    } | null>(null);

    const [deleteInfo, setDeleteInfo] = useState<{
        index: number;
        material: SubjectMaterial;
    } | null>(null);

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

    const searchTimerRef = useRef<NodeJS.Timeout | null>(null);


    const handleFileAccepted = (files: File[]) => {
        console.log("Accepted files:", files);
    };

    const handlePlanFileSave = async (file: File) => {
        console.log("Handling file save");
        if (!uploadContext)
            return;

        console.log("Upload information is: ", uploadContext);

        const formData = new FormData();
        formData.append("planId", uploadContext.planId);
        formData.append("type", uploadContext.type);
        formData.append("courseId", uploadContext.courseId);
        formData.append("semesterId", uploadContext.semesterId);
        formData.append("subjectId", uploadContext.subjectId);
        formData.append("instructorId", uploadContext.instructorId);
        formData.append("document", file);

        const response = await axios.put(API_ENDPOINTS.uploadPlan, formData, {
            headers: { // No need to handle headers, it will be done by axios
            },
            withCredentials: true,
        });

        if (response.data.SUCCESS) {
            toast.success(response.data.MESSAGE);
            queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
            setUploadContext(null);
            setShowDocumentUploader(false);
        }
        else {
            toast.error(response.data.ERROR);
        }
    };

    const handleViewMore = (row: any) => {
        //TODO : This won't be there anymore
    };

    const handleDelete = (row: any) => {

    }


    const handleDocumentDelete = async () => {
        if (!deleteInfo)
            return;

        const { courseId, semesterId, subjectId, planId, type, link: documentUrl } = deleteInfo.material;

        console.log("Delete Info is:", deleteInfo);

        const payload: Record<string, any> = {
            courseId,
            semesterId,
            subjectId,
            documentUrl,
        };

        if (type === CourseMaterialType.LPLAN || type === CourseMaterialType.PPLAN) {
            payload.type = type;
            payload.planId = planId;
        }

        try {
            const response = await axios.delete(API_ENDPOINTS.deleteFileUsingURL, {
                data: payload,
                withCredentials: true,
            });

            if (response.data.SUCCESS) {
                toast.success(response.data.MESSAGE);
                queryClient.invalidateQueries({ queryKey: ["scheduleInfo"] });
                setDeleteInfo(null);
            }
            else {
                toast.error(response.data.ERROR);
            }
        }
        catch (error) {
            toast.error("An error occurred while deleting the document.");
            console.error(error);
        }
    };


    const handleUpload = (row: any, type: "LPlan" | "PPlan") => {
        setUploadContext({
            planId: row._id,
            type,
            courseId: courseId!,
            semesterId: semesterId!,
            subjectId: subjectId!,
            instructorId: instructorId!
        });

        setShowDocumentUploader(true);
    };


    const handleAdditionalResourceUpload = () => {
        setAdditionalResourcesContext({
            courseId: courseId!,
            semesterId: semesterId!,
            subjectId: subjectId!,
            instructorId: instructorId!
        });
        setShowDocumentUploader(true);
    };


    const handleAdditionalResourceFileSave = async (file: File) => {
        console.log("Handling file save");
        if (!additionalResourcesContext)
            return;

        console.log("Upload information is: ", uploadContext);

        const formData = new FormData();
        formData.append("courseId", additionalResourcesContext.courseId);
        formData.append("semesterId", additionalResourcesContext.semesterId);
        formData.append("subjectId", additionalResourcesContext.subjectId);
        formData.append("instructorId", additionalResourcesContext.instructorId);
        formData.append("document", file);

        const response = await axios.put(API_ENDPOINTS.uploadAdditionalResources, formData, {
            headers: { // No need to handle headers, it will be done by axios
            },
            withCredentials: true,
        });

        if (response.data.SUCCESS) {
            toast.success(response.data.MESSAGE);
            queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
            setAdditionalResourcesContext(null);
            setShowDocumentUploader(false);
        }
        else {
            toast.error(response.data.ERROR);
        }
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

    const addLecturePlan = () => {
        console.log("Adding lecture plan!");
        console.log("Added lecture plan");
    }

    const getQueryParams = () => {
        const params: { [key: string]: any } = {
            courseId: courseId,
            semesterId: semesterId,
            subjectId: subjectId,
            instructorId: instructorId,
            search: debouncedSearch,
            refreshKey
        };

        return params;
    };

    const filterParams = getQueryParams();
    console.log("Filter params : ", filterParams);
    const subjectQuery = useQuery({
        queryKey: ['scheduleInfo', filterParams, debouncedSearch],
        queryFn: fetchSchedule,
        placeholderData: (previousData) => previousData,
        enabled: true
    });


    const scheduleResponse: ScheduleApiResponse = subjectQuery.data as ScheduleApiResponse || {};
    console.log(scheduleResponse);
    let schedule = scheduleResponse?.schedule || [];

    let practicalPlan = schedule?.practicalPlan || [];
    let lecturePlan = schedule?.lecturePlan || [];
    let additionalResources = schedule?.additionalResources || [];

    console.log("Practical Plan : ", practicalPlan);
    console.log("Lecture Plan is : ", lecturePlan);
    const documentMaterials = prepareSubjectMaterial(lecturePlan, practicalPlan, additionalResources, courseId!, semesterId!, subjectId!, instructorId!)
    console.log("Document Materials are : ", documentMaterials);
    // setMaterials(documentMaterials);
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
        "Subject Name": scheduleResponse?.subjectName,
        "Subject Code": scheduleResponse?.subjectCode,
        "Instructor": scheduleResponse?.instructorName,
        "Course Name": scheduleResponse?.courseName,
        "Course Year": scheduleResponse?.courseYear,
        "Semester": scheduleResponse?.semesterNumber?.toString(),
        "Academic Year": scheduleResponse.academicYear,
        "Course Code": scheduleResponse?.courseCode,
        "Department": scheduleResponse?.departmentName,
        "HOD": scheduleResponse?.departmentHOD,
        "College Name": scheduleResponse?.collegeName
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


    const getColumns = (type: "LPlan" | "PPlan") => [
        { accessorKey: 'unit', header: 'Unit' },
        { accessorKey: 'lectureNumber', header: 'Lecture No' },
        { accessorKey: 'topicName', header: 'Topic Name' },
        { accessorKey: 'plannedDate', header: 'Planned Date' },
        { accessorKey: 'actualDate', header: 'Actual Date' },
        { accessorKey: 'classStrength', header: 'Class Strength' },
        { accessorKey: 'attendance', header: 'Attendance' },
        { accessorKey: 'absent', header: 'Absent' },
        { accessorKey: 'remarks', header: 'Remarks' },
        {
            accessorKey: 'confirmation',
            header: 'Confirmation',
            cell: ({ getValue }: any) => {
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
                <div className="flex justify-center items-center gap-4">
                    <center>
                        <button
                            onClick={() => handleDelete(row.original)}
                            className="font-light hover:text-gray-500"
                        >
                            <Trash2 size={20} />
                        </button>
                    </center>
                    <center>
                        <button
                            onClick={() => { handleUpload(row.original, type); setShowDocumentUploader(true); }}
                            className="font-light hover:text-gray-500"
                        >
                            <Upload size={20} />
                        </button>
                    </center>
                </div>
            ),
        },
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

            <TechnoDataTableAdvanced
                columns={getColumns("LPlan")}
                data={lecturePlan}
                tableName="Lecture Plan"
                onSearch={handleSearch}
                searchTerm={search}
                handleViewMore={handleViewMore}
                showPagination={false}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                visibleRows={5}
                showAddButton={true}
                showEditButton={true}
                addButtonPlacement={"bottom"}
                addBtnLabel={"Add Lecture Plan"} >
            </TechnoDataTableAdvanced>

            <UploaderDialogWrapper
                open={showDocumentUploader}
                onClose={() => setShowDocumentUploader(false)}
                onFileAccepted={handleFileAccepted}
                onSave={uploadContext ? handlePlanFileSave : handleAdditionalResourceFileSave}
                headingText="Upload Subject Materials"
            />


            <TechnoDataTableAdvanced
                columns={getColumns("PPlan")}
                data={practicalPlan}
                tableName="Practical Plan"
                onSearch={handleSearch}
                searchTerm={search}
                handleViewMore={handleViewMore}
                showPagination={false}
                selectedRowId={selectedRowId}
                setSelectedRowId={setSelectedRowId}
                visibleRows={5}
                showAddButton={true}
                showEditButton={true}
                addButtonPlacement={"bottom"}
                addBtnLabel={"Add Practical Plan"} >
            </TechnoDataTableAdvanced>

            <SubjectMaterialsSection
                materials={documentMaterials}
                onRemove={(index, documentMaterials) => {
                    setDeleteInfo({ index, material: documentMaterials.at(index) as SubjectMaterial });
                }}
                onUpload={handleAdditionalResourceUpload}
                nameFontSize="text-sm"
                metadataFontSize="text-xs"
            />

            <ConfirmDialog
                open={!!deleteInfo}
                icon={<Trash2 className=" pb-1 text-gray-500" />}
                title="Deleting a Document?"
                description={
                    <>
                        Are you sure you want to delete the document{" "}
                        <strong>{deleteInfo?.material.name}</strong>?<br />
                        <center>
                            <Button className="pt-2 mt-2 text-lg bg-white hover:bg-white">
                                <a
                                    href={deleteInfo?.material.link}
                                    target="_blank"
                                    className="underline text-blue-800"
                                >
                                    View your document here!
                                </a>
                            </Button>
                        </center>
                    </>
                }
                onCancel={() => setDeleteInfo(null)}
                onConfirm={handleDocumentDelete}
            />
        </>
    );
}