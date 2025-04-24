"use client";

import { createSubject, fetchInstructors } from "@/components/layout/courses/helpers/fetch-data";
import { generateAcademicYearDropdown } from "@/lib/generateAcademicYearDropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from '@radix-ui/react-dialog';
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BookOpen } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { MultiSelectCustomDropdown } from "../custom-dropdown/multi-select-custom-dropdown";

const academicYears = generateAcademicYearDropdown();

// interface DepartmentMetaData {
//   departmentMetaDataId: string,
//   departmentName: string,
//   departmentHOD: string,
//   startingYear: number
// }


interface SubjectData {
  courseName: string;
  academicYear: string;
  semester: number;
  courseId: string;
  semesterId: string;
};

interface CreateSubjectDialogProps {
  openDialog: boolean;
  onOpenChange: (open: boolean) => void;
  data: SubjectData
}

interface Instructor {
  _id : string;
  instructorId: string;
  name: string;
  email: string;
}

export const formatInstructors = (instructors: Instructor[]) => {
  const inst = []
  for (let ins of instructors) {
    inst.push(`${ins.name} - ${ins.email}`)
  }
  return inst;
}

const createSubjectSchema = z.object({
  courseId: z.string({ required_error: "Course ID is Required" }).nonempty("Course ID is Required."),
  semesterId: z.string({ required_error: "Semester ID is Required" }).nonempty("Semester ID is Required."),
  courseName: z.string({ required_error: "Course Name is Required" }).nonempty("Course Name is Required."),
  academicYear: z.string({ required_error: "Academic Year is Required" }).nonempty("Academic Year is Required."),
  semester: z.number({ required_error: "Semester Number is Required" }),
  subjectName: z.string({ required_error: "Subject Name is Required" }).nonempty("Subject Name is Required."),
  subjectCode: z.string({ required_error: "Subject Code is Required" }).nonempty("Subject Code is Required."),
  instructor: z.array(z.string()).nonempty("At least one instructor is required.")
})

type FormData = z.infer<typeof createSubjectSchema>;

