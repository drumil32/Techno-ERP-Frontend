'use client';

import {
  createCourse,
  fetchDepartmentDropdown
} from '@/components/layout/courses/helpers/fetch-data';
import { generateAcademicYearDropdown } from '@/lib/generateAcademicYearDropdown';
import { CollegeNames } from '@/types/enum';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { AddMoreDataBtn } from '../add-more-data-btn/add-data-btn';
import { BookOpen, FolderPlus } from 'lucide-react';
import { parseAcademicYear } from '@/lib/parseAcademicYear';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/lib/queryClient';
import { CustomDropdown } from '../custom-dropdown/custom-dropdown';

const academicYears = generateAcademicYearDropdown();

interface DepartmentMetaData {
  departmentMetaDataId: string;
  departmentName: string;
  departmentHOD: string;
  startingYear: number;
}

const createCourseSchema = z.object({
  collegeName: z.nativeEnum(CollegeNames, { required_error: 'College Name is required' }),
  courseFullName: z
    .string({ required_error: 'Course Full Name is Required' })
    .nonempty('Course Full Name is Required.'),
  courseName: z
    .string({ required_error: 'Course Name is Required' })
    .nonempty('Course Name is Required.'),
  courseCode: z
    .string({ required_error: 'Course Code is Required' })
    .nonempty('Course Code is Required.'),
  academicYear: z
    .string({ required_error: 'Academic Year is Required' })
    .nonempty('Academic Year is Required.'),
  totalSemesters: z
    .number({
      required_error: 'Number of Semesters is required',
      invalid_type_error: 'Please enter a valid number'
    })
    .min(1, 'Semester Number should be greater than 1')
    .max(12, 'Semester Number should be less than 12'),
  departmentName: z
    .string({ required_error: 'Department Name is Required' })
    .nonempty('Department Name is Required.'),
  departmentHOD: z
    .string({ required_error: 'Department HOD is Required' })
    .nonempty('Department HOD is Required.')
});

type FormData = z.infer<typeof createCourseSchema>;

