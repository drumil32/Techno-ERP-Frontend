'use client';
import DynamicInfoGrid from '@/components/custom-ui/info-grid/info-grid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchSchedule } from './helpers/fetch-data';
import { DeleteIcon, Trash2, Upload } from 'lucide-react';
import { CourseMaterialType, LectureConfirmation } from '@/types/enum';
import SubjectMaterialsSection from '@/components/custom-ui/documents/document-section';
import TechnoDataTableAdvanced from '@/components/custom-ui/data-table/techno-data-table-advanced';
import { prepareSubjectMaterial, SubjectMaterial } from './helpers/prepare-subject-materials';
import { UploaderDialogWrapper } from '@/components/document-upload/document-upload-wrapper';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import axios from 'axios';
import { ConfirmDialog } from '@/components/custom-ui/confirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { IFetchScheduleSchema, IScheduleSchema } from './schemas/scheduleSchema';
import TechnoTopHeader from '@/components/custom-ui/top-header/techno-top-header';
import TechnoPageHeading from '@/components/custom-ui/page-heading/techno-page-heading';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import SubjectDetails from './subject-details';

export interface Plan {
  _id: string;
  // serialNo? : number,
  unit: number;
  lectureNumber: number;
  topicName: string;
  instructor: string;
  plannedDate?: string;
  actualDate?: string;
  classStrength?: number;
  absent?: number;
  remarks?: string;
  confirmation: string;
  documents: string[];
}

interface Schedule {
  lecturePlan?: Plan[];
  practicalPlan?: Plan[];
  additionalResources?: string[];
}

interface ScheduleApiResponse {
  courseId: string;
  semesterId: string;
  subjectId: string;
  scheduleId: string;
  instructorId: string;
  departmentMetaDataId: string;
  courseName: string;
  courseCode: string;
  courseYear: string;
  semesterNumber: number;
  subjectName: string;
  subjectCode: string;
  instructorName: string;
  departmentName: string;
  departmentHOD: string;
  collegeName: string;
  schedule: Schedule;
  academicYear: string;
}

const confirmationStatus: Record<
  LectureConfirmation,
  { name: string; textStyle: string; bgStyle: string }
