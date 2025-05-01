export interface ColumnMeta {
    align?: string;
}

export interface Column {
    accessorKey: string;
    header: string;
    meta?: ColumnMeta;
}

export interface StudentRepoRow {
    _id: string;
    id: number;
    studentID: string;
    studentName: string;
    studentPhoneNumber: string;
    fatherName: string;
    fatherPhoneNumber: string;
    course: string;
    courseYear: string;
    semester: string;
    academicYear: string;
}

export interface FilterOption {
    label: string;
    id: string;
  }

export interface FilterData {
    filterKey: string;
    label: string;
    options: FilterOption[] | string[];
    hasSearch?: boolean;
    multiSelect?: boolean;
    isDateFilter?: boolean;
  }

export interface StudentData {
  id: string;
  name: string;
  fatherName: string;
  courseCode: string;
  studentPhone: string;
  fatherPhone: string;
  courseYear: string;
  formNo: string;
  semester: string;
  lurnNo: string;
}

export interface FieldDefinition {
  label: string;
  key: keyof StudentData;
}