export const CreateCourseDialog = () => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(createCourseSchema)
  });

  const departmentQuery = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartmentDropdown
  });

  const departments: DepartmentMetaData[] = (departmentQuery.data as DepartmentMetaData[]) || [];

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = departmentQuery.isLoading || departmentQuery.isLoading;
    const hasError = departmentQuery.isError || departmentQuery.isError;
    const isSuccess = departmentQuery.isSuccess && departmentQuery.isSuccess;
    const isFetching = departmentQuery.isFetching || departmentQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading course data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load department data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Department data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load department data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading department data...', {
        duration: Infinity
      });
    }

    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, [
    // refreshKey,
    departmentQuery.isLoading,
    departmentQuery.isError,
    departmentQuery.isSuccess,
    departmentQuery.isFetching
  ]);

  const departmentName = useWatch({ control, name: 'departmentName' });

  useEffect(() => {
    if (departmentName && departments) {
      const selectedDepartment = departments.find((dep) => dep.departmentName === departmentName);
      if (selectedDepartment) {
        setValue('departmentHOD', selectedDepartment.departmentHOD);
      }
    }
  }, [departmentName, departments, setValue]);

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onMutate: () => {
      toastIdRef.current = toast.loading('Creating course...');
    },
    onSuccess: () => {
      toast.success('Course created successfully!', {
        id: toastIdRef.current || undefined
      });
      toastIdRef.current = null;
      setOpen(false);

      reset();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      toast.error('Failed to create course', {
        id: toastIdRef.current || undefined
      });
      toastIdRef.current = null;
    }
  });

  const handleFormSubmit = (data: FormData) => {
    const matchedDepartment = departments.find(
      (dep) =>
        dep.departmentName === data.departmentName && dep.departmentHOD === data.departmentHOD
    );

    const requestObject = {
      courseName: data.courseName,
      courseCode: data.courseCode,
      courseFullName: data.courseFullName,
      collegeName: data.collegeName,
      departmentMetaDataId: matchedDepartment?.departmentMetaDataId,
      startingYear: parseAcademicYear(data.academicYear),
      totalSemesters: data.totalSemesters
    };

    createCourseMutation.mutate(requestObject);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
        }
      }}
    >
      {/* </Dialog.Root> */}
      <Dialog.Trigger asChild>
        <AddMoreDataBtn
          icon={<FolderPlus />}
          label={'Create New Course'}
          btnClassName="bg-white"
          onClick={() => {
            
          }}
        ></AddMoreDataBtn>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white z-40 p-6 rounded-xl shadow-xl max-w-screen h-1/2 md:h-max overflow-auto md:w-full md:max-w-lg  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-500 text-xl" />
              &nbsp;Create a New Course
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-black text-xl font-bold">
              &times;
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* College Name */}
            <div className="space-y-1">
              <label className="form-field-label font-inter space-y-3">College Name</label>
              <Controller
                name="collegeName"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    id="collegeName"
                    options={Object.values(CollegeNames)}
                    selected={field.value ?? ''}
                    onChange={(val: any) => field.onChange(val)}
                    placeholder="Select the college name"
                    isOpen={openDropdownId === 'collegeName'}
                    setOpenDropdownId={setOpenDropdownId}
                  />
                )}
              />
              {errors.collegeName && (
                <p className="text-red-500 text-sm">{errors.collegeName.message}</p>
              )}
            </div>

            {/* Course Full Name */}
            <div className="space-y-1">
              <label className="form-field-label font-inter space-y-3">Course Full Name</label>
              <Controller
                name="courseFullName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Enter the course Full Name"
                    className={`p-3 form-field-input-text border rounded-md w-full form-field-input-text ${
                      !field.value ? 'form-field-input-init-text' : ''
                    }`}
                  />
                )}
              />
              {errors.courseFullName && (
                <p className="text-red-500 text-sm">{errors.courseFullName.message}</p>
              )}
            </div>

            {/* Course Name & Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="form-field-label font-inter">Course Name</label>
                <Controller
                  name="courseName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter the course name"
                      className={`p-3 form-field-input-text border rounded-md w-full form-field-input-text ${
                        !field.value ? 'form-field-input-init-text' : ''
                      }`}
                    />
                  )}
                />
                {errors.courseName && (
                  <p className="text-red-500 text-sm">{errors.courseName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="form-field-label font-inter">Course Code</label>
                <Controller
                  name="courseCode"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter the course code"
                      className={`p-3 form-field-input-text border rounded-md w-full ${!field.value ? 'form-field-input-init-text' : ''}`}
                    />
                  )}
                />
                {errors.courseCode && (
                  <p className="text-red-500 text-sm">{errors.courseCode.message}</p>
                )}
              </div>
            </div>

            {/* Academic Year & No. of Semesters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="form-field-label font-inter">Academic Year</label>
                <Controller
                  name="academicYear"
                  control={control}
                  render={({ field }) => (
                    <CustomDropdown
                      id="academicYear"
                      isOpen={openDropdownId === 'academicYear'}
                      setOpenDropdownId={setOpenDropdownId}
                      options={academicYears}
                      selected={field.value ?? ''}
                      onChange={(val: any) => field.onChange(val)}
                      placeholder="Select academic year"
                    />
                  )}
                />
                {errors.academicYear && (
                  <p className="text-red-500 text-sm">{errors.academicYear.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="form-field-label font-inter">No. of Semesters</label>
                <Controller
                  name="totalSemesters"
                  control={control}
                  render={({ field }) => (
                    <CustomDropdown
                      id="totalSemesters"
                      isOpen={openDropdownId === 'totalSemesters'}
                      setOpenDropdownId={setOpenDropdownId}
                      options={[...Array(12)].map((_, i) => (i + 1).toString())}
                      selected={field.value?.toString() ?? ''}
                      onChange={(val: any) => field.onChange(Number(val))}
                      placeholder="Select no. of semesters"
                    />
                  )}
                />
                {errors.totalSemesters && (
                  <p className="text-red-500 text-sm">{errors.totalSemesters.message}</p>
                )}
              </div>
            </div>

            {/* Department Name */}
            <div className="space-y-1">
              <label className="form-field-label font-inter">Department Name</label>
              <Controller
                name="departmentName"
                control={control}
                render={({ field }) => {
                  return (
                    <CustomDropdown
                      id="departmentName"
                      isOpen={openDropdownId === 'departmentName'}
                      setOpenDropdownId={setOpenDropdownId}
                      options={departments.map((dep) => dep.departmentName)}
                      selected={field.value ?? ''}
                      onChange={(val: any) => field.onChange(val)}
                      placeholder="Enter/Select the department name"
                    />
                  );
                }}
              />

              {errors.departmentName && (
                <p className="text-red-500 text-sm">{errors.departmentName.message}</p>
              )}
            </div>

            {/* HOD Name */}
            <div className="space-y-1">
              <label className="form-field-label font-inter">HOD Name</label>
              <Controller
                name="departmentHOD"
                control={control}
                render={({ field }) => (
                  <input
                    {...(field ?? '')}
                    placeholder="Enter the HOD name"
                    className={`disabled p-3 form-field-input-text border rounded-md w-full ${
                      !field.value ? 'form-field-input-init-text' : ''
                    }`}
                    disabled
                  />
                )}
              />
              {/* {errors.departmentHOD && (
                <p className="text-red-500 text-sm">{errors.departmentHOD.message}</p>
              )} */}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-4 pt-4">
              <Dialog.Close className="bg-gray-100 px-4 border-gray-200 border-1 py-2 rounded-md hover:bg-gray-200">
                Discard
              </Dialog.Close>
              <button
                type="submit"
                className="text-white px-4 py-2 rounded-md hover:bg-violet-700 saveDataBtn"
              >
                Save
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
