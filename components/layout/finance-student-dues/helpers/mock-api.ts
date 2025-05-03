import { FeesPaidStatus } from "@/types/enum";
import { CourseDue, FeeBreakupResponse, SemesterFeesResponse, StudentDetails, StudentDue, TransactionsResponse } from "@/types/finance";
import { QueryFunctionContext } from "@tanstack/react-query";

const generateMockStudentDues = (count: number): StudentDue[] => {
  const courses = ['B.Tech CSE', 'B.Tech ECE', 'MBA', 'BCA', 'MCA'];
  const statuses = Object.values(FeesPaidStatus);
  const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan'];
  const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Reddy', 'Naidu', 'Malhotra'];

  const dues: StudentDue[] = [];
  for (let i = 1; i <= count; i++) {
    const studentFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const studentLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fatherFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const fatherLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const courseYear = Math.floor(Math.random() * 4) + 1;
    const semester = (courseYear - 1) * 2 + (Math.floor(Math.random() * 2) + 1);

    dues.push({
      _id: `stud_${i.toString().padStart(5, '0')}`,
      studentName: `${studentFirstName} ${studentLastName}`,
      studentId: `TCH${new Date().getFullYear()}${i.toString().padStart(4, '0')}`,
      studentPhoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
      fatherName: `${fatherFirstName} ${fatherLastName}`,
      fatherPhoneNumber: `8${Math.floor(100000000 + Math.random() * 900000000)}`,
      course: course,
      courseYear: courseYear,
      semester: semester,
      feeStatus: statuses[Math.floor(Math.random() * statuses.length)],
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000) // Random date in last 30 days
    });
  }
  return dues;
};

const allMockDues = generateMockStudentDues(100); // Generate more mock data for better testing

export const fetchStudentDuesMock = async ({ queryKey }: any) => {
  // Safe extraction of parameters with type checking and defaults
  const [_key, params] = queryKey;
  
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const search = params?.search || '';
  const sortBy = params?.sortBy || ['studentName'];
  const orderBy = params?.orderBy || ['asc'];

  // Add a small delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = [...allMockDues]; // Create a copy to avoid mutation issues
  
  // Apply search filter if provided
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredData = filteredData.filter((due) =>
      due.studentName.toLowerCase().includes(searchTerm) ||
      due.studentId.toLowerCase().includes(searchTerm) ||
      due.studentPhoneNumber.includes(searchTerm) ||
      due.fatherName.toLowerCase().includes(searchTerm) ||
      due.fatherPhoneNumber.includes(searchTerm) ||
      due.course.toLowerCase().includes(searchTerm)
    );
  }

  // Apply sorting if provided
  if (sortBy?.[0] && orderBy?.[0]) {
    const sortField = sortBy[0] as keyof StudentDue;
    const sortOrder = orderBy[0];

    filteredData.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      // Handle undefined values during comparison
      if (valA === undefined && valB === undefined) return 0;
      if (valA === undefined) return 1;
      if (valB === undefined) return -1;

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }

      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  }

  // Apply pagination
  const total = filteredData.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Add sequential id for display
  const dataWithSno = paginatedData.map((item, index) => ({
    ...item,
    id: startIndex + index + 1,
  }));

  return {
    dues: dataWithSno,
    total,
    totalPages,
    currentPage: page,
    limit
  };
};

// Mock student details
const mockStudentDetails: StudentDetails = {
  studentName: "Vaibhav Gupta",
  studentId: "TGI2023MBA104",
  fatherName: "Anil Kumar Gupta",
  feeStatus: "No Dues",
  course: "MBA",
  hod: "Dr Pankaj kumar",
};

// Mock semester fees
const mockSemesterFees: SemesterFeesResponse = {
  details: [
    {
      sno: 1,
      academicYear: "2023-24",
      semester: 1,
      course: "MBA",
      finalFeesDue: 18100,
      feesPaid: 5000,
      dueFees: 13100,
      dueDate: "02/20/25",
    },
    {
      sno: 2,
      academicYear: "2023-24",
      semester: 2,
      course: "MBA",
      finalFeesDue: null,
      feesPaid: null,
      dueFees: null,
      dueDate: null,
    },
    {
      sno: 3,
      academicYear: "2025-26",
      semester: 3,
      course: "MBA",
      finalFeesDue: null,
      feesPaid: null,
      dueFees: null,
      dueDate: null,
    },
    {
      sno: 4,
      academicYear: "2025-26",
      semester: 4,
      course: "MBA",
      finalFeesDue: null,
      feesPaid: null,
      dueFees: null,
      dueDate: null,
    },
  ],
  totals: {
    finalFeesDue: 18100,
    feesPaid: 5000,
    dueFees: 13100,
  },
};

