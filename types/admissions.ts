import { FeeType, FeeStatus } from "./enum";

/** Address Type */
export interface Address {
  _id: string;
  country: string;
  district: string;
  landMark?: string;
  pincode: string;
  state: string;
}

/** Academic Details */
export interface AcademicDetail {
  _id: string;
  educationLevel: string;
  schoolCollegeName: string;
  universityBoardName: string;
  passingYear: number;
  percentageObtained: number;
  subjects: string[];
}

/** Document Details */
export interface Document {
  _id: string;
  type: string;
  fileUrl: string;
  dueBy: string; // Date in ISO string format
}

/** Other Fees Structure */
export interface OtherFees {
  _id: string;
  type: FeeType;
  feeAmount: number | undefined;
  finalFee: number | undefined;
  feesDepositedTOA: number | undefined;
  remarks?: string;
}

/** Semester-wise Fees */
export interface SemesterFees {
  feeAmount: number;
  finalFee: number;
}

/** Student Fee Details */
export interface StudentFee {
  _id: string;
  otherFees: OtherFees[];
  semWiseFees: SemesterFees[];
  feeStatus: FeeStatus;
  feesClearanceDate: string; // Date in string format (DD/MM/YYYY)
}

/** Admission Type */
export interface Admission {
  _id: string;
  admissionMode: string;
  affiliation: string;
  dateOfEnquiry: string;
  studentName: string;
  studentPhoneNumber: string;
  emailId: string;
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;
  dateOfBirth: string;
  category: string;
  course: string;
  reference: string;
  collegeName: string;
  address: Address;
  academicDetails: AcademicDetail[];
  counsellorName: string[];
  telecallerName: string[];
  dateOfCounselling: string;
  remarks?: string;
  gender: string;
  applicationStatus: string;
  documents: Document[];
  studentFeeDraft?: string;
  studentFee?: StudentFee;
}

/** Admission Table Row Type */
export interface AdmissionTableRow extends Admission {
  id: number;
  genderDisplay: string;
  district: string;
}
