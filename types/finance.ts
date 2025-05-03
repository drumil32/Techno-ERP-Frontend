import { FeesPaidStatus } from "./enum";

export interface StudentDue {
    _id: string;
    studentName: string;
    studentId: string;
    studentPhoneNumber: string;
    fatherName: string;
    fatherPhoneNumber: string;
    course: string;
    courseYear: string;
    semester: number;
    feeStatus: FeesPaidStatus;
    lastUpdated: Date;
    totalDue: number;
  }

  export interface StudentDuesApiResponse {
    dues: (StudentDue & { id: number })[]; // Add the 'id' field here
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

// ------------------------------------------------------------
// TEMP
// ------------------------------------------------------------

// For the top student/course details section
export interface StudentDetails {
  studentName: string;
  studentId: string;
  fatherName: string;
  feeStatus: 'No Dues' | 'Dues Pending' | string; // Use specific strings or a general string
  course: string;
  hod: string;
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

export interface CourseDue {
  _id: string;
  sno?: number;
  course: string;
  courseYear: string;
  numberOfStudents: number;
  totalDue: number;
  courseHead: string;
  courseHeadContact: string;
  // academicYear: string;
  // college: string;
}

export interface CourseDuesApiResponse {
  courseDues: CourseDue[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}