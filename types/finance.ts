import { Course, CourseYear, FeeActions, FeesPaidStatus, FinanceFeeSchedule, FinanceFeeType, TransactionTypes } from "./enum";

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
  }
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
  semesterWiseFeeInformation: SemesterWiseFeeInformation[];
  semesterBreakUp: SemesterBreakUp[];
  transactionHistory: Transaction[];
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
    feeCategory: FinanceFeeType;
    feeDetailId: string;
    feeSchedule: FinanceFeeSchedule;
    finalFee: number;
    paidAmount: number;
    totalDues?: number;
  }[]
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
}

export interface FeeHistoryResponse {
  feeUpdateHistory: FeeHistoryItemType[]
}

export interface StudentDetails {
  studentName: string;
  studentID: string;
  fatherName: string;
  feeStatus: FeesPaidStatus;
  course: string;
  HOD: string;
  extraBalance?: number;
  universityId?: string;
}

// For a single row in the Semester-wise Fees table
export interface SemesterFeeDetail {
  sno: number;
  academicYear: string;
  semester: number;
  course: string;
  finalFeesDue: number | null;
  feesPaid: number | null;
  dueFees: number | null;
  dueDate: string | null;
}

// For the response of the Semester-wise Fees API
export interface SemesterFeesResponse {
  details: SemesterFeeDetail[];
  totals: {
    finalFeesDue: number;
    feesPaid: number;
    dueFees: number;
  };
}


// For a single row in the All Transactions table
export interface TransactionDetail {
  sno: number;
  date: string; // Format: DD/MM/YY
  time: string; // Format: HH:MM
  transactionId: string;
  feesAction: 'Deposit' | 'Refund';
  amount: number | null; // Amount is null for Refund in the example
  transactionType: 'Cash' | 'Netbanking';
  remarks: string | null;
}

// For the response of the All Transactions API
export interface TransactionsResponse {
  transactions: TransactionDetail[];
  totalAmount: number; // Represents the net total considering deposits and refunds conceptually, but the image only shows total deposits.
}

// For a single row in the Fee Breakup table
export interface FeeBreakupItem {
  feesCategory: string;
  schedule: string;
  finalFees: number | null;
  feesPaid: number | null;
  totalDues: number | null;
}

// For the response of the Fee Breakup API
export interface FeeBreakupResponse {
  semester: number;
  breakup: FeeBreakupItem[];
  totals: {
    finalFees: number;
    feesPaid: number;
    totalDues: number;
  };
}

// Course Dues

// export interface CourseDue {
//   _id: string;
//   sno?: number;
//   course: string;
//   courseYear: string;
//   numberOfStudents: number;
//   totalDue: number;
//   courseHead: string;
//   courseHeadContact: string;
//   // academicYear: string;
//   // college: string;
// }

// export interface CourseDuesApiResponse {
//   courseDues: CourseDue[];
//   total: number;
//   totalPages: number;
//   currentPage: number;
//   limit: number;
// }

// Final

export interface CourseDuesRequest {
  date: string;
  college: string;
}

export interface CourseDues {
  _id: string;
  courseCode: Course;
  courseName: string;
  academicYear: string;
  date : string;
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