export const CreateSubjectDialog = ({ openDialog, onOpenChange, data }: CreateSubjectDialogProps) => {
  const open = openDialog;
  console.log(data);
  const { control, handleSubmit, register, reset, formState: { errors }, } = useForm<FormData>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      courseName: "",
      academicYear: "",
      semester: 0,
      courseId: "",
      semesterId: "",
      instructor: [],
      subjectName: "",
      subjectCode: ""
    },
  });

  const instructorsQuery = useQuery({
    queryKey: ["instructorsmetadata"],
    queryFn: fetchInstructors
  });

  const instructors: Instructor[] = instructorsQuery.data as Instructor[] || [];

  const instructorsInfo = formatInstructors(instructors);

  useEffect(() => {
    const isLoading = instructorsQuery.isLoading || instructorsQuery.isLoading;
    const hasError = instructorsQuery.isError || instructorsQuery.isError;
    const isSuccess = instructorsQuery.isSuccess && instructorsQuery.isSuccess;
    const isFetching = instructorsQuery.isFetching || instructorsQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading course data...', {
          id: toastIdRef.current,
          duration: Infinity
        });
      }

      if (hasError) {
        toast.error('Failed to load instructors data', {
          id: toastIdRef.current,
          duration: 3000
        });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
        toastIdRef.current = null;
      }

      if (isSuccess) {
        toast.success('Instructors data loaded successfully', {
          id: toastIdRef.current!,
          duration: 2000
        });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load instructors data', {
        duration: 3000
      });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading instructors data...', {
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
    instructorsQuery.isLoading,
    instructorsQuery.isError,
    instructorsQuery.isSuccess,
    instructorsQuery.isFetching,
  ]);

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (data) {
      reset({
        courseName: data.courseName,
        academicYear: data.academicYear,
        semester: data.semester,
        courseId: data.courseId,
        semesterId: data.semesterId,
        instructor: [],
        subjectName: "",
        subjectCode: ""
      });
    }
  }, [data, reset]);

  const createSubjectMutation = useMutation({
    mutationFn: createSubject,
    onMutate: () => {
      toastIdRef.current = toast.loading("Creating subject...");
    },
    onSuccess: () => {
      toast.success("Subject created successfully!", {
        id: toastIdRef.current || undefined,
      });
      toastIdRef.current = null;
      onOpenChange(false);

      reset();
      queryClient.invalidateQueries({ queryKey: ["subjectswiseinfo"] });
    },
    onError: (error: any) => {
      toast.error("Failed to create subject", {
        id: toastIdRef.current || undefined,
      });
      toastIdRef.current = null;
      console.error("Create subject error:", error);
    },
  });


  const handleFormSubmit = (data: FormData) => {
    console.log("Form Data:", data);

    // const matchedDepartment = departments.find(
    //   (dep) =>
    //     dep.departmentName === data.departmentName &&
    //     dep.departmentHOD === data.departmentHOD
    // );


    const instructorIds = data.instructor.map((value) => {
      const [name, email] = value.split(" - ");
      const matched = instructors.find(
        (instr) => instr.name === name && instr.email === email
      );
      return matched?.instructorId;
    }).filter(Boolean);


    const requestObject = {
      subjectName: data.subjectName,
      subjectCode: data.subjectCode,
      instructor: instructorIds,
      courseId: data.courseId,
      semesterId: data.semesterId
    }

    console.log("Created Request Object:", requestObject);

    createSubjectMutation.mutate(requestObject);
  };


  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) reset();
    }}>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-500 text-xl" />
              &nbsp;Add Subject
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-black text-xl font-bold">&times;</Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <input type="hidden" {...register("courseId")} />
            <input type="hidden" {...register("semesterId")} />

            {/* College Name */}
            <div className="space-y-1">
              <label className="form-field-label font-inter">Course Name</label>
              <Controller
                name="courseName"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    disabled
                    className="pt-2 border-0 form-field-input-text rounded-md w-full cursor-not-allowed"
                  />
                )}
              />
              {errors.courseName && (
                <p className="text-red-500 text-sm">{errors.courseName.message}</p>
              )}
            </div>


            {/* Academic Year & Semester */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="form-field-label font-inter">Academic Year</label>
                <Controller
                  name="academicYear"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled
                      className="pt-2 border-0 form-field-input-text rounded-md w-full cursor-not-allowed"
                    />
                  )}
                />
                {errors.courseName && (
                  <p className="text-red-500 text-sm">{errors.academicYear?.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="form-field-label font-inter">Semester</label>
                <Controller
                  name="semester"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      disabled
                      className="pt-2 border-0 form-field-input-text rounded-md w-full cursor-not-allowed"
                    />
                  )}
                />
                {errors.semester && (
                  <p className="text-red-500 text-sm">{errors.semester?.message}</p>
                )}
              </div>
            </div>

            {/* Subject Name and Subject Code */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="form-field-label font-inter">Subject Name</label>
                <Controller
                  name="subjectName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter the subject name"
                      className={`p-3 form-field-input-text border rounded-md w-full form-field-input-text ${!field.value ? "form-field-input-init-text" : ""
                        }`}
                    />
                  )}
                />
                {errors.subjectName && (
                  <p className="text-red-500 text-sm">{errors.subjectName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="form-field-label font-inter">Subject Code</label>
                <Controller
                  name="subjectCode"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Enter the subject Code"
                      className={`p-3 form-field-input-text border rounded-md w-full form-field-input-text ${!field.value ? "form-field-input-init-text" : ""
                        }`}
                    />
                  )}
                />
                {errors.subjectCode && (
                  <p className="text-red-500 text-sm">{errors.subjectCode.message}</p>
                )}
              </div>
            </div>

            {/* Instructors */}
            <div className="space-y-1">
              <label className="form-field-label font-inter">Instructors</label>
              <Controller
                name="instructor"
                control={control}
                render={({ field }) => (
                  <MultiSelectCustomDropdown
                    label="Select instructors"
                    options={instructorsInfo}
                    selected={field.value || []}
                    onChange={(newValues) => field.onChange(newValues)}
                    placeholder="Choose instructors"
                  />
                )}
              />
              {errors.instructor && (
                <p className="text-red-500 text-sm">{errors.instructor.message}</p>
              )}
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
}