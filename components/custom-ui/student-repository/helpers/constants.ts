import { SITE_MAP } from '@/common/constants/frontendRouting';
import { StudentRepositoryTabs } from './enum';
import { Column } from './interface';



export const columns: Column[] = [
  { accessorKey: 'id', header: 'S. No', meta: { align: 'center' } },
  { accessorKey: 'universityId', header: 'Student ID', meta: { align: 'center' } },
  { accessorKey: 'studentName', header: 'Student Name' },
  {
    accessorKey: 'studentPhoneNumber',
    header: "Student's Phone Number",
    meta: { align: 'center' }
  },
  { accessorKey: 'fatherName', header: 'Father Name' },
  { accessorKey: 'fatherPhoneNumber', header: "Father's Phone Number", meta: { align: 'center' } },
  { accessorKey: 'courseName', header: 'Course', meta: { align: 'center' } },
  { accessorKey: 'courseYear', header: 'Course Year', meta: { align: 'center' } },
  { accessorKey: 'currentSemester', header: 'Semester', meta: { align: 'center' } },
  { accessorKey: 'currentAcademicYear', header: 'Academic Year', meta: { align: 'center' } }
];

export const YearMap = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
