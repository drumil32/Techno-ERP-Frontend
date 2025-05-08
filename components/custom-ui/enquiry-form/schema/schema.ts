// External Libraries
import { z, ZodIssueCode } from 'zod';

// Common Schemas
import {
  addressSchema,
  contactNumberSchema,
  previousCollegeDataSchema,
  requestDateSchema
} from '@/common/constants/schemas';

// Enums
import {
  AdmissionMode,
  AdmissionReference,
  AdmittedThrough,
  ApplicationStatus,
  AreaType,
  BloodGroup,
  Category,
  DocumentType,
  EducationLevel,
  Gender,
  Religion,
  StatesOfIndia
} from '@/types/enum';

export const entranceExamDetailSchema = z.object({
  nameOfExamination: z.string().optional(),
  rollNumber: z.string().optional(),
  rank: z.number().optional(),
  qualified: z.boolean().optional()
});

// Define the base schema without refinements
export const academicDetailBaseSchema = z.object({
  // Keep educationLevel required to identify the section
  educationLevel: z.nativeEnum(EducationLevel),

  // Make other fields optional at the base level for the object structure
  schoolCollegeName: z
    .string()
    // Keep regex for when value is present
    .regex(/^[A-Za-z\s]+$/, 'School/College Name must only contain alphabets and spaces')
    .optional(),
  universityBoardName: z
    .string()
    // Keep regex for when value is present
    .regex(/^[A-Za-z\s]+$/, 'University/Board Name must only contain alphabets and spaces')
    .optional(),
  passingYear: z.number().int().optional(), // Keep refinements for when value is present
  percentageObtained: z.number().optional(), // Keep refinements for when value is present
  subjects: z
    .string()
    .nonempty('Subject name is required') // Validate inner string if array present
    .optional()
});

// Create the partial version for use in draft schemas
export const academicDetailPartialSchema = academicDetailBaseSchema.partial();

export const academicDetailSchema = z.object({
  educationLevel: z.nativeEnum(EducationLevel), // Only allows fixed values
  schoolCollegeName: z.string().min(1, 'School/College Name is required'),
  universityBoardName: z.string().min(1, 'University/Board Name is required'),
  passingYear: z
    .number()
    .int()
    .refine((year) => year.toString().length === 4, {
      message: 'Passing Year must be a valid 4-digit year'
    }),
  percentageObtained: z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100'),
  subjects: z.string().nonempty('Subjects cannot be empty').optional()
});
// Array schema
export const academicDetailsArraySchema = z.array(academicDetailSchema);

export const singleDocumentSchema = z.object({
  type: z.nativeEnum(DocumentType),
  documentBuffer: z
    .object({
      buffer: z.instanceof(Buffer),
      mimetype: z.string(),
      size: z
        .number()
        .positive()
        .max(5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
      originalname: z.string()
    })
    .refine(
      (file) => ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.mimetype),
      { message: 'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.' }
    )
    .optional(),
  dueBy: requestDateSchema.optional(),
  fileUrl: z.string().optional()
});

export const academicDetailsPartialArraySchema = z.array(academicDetailPartialSchema);
export enum PhysicalDocumentNoteStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}
export const physicalDocumentNoteSchema = z.object({
  type: z.string().optional(),
  status: z.nativeEnum(PhysicalDocumentNoteStatus),
  dueBy: requestDateSchema.optional()
});

export const enquirySchema = z.object({
  _id: z.string().optional(),
  admissionMode: z.nativeEnum(AdmissionMode).default(AdmissionMode.OFFLINE),
  dateOfEnquiry: requestDateSchema.optional(),
  studentName: z
    .string({ required_error: 'Student Name is required' })
    .regex(/^[A-Za-z\s]+$/, 'Student Name must only contain alphabets and spaces')
    .nonempty('Student Name is required'),
  studentPhoneNumber: contactNumberSchema,
  emailId: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format')
    .nonempty('Email is required'),
  fatherName: z
    .string({ required_error: 'Father Name is required' })
    .regex(/^[A-Za-z\s]+$/, 'Father Name must only contain alphabets and spaces')
    .nonempty("Father's Name is required"),
  fatherPhoneNumber: contactNumberSchema,
  fatherOccupation: z
    .string({ required_error: 'Father occupation is required' })
    .regex(/^[A-Za-z\s]+$/, 'Father occupation must only contain alphabets and spaces')
    .nonempty('Father occupation is required'),
  motherName: z
    .string({ required_error: "Mother's Name is required" })
    .regex(/^[A-Za-z\s]+$/, 'Mother Name must only contain alphabets and spaces')
    .nonempty("Mother's Name is required"),
  motherPhoneNumber: contactNumberSchema.optional(),
  motherOccupation: z
    .string({ required_error: 'Mother occupation is required' })
    .regex(/^[A-Za-z\s]+$/, 'Mother occupation must only contain alphabets and spaces')
    .nonempty('Mother occupation is required'),
  gender: z.nativeEnum(Gender),
  dateOfBirth: requestDateSchema,
  category: z.nativeEnum(Category),
  course: z.string(),
  reference: z.nativeEnum(AdmissionReference),

  // Address Details
  address: addressSchema,

  // Academic Details
  academicDetails: academicDetailsArraySchema.optional(),

  // Filled By College Details
  telecaller: z.array(z.string()).optional(),
  counsellor: z.array(z.string()).optional(),
  remarks: z.string().optional(),

  approvedBy: z.string().optional(),
  applicationStatus: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.STEP_1),

  studentFee: z.string().optional(),
  studentFeeDraft: z.string().optional(),
  dateOfAdmission: requestDateSchema,

  documents: z.array(singleDocumentSchema).optional(),

  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, 'Aadhar Number must be exactly 12 digits')
    .optional(),
  physicalDocumentNote: z.array(physicalDocumentNoteSchema).optional(),
  religion: z.nativeEnum(Religion).optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  previousCollegeData: previousCollegeDataSchema.optional(),
  stateOfDomicile: z.nativeEnum(StatesOfIndia).optional(),
  areaType: z.nativeEnum(AreaType).optional(),
  nationality: z.string().optional(),
  entranceExamDetails: entranceExamDetailSchema.optional(),
  admittedBy: z.union([z.string(), z.enum(['other'])]).optional()
});

