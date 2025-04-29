import { FeesPaidStatus } from "./enum";

export interface StudentDue {
    _id: string; 
    studentName: string;
    studentId: string;
    studentPhoneNumber: string;
    fatherName: string;
    fatherPhoneNumber: string;
    course: string;
    courseYear: number;
    semester: number;
    feeStatus: FeesPaidStatus;
    lastUpdated: Date; 
  }

  export interface StudentDuesApiResponse {
    dues: (StudentDue & { id: number })[]; // Add the 'id' field here
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}
