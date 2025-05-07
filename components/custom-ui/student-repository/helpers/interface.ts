import { AdmissionMode, Category, CourseYear, FeeSchedule, FeeStatus, FeeType, Gender } from "@/types/enum";
import { PhysicalDocumentNoteStatus } from "./enum";

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

export interface FieldDefinition {
  label: string;
  value?: string | number | boolean;
}

export interface StudentListData {
  students: StudentListItem[];
  pagination: Pagination;
}

// Reuse only what's present in the response
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
  documents: any[];
  physicalDocumentNote: any[];
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
}

export interface Address {
  addressLine1: string;
  addressLine2: string;
  district: string;
  pincode: string;
  state: string;
  country: string;
  _id: string;
}

export interface Semester {
  semesterId: string;
  semesterNumber: number;
  academicYear: string;
  courseYear: CourseYear;
  subjects: Subject[];
  fees: Fees;
  _id: string;
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

export interface BaseAttendance {
  id?: string;
  attended?: boolean;
}

export interface Attendance {
  lecturePlan?: BaseAttendance[];
  practicalPlan?: BaseAttendance[];
  totalLectureAttendance?: number;
  totalPracticalAttendance?: number;
}

export interface Subject {
  subjectId: string;
  attendance: Attendance[];
  exams: Exam[];
  _id: string;
}

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

export interface Document {
  _id: string;
  id: string;
  type: string;
  status: PhysicalDocumentNoteStatus;
  dueBy?: Date;
}