export enum Qualification {
  Yes = 'Yes',
  No = 'No'
}

export enum Nationality {
  INDIAN = 'INDIAN',
  NRI = 'NRI',
  PIO = 'PIO',
  OCI = 'OCI',
  FOREIGN_NATIONAL = 'FOREIGN_NATIONAL',
  BHUTANESE = 'BHUTANESE',
  NEPALESE = 'NEPALESE',
  AFGHAN = 'AFGHAN',
  BANGLADESHI = 'BANGLADESHI',
  PAKISTANI = 'PAKISTANI',
  SRI_LANKAN = 'SRI_LANKAN',
  MALDIVIAN = 'MALDIVIAN',
  TIBETAN_REFUGEE = 'TIBETAN_REFUGEE',
  STATELESS = 'STATELESS'
}

export const enquiryStep1RequestSchema = enquirySchema
  .omit({
    studentFee: true,
    studentFeeDraft: true,
    dateOfAdmission: true,
    bloodGroup: true,
    aadharNumber: true,
    religion: true,
    previousCollegeData: true,
    documents: true,
    applicationStatus: true,
    entranceExamDetails: true,
    nationality: true,
    stateOfDomicile: true,
    areaType: true,
    admittedBy: true
  })
  .extend({ id: z.string().optional() })
  .strict();

export const enquiryStep1UpdateRequestSchema = enquiryStep1RequestSchema
  .extend({
    id: z.string()
  })
  .strict();

export const enquiryStep3UpdateRequestSchema = enquirySchema
  .omit({ documents: true, studentFee: true })
  .extend({
    id: z.string()
  })
  .strict();

export type IEntranceExamDetailSchema = z.infer<typeof entranceExamDetailSchema>;

export const enquiryDraftStep3Schema = enquiryStep3UpdateRequestSchema
  .extend({
    address: addressSchema.partial().optional(),
    academicDetails: academicDetailsPartialArraySchema.optional(),
    studentName: z
      .string({ required_error: 'Student Name is required' })
      .regex(/^[A-Za-z\s]+$/, 'Student Name must only contain alphabets and spaces')
      .nonempty('Student Name is required'),
    studentPhoneNumber: contactNumberSchema,
    counsellor: z.array(z.union([z.string(), z.enum(['other'])])).optional(),
    telecaller: z.array(z.union([z.string(), z.enum(['other'])])).optional(),
    dateOfAdmission: requestDateSchema,
    dateOfBirth: requestDateSchema.optional(),
    entranceExamDetails: entranceExamDetailSchema.partial().optional()
  })
  .strict();

export const enquiryDraftStep1RequestSchema = enquiryStep1RequestSchema
  .extend({
    studentName: z
      .string({ required_error: 'Student Name is required' })
      .regex(/^[A-Za-z\s]+$/, 'Student Name must only contain alphabets and spaces')
      .nonempty('Student Name is required'),
    studentPhoneNumber: contactNumberSchema,

    counsellor: z.array(z.union([z.string(), z.enum(['other'])])).optional(),
    telecaller: z.array(z.union([z.string(), z.enum(['other'])])).optional(),

    address: addressSchema.partial().optional(),
    academicDetails: academicDetailsPartialArraySchema.optional()
  })
  .omit({ id: true })
  .strict();

export const enquiryDraftStep1UpdateSchema = enquiryDraftStep1RequestSchema
  .extend({
    id: z.string()
  })
  .partial()
  .strict();

export type IEnquiryStep1RequestSchema = z.infer<typeof enquiryStep1RequestSchema>;
export type IEnquiryDraftStep1RequestSchema = z.infer<typeof enquiryDraftStep1RequestSchema>;
export type IEnquiryDraftStep1UpdateSchema = z.infer<typeof enquiryDraftStep1UpdateSchema>;
export type IEnquirySchema = z.infer<typeof enquirySchema>;
export type IEnquiryDraftStep3Schema = z.infer<typeof enquiryDraftStep3Schema>;
export type IAcademicDetailSchema = z.infer<typeof academicDetailSchema>;
export type IAcademicDetailArraySchema = z.infer<typeof academicDetailsArraySchema>;
export type IAcademicDetailPartialSchema = z.infer<typeof academicDetailPartialSchema>;
