import { Column } from "./interface";

export const columns: Column[] = [
    { accessorKey: 'id', header: 'S. No', meta: { align: 'center' } },
    { accessorKey: 'studentID', header: 'Student ID' },
    { accessorKey: 'studentName', header: 'Student Name' },
    { accessorKey: 'studentPhoneNumber', header: 'Student\'s Phone Number' },
    { accessorKey: 'fatherName', header: 'Father Name' },
    { accessorKey: 'fatherPhoneNumber', header: 'Father\'s Phone Number' },
    { accessorKey: 'course', header: 'Course' },
    { accessorKey: 'courseYear', header: 'Course Year' },
    { accessorKey: 'semester', header: 'Semester' },
    { accessorKey: 'academicYear', header: 'Academic Year' },
];