> = {
  [LectureConfirmation.TO_BE_DONE]: {
    name: 'To Be Done',
    textStyle: 'text-yellow-100',
    bgStyle: 'bg-yellow-700'
  },
  [LectureConfirmation.CONFIRMED]: {
    name: 'Confirmed',
    textStyle: 'text-green-100',
    bgStyle: 'bg-green-800'
  },
  [LectureConfirmation.DELAYED]: {
    name: 'Delayed',
    textStyle: 'text-red-100',
    bgStyle: 'bg-red-700'
  }
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
  const courseId = searchParams.get('crsi');
  const semesterId = searchParams.get('si');
  const subjectId = searchParams.get('subi');
  const instructorId = searchParams.get('ii');


  const rows = [4, 4, 3];

  const [materials, setMaterials] = useState([{}]);
  const [refreshKey, setRefreshKey] = useState(0);
  // const [search, setSearch] = useState('');
  // const [debouncedSearch, setDebouncedSearch] = useState('');

  const [lectureSearch, setLectureSearch] = useState('');
  const [practicalSearch, setPracticalSearch] = useState('');
  const [debouncedLectureSearch, setDebouncedLectureSearch] = useState('');
  const [debouncedPracticalSearch, setDebouncedPracticalSearch] = useState('');
  const lectureSearchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const practicalSearchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [fullSchedule, setFullSchedule] = useState<ScheduleApiResponse | null>(null);
  const [filteredLecturePlan, setFilteredLecturePlan] = useState<Plan[]>([]);
  const [filteredPracticalPlan, setFilteredPracticalPlan] = useState<Plan[]>([]);

  const [showDocumentUploader, setShowDocumentUploader] = useState(false);

  const [deletePlanInfo, setDeletePlanInfo] = useState<{
    planId: string;
    type: 'LPlan' | 'PPlan';
    courseId: string;
    semesterId: string;
    subjectId: string;
    instructorId: string;
    lectureNumber: string;
  } | null>(null);

  const [uploadContext, setUploadContext] = useState<{
    planId: string;
    type: 'LPlan' | 'PPlan';
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
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const handleFileAccepted = (files: File[]) => {
  };

  const handlePlanFileSave = async (file: File) => {
    if (!uploadContext) return;


    const formData = new FormData();
    formData.append('planId', uploadContext.planId);
    formData.append('type', uploadContext.type);
    formData.append('courseId', uploadContext.courseId);
    formData.append('semesterId', uploadContext.semesterId);
    formData.append('subjectId', uploadContext.subjectId);
    formData.append('instructorId', uploadContext.instructorId);
    formData.append('document', file);

    const response = await axios.put(API_ENDPOINTS.uploadPlan, formData, {
      headers: {
        // No need to handle headers, it will be done by axios
      },
      withCredentials: true
    });

    if (response.data.SUCCESS) {
      toast.success(response.data.MESSAGE);
      queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
      setUploadContext(null);
      setShowDocumentUploader(false);
    } else {
      toast.error(response.data.ERROR);
    }
  };

  const batchUpdatePlan = async (
    courseId: string,
    semesterId: string,
    subjectId: string,
    instructorId: string,
    batchUpdateData: IFetchScheduleSchema[],
    type: 'LPlan' | 'PPlan'
  ) => {

    const toastId = toast.loading('Processing batch update...');

    try {
      const sanitizedData = batchUpdateData.map((row: IFetchScheduleSchema) => {
        return {
          ...row,
          classStrength: row.classStrength ? parseInt(row.classStrength) : row.classStrength,
          attendance: row.attendance ? parseInt(row.attendance) : row.attendance,
          absent: row.absent ? parseInt(row.absent) : row.absent
        };
      });

      const updateObject = {
        courseId: courseId,
        semesterId: semesterId,
        subjectId: subjectId,
        instructorId: instructorId,
        type: type,
        data: sanitizedData
      };


      const response = await axios.put(API_ENDPOINTS.batchUpdatePlan, updateObject, {
        headers: {
          // No need to handle headers, it will be done by axios
        },
        withCredentials: true
      });

      if (response.data.SUCCESS) {
        toast.success(response.data.MESSAGE, { id: toastId });
        queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
      } else {
        toast.error(response.data.ERROR, { id: toastId });
      }
    } catch (error) {
      toast.error('Failed to perform batch update', { id: toastId });
    }
  };

  const handleViewMore = (row: any) => {
    //TODO : This won't be there anymore
  };

  const handleDelete = (row: any, type: 'LPlan' | 'PPlan') => {
    setDeletePlanInfo({
      courseId: courseId!,
      semesterId: semesterId!,
      subjectId: subjectId!,
      instructorId: instructorId!,
      planId: row._id,
      type: type,
      lectureNumber: row.lectureNumber
    });
  };

  const handleDocumentDelete = async () => {
    if (!deleteInfo) return;

    const {
      courseId,
      semesterId,
      subjectId,
      planId,
      type,
      link: documentUrl
    } = deleteInfo.material;


    const payload: Record<string, any> = {
      courseId,
      semesterId,
      subjectId,
      documentUrl
    };

    if (type === CourseMaterialType.LPLAN || type === CourseMaterialType.PPLAN) {
      payload.type = type;
      payload.planId = planId;
    }

    try {
      setDeleteLoading(true);
      const response = await axios.delete(API_ENDPOINTS.deleteFileUsingURL, {
        data: payload,
        withCredentials: true
      });

      if (response.data.SUCCESS) {
        toast.success(response.data.MESSAGE);
        queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
        setDeleteInfo(null);
      } else {
        toast.error(response.data.ERROR);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the document.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const savePlan = async (
    type: CourseMaterialType,
    courseId: string,
    semesterId: string,
    subjectId: string,
    instructorId: string,
    newRowData: any
  ) => {
    const requestObject = {
      courseId: courseId,
      semesterId: semesterId,
      subjectId: subjectId,
      instructorId: instructorId,
      ...newRowData,
      type: type
    };

    const response = await axios.post(API_ENDPOINTS.createPlan, requestObject, {
      headers: {
        // No need to handle headers, it will be done by axios
      },
      withCredentials: true
    });


    if (response.data.SUCCESS) {
      toast.success(response.data.MESSAGE);
      queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
    } else {
      toast.error(response.data.ERROR);
    }
  };

  const handlePlanDelete = async () => {
    if (!deletePlanInfo) return;

    const { courseId, semesterId, subjectId, instructorId, planId, type } = deletePlanInfo;

    const payload: Record<string, any> = {
      courseId,
      semesterId,
      subjectId,
      instructorId,
      planId,
      type
    };

    try {
      setDeleteLoading(true);
      const response = await axios.delete(API_ENDPOINTS.deletePlan, {
        data: payload,
        withCredentials: true
      });

      if (response.data.SUCCESS) {
        toast.success(response.data.MESSAGE);
        queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
        setDeletePlanInfo(null);
      } else {
        toast.error(response.data.ERROR);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the document.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleUpload = (row: any, type: 'LPlan' | 'PPlan') => {
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
    if (!additionalResourcesContext) return;


    const formData = new FormData();
    formData.append('courseId', additionalResourcesContext.courseId);
    formData.append('semesterId', additionalResourcesContext.semesterId);
    formData.append('subjectId', additionalResourcesContext.subjectId);
    formData.append('instructorId', additionalResourcesContext.instructorId);
    formData.append('document', file);

    const response = await axios.put(API_ENDPOINTS.uploadAdditionalResources, formData, {
      headers: {
        // No need to handle headers, it will be done by axios
      },
      withCredentials: true
    });

    if (response.data.SUCCESS) {
      toast.success(response.data.MESSAGE);
      queryClient.invalidateQueries({ queryKey: ['scheduleInfo'] });
      setAdditionalResourcesContext(null);
      setShowDocumentUploader(false);
    } else {
      toast.error(response.data.ERROR);
    }
  };

  const handleLectureSearch = (value: string) => {
    setLectureSearch(value);

    if (lectureSearchTimerRef.current) {
      clearTimeout(lectureSearchTimerRef.current);
    }

    lectureSearchTimerRef.current = setTimeout(() => {
      setDebouncedLectureSearch(value);
    }, 500);
  };

  const handlePracticalSearch = (value: string) => {
    setPracticalSearch(value);

    if (practicalSearchTimerRef.current) {
      clearTimeout(practicalSearchTimerRef.current);
    }

    practicalSearchTimerRef.current = setTimeout(() => {
      setDebouncedPracticalSearch(value);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (lectureSearchTimerRef.current) {
        clearTimeout(lectureSearchTimerRef.current);
      }
      if (practicalSearchTimerRef.current) {
        clearTimeout(practicalSearchTimerRef.current);
      }
    };
  }, []);

  const addLecturePlan = () => {
  };

  const getQueryParams = () => {
    const params: { [key: string]: any } = {
      courseId,
      semesterId,
      subjectId,
      instructorId,
      refreshKey
    };
    return params;
  };

  const filterParams = getQueryParams();

  const subjectQuery = useQuery({
    queryKey: ['scheduleInfo', filterParams],
    queryFn: fetchSchedule,
    placeholderData: (previousData) => previousData,
    enabled: true,
    refetchOnWindowFocus: false
  });

  const scheduleResponse: ScheduleApiResponse = (subjectQuery.data as ScheduleApiResponse) || {};

  useEffect(() => {
    if (subjectQuery.isSuccess) {
      setFullSchedule(subjectQuery.data as ScheduleApiResponse);
    }
  }, [subjectQuery.data]);

  // setFullSchedule(scheduleResponse);

  let schedule = scheduleResponse?.schedule || [];

  let practicalPlan = schedule?.practicalPlan || [];
  let lecturePlan = schedule?.lecturePlan || [];
  let additionalResources = schedule?.additionalResources || [];

  useEffect(() => {
    if (fullSchedule) {
      let schedule = fullSchedule.schedule || [];

      const filteredLecturePlans = schedule?.lecturePlan?.filter((plan) =>
        plan.topicName.toLowerCase().includes(debouncedLectureSearch.toLowerCase())
      );

      const filteredPracticalPlans = schedule?.practicalPlan?.filter((plan) =>
        plan.topicName.toLowerCase().includes(debouncedPracticalSearch.toLowerCase())
      );

      setFilteredLecturePlan(filteredLecturePlans || []);
      setFilteredPracticalPlan(filteredPracticalPlans || []);
    }
  }, [debouncedLectureSearch, debouncedPracticalSearch, fullSchedule]);

  useEffect(() => {
    return () => {
      if (lectureSearchTimerRef.current) {
        clearTimeout(lectureSearchTimerRef.current);
      }
      if (practicalSearchTimerRef.current) {
        clearTimeout(practicalSearchTimerRef.current);
      }
    };
  }, []);

  const documentMaterials = prepareSubjectMaterial(
    filteredLecturePlan,
    filteredPracticalPlan,
    additionalResources,
    courseId!,
    semesterId!,
    subjectId!,
    instructorId!
  );
  // setMaterials(documentMaterials);
  const lecturePlanWithAttendance = filteredLecturePlan.map((plan) => ({
    ...plan,
    attendance: calculateAttendance(plan)
  }));

  const practicalPlanWithAttendance = filteredPracticalPlan.map((plan) => ({
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
    'Subject Name': scheduleResponse?.subjectName,
    'Subject Code': scheduleResponse?.subjectCode,
    Instructor: scheduleResponse?.instructorName,
    'Course Name': scheduleResponse?.courseName,
    'Course Year': scheduleResponse?.courseYear,
    Semester: scheduleResponse?.semesterNumber?.toString(),
    'Academic Year': scheduleResponse.academicYear,
    'Course Code': scheduleResponse?.courseCode,
    Department: scheduleResponse?.departmentName,
    HOD: scheduleResponse?.departmentHOD,
    'College Name': scheduleResponse?.collegeName
  };


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

  const getColumns = (type: 'LPlan' | 'PPlan') => [
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
            }}
          >
            {Object.values(LectureConfirmation).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex justify-center items-center gap-4">
          <center>
            <button
              onClick={() => handleDelete(row.original, type)}
              className="font-light hover:text-gray-500"
            >
              <Trash2 size={20} />
            </button>
          </center>
          <center>
            <button
              onClick={() => {
                handleUpload(row.original, type);
                setShowDocumentUploader(true);
              }}
              className="font-light hover:text-gray-500"
            >
              <Upload size={20} />
            </button>
          </center>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="pb-6">
        <SubjectDetails subjectData={subjectData} />
      </div>

      {/* Header */}
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Subject Plan</h1>
      </div>

      <TechnoDataTableAdvanced
        columns={getColumns('LPlan')}
        data={lecturePlanWithAttendance}
        tableName="Lecture Plan"
        onSearch={handleLectureSearch}
        searchTerm={lectureSearch}
        handleViewMore={handleViewMore}
        showPagination={false}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        // minVisibleRows={lecturePlan.length == 0 ? 14 : (lecturePlan.length + 2 < 5 ? lecturePlan.length + 2 : 7)}
        minVisibleRows={8}
        maxVisibleRows={10}
        showAddButton={true}
        showEditButton={true}
        addButtonPlacement={'bottom'}
        addBtnLabel={'Add Lecture Plan'}
        onSaveNewRow={(newRowData: any) => {
          savePlan(
            CourseMaterialType.LPLAN,
            courseId!,
            semesterId!,
            subjectId!,
            instructorId!,
            newRowData
          );
        }}
        handleBatchEdit={(batchEditedData: any) => {
          batchUpdatePlan(
            courseId!,
            semesterId!,
            subjectId!,
            instructorId!,
            batchEditedData,
            'LPlan'
          );
        }}
      ></TechnoDataTableAdvanced>

      <UploaderDialogWrapper
        open={showDocumentUploader}
        onClose={() => setShowDocumentUploader(false)}
        onFileAccepted={handleFileAccepted}
        onSave={uploadContext ? handlePlanFileSave : handleAdditionalResourceFileSave}
        headingText="Upload Subject Materials"
      />

      <TechnoDataTableAdvanced
        columns={getColumns('PPlan')}
        data={practicalPlanWithAttendance}
        tableName="Practical Plan"
        onSearch={handlePracticalSearch}
        searchTerm={practicalSearch}
        handleViewMore={handleViewMore}
        showPagination={false}
        selectedRowId={selectedRowId}
        setSelectedRowId={setSelectedRowId}
        minVisibleRows={8}
        maxVisibleRows={10}
        // minVisibleRows={practicalPlan.length == 0 ? 14 : (practicalPlan.length + 2 < 5 ? practicalPlan.length + 2 : 7)}
        showAddButton={true}
        showEditButton={true}
        addButtonPlacement={'bottom'}
        addBtnLabel={'Add Practical Plan'}
        onSaveNewRow={(newRowData: any) => {
          savePlan(
            CourseMaterialType.PPLAN,
            courseId!,
            semesterId!,
            subjectId!,
            instructorId!,
            newRowData
          );
        }}
        handleBatchEdit={(batchEditedData: any) => {
          batchUpdatePlan(
            courseId!,
            semesterId!,
            subjectId!,
            instructorId!,
            batchEditedData,
            'PPlan'
          );
        }}
      ></TechnoDataTableAdvanced>

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
        open={!!deletePlanInfo}
        icon={<Trash2 className=" pb-1 text-gray-500" />}
        title="Deleting a Plan?"
        isLoading={deleteLoading}
        loadingTitle="Deleting Plan...."
        description={
          <div className="flex items-center gap-2">
            <FaRegCircleQuestion className="text-red-500" size={20} />
            Are you sure you want to delete the{' '}
            {deletePlanInfo?.type === CourseMaterialType.LPLAN ? 'Lecture' : 'Practical'}{' '}
            <strong>{deletePlanInfo?.lectureNumber}</strong>?<br />
          </div>
        }
        onCancel={() => setDeletePlanInfo(null)}
        onConfirm={handlePlanDelete}
      />

      <ConfirmDialog
        open={!!deleteInfo}
        icon={<Trash2 className=" pb-1 text-gray-500" />}
        title="Deleting a Document?"
        isLoading={deleteLoading}
        loadingTitle="Deleting Document..."
        description={
          <>
            Are you sure you want to delete the document{' '}
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
};
