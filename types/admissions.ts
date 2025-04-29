import {
  FeeType,
  FeeStatus,
  Districts,
  Countries,
  StatesOfIndia,
  AdmissionMode,
  Gender,
  AreaType,
  Category,
  Course,
  AdmissionReference,
  EducationLevel
} from './enum';

interface EntranceExamDetails {
  nameOfExamination?: string;
  rollNumber?: string;
  rank?: string;
  qualified?: boolean;
}

export interface PreviousCollegeData {
  _id: string;
  collegeName?: string;
  district?: string;
  boardUniversity?: string;
  passingYear: number;
  aggregatePercentage: number;
}

/** Address Type */
export interface Address {
  _id: string;
  country: Countries;
  district: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  state: StatesOfIndia;
}

/** Academic Details */
export interface AcademicDetail {
  _id: string;
  educationLevel: EducationLevel;
  schoolCollegeName: string;
  universityBoardName: string;
  passingYear: number;
  percentageObtained: number;
  subjects?: string[];
}

interface DocumentBuffer {
  buffer: Buffer;
  mimetype: 'image/png' | 'image/jpeg' | 'image/jpg' | 'application/pdf';
  size: number;
  originalname: string;
}

/** Document Details */
export interface Document {
  _id: string;
  type: string;
  documentBuffer?: DocumentBuffer;
  fileUrl?: string;
  dueBy?: string; // Date in ISO string format
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
  feesClearanceDate: string;
  counsellor: string[];
  telecaller: string[];
}

export interface OtherFees {
  type: FeeType;
  fee: number;
  finalFee?: number;
  feesDepositedTOA?: number;
}

interface SingleSem {
  feeAmount: number;
  finalFee: number;
}

interface StudentFees {
  otherFees?: OtherFees[];
  semWiseFees: SingleSem[];
  feeStatus?: string;
  feesClearanceDate: string;
  counsellor?: string;
  telecaller?: string;
  remarks?: string;
}

/** Admission Type */
export interface Admission {
  _id: string;
  admissionMode: AdmissionMode;
  studentName: string;
  studentPhoneNumber: string;
  emailId?: string;
  fatherName: string;
  fatherPhoneNumber: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherOccupation: string;
  dateOfBirth: string;
  category: Category;
  course: Course;
  reference: AdmissionReference;
  address: Address;
  academicDetails?: AcademicDetail[];
  dateOfEnquiry?: string;
  gender: Gender;
  previousCollegeData?: PreviousCollegeData;
  stateOfDomicile?: string;
  areaType?: AreaType;
  nationality?: string;
  entranceExamDetails?: EntranceExamDetails;
  counsellor: string[];
  telecaller: string[];
  remarks?: string;
  applicationStatus: string;
  studentFee?: StudentFee;
  studentFeeDraft?: StudentFee;
  dateOfAdmission?: string;
  documents?: Document[];
  aadharNumber?: string;
  religion?: string;
  bloodGroup?: string;
  admittedBy?: string;
  collegeName?: string;
  affiliation?: string;
}

/** Admission Table Row Type */
export interface AdmissionTableRow extends Admission {
  id: number;
  genderDisplay: string;
  district: string;
}