// Mock transactions
const mockTransactions: TransactionsResponse = {
  transactions: [
    {
      sno: 1,
      date: "12/01/23",
      time: "15:25",
      transactionId: "349087",
      feesAction: "Deposit",
      amount: 18100,
      transactionType: "Cash",
      remarks: null,
    },
    {
      sno: 2,
      date: "12/02/23",
      time: "14:32",
      transactionId: "829122",
      feesAction: "Refund",
      amount: null,
      transactionType: "Netbanking",
      remarks: null,
    },
    {
      sno: 3,
      date: "12/07/24",
      time: "12:12",
      transactionId: "829234",
      feesAction: "Deposit",
      amount: null,
      transactionType: "Netbanking",
      remarks: null,
    },
    {
      sno: 4,
      date: "27/11/24",
      time: "17:46",
      transactionId: "829759",
      feesAction: "Deposit",
      amount: null,
      transactionType: "Netbanking",
      remarks: null,
    },
  ],
  totalAmount: 18100,
};

// Mock fee breakup for semester 1
const mockFeeBreakupSemester1: FeeBreakupResponse = {
  semester: 1,
  breakup: [
    {
      feesCategory: "Prospectus Fees",
      schedule: "One-time",
      finalFees: 1000,
      feesPaid: null,
      totalDues: 1000,
    },
    {
      feesCategory: "Student ID",
      schedule: "One-time",
      finalFees: 100,
      feesPaid: null,
      totalDues: 100,
    },
    {
      feesCategory: "Uniform",
      schedule: "One-time",
      finalFees: 4000,
      feesPaid: 3600,
      totalDues: 4000,
    },
    {
      feesCategory: "Semester Fees",
      schedule: "Semester",
      finalFees: 13000,
      feesPaid: 5000,
      totalDues: 8000,
    },
    {
      feesCategory: "Student Welfare",
      schedule: "Yearly",
      finalFees: null,
      feesPaid: null,
      totalDues: 100,
    },
    {
      feesCategory: "Book Bank",
      schedule: "Semester",
      finalFees: 100,
      feesPaid: null,
      totalDues: null,
    },
    {
      feesCategory: "Misc",
      schedule: "As applicable",
      finalFees: null,
      feesPaid: null,
      totalDues: null,
    },
    {
      feesCategory: "Hostel Fees",
      schedule: "Optional",
      finalFees: null,
      feesPaid: null,
      totalDues: null,
    },
    {
      feesCategory: "Transport Fees",
      schedule: "Optional",
      finalFees: null,
      feesPaid: null,
      totalDues: null,
    },
  ],
  totals: {
    finalFees: 18100,
    feesPaid: 8600,
    totalDues: 9600,
  },
};

// Mock fee breakup for semester 2
const mockFeeBreakupSemester2: FeeBreakupResponse = {
  semester: 2,
  breakup: [
    {
      feesCategory: "Prospectus Fees",
      schedule: "One-time",
      finalFees: 1000,
      feesPaid: null,
      totalDues: 1000,
    },
    {
      feesCategory: "Student ID",
      schedule: "One-time",
      finalFees: 100,
      feesPaid: null,
      totalDues: 100,
    },
    {
      feesCategory: "Uniform",
      schedule: "One-time",
      finalFees: 4000,
      feesPaid: 3600,
      totalDues: 4000,
    },
    {
      feesCategory: "Semester Fees",
      schedule: "Semester",
      finalFees: 13000,
      feesPaid: 5000,
      totalDues: 8000,
    },
    {
      feesCategory: "Student Welfare",
      schedule: "Yearly",
      finalFees: null,
      feesPaid: null,
      totalDues: 100,
    },
    {
      feesCategory: "Book Bank",
      schedule: "Semester",
      finalFees: 100,
      feesPaid: null,
      totalDues: null,
    },
    {
      feesCategory: "Misc",
      schedule: "As applicable",
      finalFees: null,
      feesPaid: null,
      totalDues: null,
    },
    {
      feesCategory: "Hostel Fees",
      schedule: "Optional",
      finalFees: null,
      feesPaid: null,
      totalDues: null,
    },
    {
      feesCategory: "Transport Fees",
      schedule: "Optional",
      finalFees: null,
      feesPaid: null,
      totalDues: null,
    },
  ],
  totals: {
    finalFees: 0,
    feesPaid: 0,
    totalDues: 0,
  }
};

export const fetchStudentDetails = async ({ queryKey }: QueryFunctionContext): Promise<StudentDetails> => {
  const [_key, studentId] = queryKey as [string, string];
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStudentDetails;
};

export const fetchSemesterFees = async ({ queryKey }: QueryFunctionContext): Promise<SemesterFeesResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSemesterFees;
};

export const fetchTransactions = async ({ queryKey }: QueryFunctionContext): Promise<TransactionsResponse> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockTransactions;
};

export const fetchFeeBreakup = async ({ queryKey }: QueryFunctionContext): Promise<FeeBreakupResponse> => {
  const [_key, semester] = queryKey as [string, number];
  await new Promise(resolve => setTimeout(resolve, 400));
  if (semester === 1) {
    return mockFeeBreakupSemester1;
  } else if (semester === 2) {
    return mockFeeBreakupSemester2;
  }
  return {
    semester: semester,
    breakup: [],
    totals: { finalFees: 0, feesPaid: 0, totalDues: 0 }
  };
};

