import {
  Course,
  CourseYear,
  FeeActions,
  FeesPaidStatus,
  FinanceFeeSchedule,
  FinanceFeeType,
  TransactionTypes
} from './enum';

export interface StudentDue {
  _id: string;
  courseName: string;
  currentSemester: number;
  feeStatus: FeesPaidStatus;
  universityId: string;
  studentName: string;
  studentPhoneNumber: string;
  fatherName: string;
  fatherPhoneNumber: string;
  courseYear: number;
  totalDueAmount: number;
}

export interface StudentDuesApiResponse {
  data: StudentDue[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface StudentFeeInformationResponse {
  _id: string;
  studentName: string;
  studentID: string;
  fatherName: string;
  HOD: string;
  course: Course;
  extraBalance?: number;
  feeStatus: FeesPaidStatus;
  currentSemester?: number;
  semesterWiseFeeInformation: SemesterWiseFeeInformation[];
  semesterBreakUp: SemesterBreakUp[];
  transactionHistory: Transaction[];
  step2And4Remark?: string;
}

export interface SemesterWiseFeeInformation {
  semesterNumber: number;
  academicYear: string;
  finalFee: number;
  paidAmount: number;
  dueDate?: string;
}

export interface SemesterBreakUp {
  semesterNumber: number;
  semesterId: string;
  details: {
    sno?: number;
    feeCategory: FinanceFeeType;
    feeDetailId: string;
    feeSchedule: FinanceFeeSchedule;
    finalFee: number;
    paidAmount: number;
    totalDues?: number;
    remark?:string;
  }[];
  
}

export interface Transaction {
  _id: string;
  studentId: string;
  dateTime: string;
  feeAction: FeeActions;
  amount: number;
  txnType: TransactionTypes;
  remark: string;
  transactionID: number;
  actionedBy: string;
}

export interface FeeHistoryRequestType {
  studentId: string;
  semesterId: string;
  detailId: string;
}

export interface FeeHistoryItemType {
  updatedAt: string;
  updatedFee: number;
  extraAmount: number;
  updatedBy?: string;
  remark?: string;
}

export interface FeeHistoryResponse {
  feeUpdateHistory: FeeHistoryItemType[];
}

export interface StudentDetails {
  studentName: string;
  studentID: string;
  fatherName: string;
  feeStatus: FeesPaidStatus;
  course: string;
  HOD: string;
  currentSemester?: number;
  extraBalance?: number;
  universityId?: string;
  step2And4Remark?: string;
}

// Course Dues

export interface CourseDuesRequest {
  date: string;
  college: string;
}

export interface CourseDues {
  _id: string;
  courseCode: Course;
  courseName: string;
  academicYear: string;
  date: string;
  departmentHODName: string;
  departmentHODEmail: string;
  dues: CourseDueItem[];
}

export interface CourseDueItem {
  _id: string;
  courseYear: CourseYear; // "FIRST | SECOND | THIRD | FOURTH"
  totalDue: number;
  dueStudentCount: number;
}

export interface CourseDueTableItem {
  sno: number;
  courseName: string;
  courseCode: string;
  courseYear: string;
  dueStudentCount: number;
  totalDue: number;
  departmentHODName: string;
  departmentHODEmail: string;
}

// Admin Tracker

export interface DayCollection {
  date: string;
  dailyCollection: number;
}

export interface MonthDayCollection {
  date: string;
  totalCollection: number;
}

export interface CourseCollection {
  courseName: string;
  details?: { courseYear: CourseYear; totalCollection: number }[];
  totalCollection?: number;
}

export interface DailyCollectionData {
  totalCollectionForThisDay: number;
  pastSevenDays: DayCollection[];
  courseWiseCollectionForThisDay: CourseCollection[];
}

export interface MonthlyCollectionData {
  totalCollectionForThisMonth: number;
  monthWiseData: MonthDayCollection[];
  courseWiseCollectionForThisMonth: CourseCollection[];
}
