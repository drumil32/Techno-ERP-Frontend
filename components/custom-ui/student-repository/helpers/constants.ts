import { Column } from './interface';

export const columns: Column[] = [
  { accessorKey: 'id', header: 'S. No' },
  { accessorKey: 'universityId', header: 'Student ID' },
  { accessorKey: 'studentName', header: 'Student Name' },
  {
    accessorKey: 'studentPhoneNumber',
    header: "Student's Phone Number",
    meta: { align: 'center' }
  },
  { accessorKey: 'fatherName', header: 'Father Name' },
  { accessorKey: 'fatherPhoneNumber', header: "Father's Phone Number" },
  { accessorKey: 'courseName', header: 'Course' },
  { accessorKey: 'courseYear', header: 'Course Year' },
  { accessorKey: 'currentSemester', header: 'Semester' },
  { accessorKey: 'currentAcademicYear', header: 'Academic Year' }
];

export const YearMap = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
