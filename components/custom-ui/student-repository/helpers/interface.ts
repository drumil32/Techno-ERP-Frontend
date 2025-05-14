// Enums and Imports
import {
  AdmissionMode,
  Category,
  CourseYear,
  FeeSchedule,
  FeeStatus,
  FeeType,
  Gender
} from '@/types/enum';
import { PhysicalDocumentNoteStatus } from './enum';

// Table and UI-related Interfaces
// These interfaces are used for table columns and filters in the UI
export interface ColumnMeta {
  align?: string;
}

export interface Column {
  accessorKey: string;
  header: string;
  meta?: ColumnMeta;
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

// Student List and Pagination Interfaces
// These interfaces are used for listing students and handling pagination
export interface StudentListData {
  students: StudentListItem[];
  pagination: Pagination;
}

export interface StudentListItem {
  _id: string;
  courseName: string;
  currentYear: number;
  currentSemester: number;
  currentAcademicYear: string;
  universityId: string;
  studentName: string;
  studentPhoneNumber: string;
  fatherName: string;
  fatherPhoneNumber: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Detailed Student Data Interfaces
// These interfaces represent detailed information about a student
export interface StudentData {
  _id: string;
  studentInfo: StudentInfo;
  courseId: string;
  departmentMetaDataId: string;
  departmentName: string;
  courseName: string;
  courseCode: string;
  startingYear: string;
  currentSemester: number;
  currentAcademicYear: string;
  totalSemester: number;
  semester: Semester[];
  cumulativeCGPA?: number;
  cumulativeCPGA?: number;
  feeStatus: FeeStatus;
  extraBalance: number;
  transactionHistory: any[];
}

export interface EntranceExamDetails {
  nameOfExamination?: string;
  rollNumber?: string;
  rank?: number;
  qualified?: boolean;
}

export interface StudentInfo {
  universityId: string;
  photoNo: number;
  formNo: string;
  studentName: string;
  studentPhoneNumber: string;
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;
  dateOfBirth: string; // ISO date
  category: Category;
  course: string;
  reference: string;
  address: Address;
  academicDetails: any[];
  documents: DocumentWithFileUrl[];
  physicalDocumentNote: Document[];
  gender: Gender;
  admittedThrough: AdmissionMode;
  _id: string;
  lurnRegistrationNo: string;
  emailId?: string;
  religion?: string;
  bloodGroup?: string;
  aadharNumber?: string;
  stateOfDomicile?: string;
  areaType?: string;
  nationality?: string;
  entranceExamDetails?: EntranceExamDetails;
}

// Address Interfaces
// These interfaces represent address-related data
export interface Address {
  addressLine1: string;
  addressLine2: string;
  district: string;
  pincode: string;
  state: string;
  country: string;
  _id: string;
}

// Semester and Subject Interfaces
// These interfaces represent semester and subject-related data
export interface Semester {
  semesterId: string;
  semesterNumber: number;
  academicYear: string;
  courseYear: CourseYear;
  subjects: Subject[];
  fees: Fees;
  _id: string;
}

export interface Subject {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  attendance: Attendance[];
  exams: Exam[];
  instructor: string[];
  _id: string;
}

// Attendance and Exam Interfaces
// These interfaces represent attendance and exam-related data
export interface Attendance {
  lecturePlan?: BaseAttendance[];
  practicalPlan?: BaseAttendance[];
  totalLectureAttendance?: number;
  totalPracticalAttendance?: number;
}

export interface BaseAttendance {
  id?: string;
  attended?: boolean;
}

export interface Exam {
  theory?: BaseExam[];
  practical?: BaseExam[];
  totalMarks?: number;
}

export interface BaseExam {
  type?: string;
  marks?: number;
}

// Fee-related Interfaces
// These interfaces represent fee-related data
export interface Fees {
  details: FeeDetail[];
  paidAmount: number;
  totalFinalFee: number;
  _id: string;
}

export interface FeeDetail {
  type: FeeType;
  schedule: FeeSchedule;
  actualFee: number;
  finalFee: number;
  paidAmount: number;
  remark: string;
  _id: string;
}

// Document Interfaces
// These interfaces represent document-related data
export interface Document {
  _id: string;
  id: string;
  type: string;
  status: PhysicalDocumentNoteStatus;
  dueBy?: string;
}

export interface DocumentWithFileUrl {
  dueBy: string;
  type: string;
  fileUrl: string;
  _id: string;
}

// Miscellaneous Interfaces
// These interfaces represent other reusable data structures
export interface FieldDefinition {
  label: string;
  value?: string | number | boolean;
}
