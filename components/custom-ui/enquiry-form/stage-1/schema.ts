// External Libraries
import { z } from 'zod';

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
  BloodGroup,
  Category,
  Course,
  DocumentType,
  EducationLevel,
  Gender,
  Religion
} from '@/types/enum';

export const academicDetailSchema = z.object({
  educationLevel: z.nativeEnum(EducationLevel),
  schoolCollegeName: z
    .string()
    .min(1, 'School/College Name is required')
    .regex(/^[A-Za-z\s]+$/, 'School/College Name must only contain alphabets and spaces'),
  universityBoardName: z
    .string()
    .min(1, 'University/Board Name is required')
    .regex(/^[A-Za-z\s]+$/, 'University/Board Name must only contain alphabets and spaces'),
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
  subjects: z.array(z.string().min(1, 'Subject name is required'))
});

export const singleDocumentSchema = z.object({
  enquiryId: z.string(),
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
});

export const academicDetailsArraySchema = z.array(academicDetailSchema);

export const enquirySchema = z.object({
  _id: z.string().optional(),
  // Student Details
  admissionMode: z.nativeEnum(AdmissionMode).default(AdmissionMode.OFFLINE),
  dateOfEnquiry: requestDateSchema,
  studentName: z
    .string({ required_error: 'Student Name is required' })
    .regex(/^[A-Za-z\s]+$/, 'Student Name must only contain alphabets and spaces')
    .nonempty('Student Name is required'),

  studentPhoneNumber: contactNumberSchema,
  emailId: z.string().email('Invalid email format').optional(),
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
  motherPhoneNumber: contactNumberSchema,
  motherOccupation: z
    .string({ required_error: 'Mother occupation is required' })
    .regex(/^[A-Za-z\s]+$/, 'Mother occupation must only contain alphabets and spaces')
    .nonempty('Mother occupation is required'),
  dateOfBirth: requestDateSchema,
  category: z.nativeEnum(Category),
  gender: z.nativeEnum(Gender).default(Gender.NOT_TO_MENTION),
  course: z.nativeEnum(Course),
  reference: z.nativeEnum(AdmissionReference),

  // Address Details
  address: addressSchema,

  previousCollegeData: previousCollegeDataSchema.optional(),

  academicDetails: academicDetailsArraySchema.optional(),

  applicationStatus: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.STEP_1),

  studentFee: z.string().optional(),
  studentFeeDraft: z.string().optional(),
  dateOfAdmission: requestDateSchema,

  documents: z.array(singleDocumentSchema).optional(),

  aadharNumber: z
    .string()
    .regex(/^\d{12}$/, 'Aadhar Number must be exactly 12 digits')
    .optional(),
  religion: z.nativeEnum(Religion).optional(),
  bloodGroup: z.nativeEnum(BloodGroup).optional(),
  admittedThrough: z.nativeEnum(AdmittedThrough),

  // Filled By College Details
  dateOfCounselling: requestDateSchema,
  remarks: z.string().optional(),
  approvedBy: z.string().optional(),
  telecaller: z.array(z.string()).optional(),
  counsellor: z.array(z.string()).optional()
});

export const enquiryStep1RequestSchema = enquirySchema
  .omit({
    studentFee: true,
    dateOfAdmission: true,
    bloodGroup: true,
    admittedThrough: true,
    aadharNumber: true,
    religion: true,
    previousCollegeData: true,
    documents: true,
    applicationStatus: true
  })
  .strict();

export const enquiryDraftStep1RequestSchema = enquiryStep1RequestSchema
  .extend({
    _id: z.string().optional(),
    studentName: z
      .string({ required_error: 'Student Name is required' })
      .regex(/^[A-Za-z\s]+$/, 'Student Name must only contain alphabets and spaces')
      .nonempty('Student Name is required'),
    studentPhoneNumber: contactNumberSchema,
    counsellor: z.string().optional(),
    telecaller: z.string().optional(),
    dateOfCounselling: requestDateSchema.optional(),
    address: addressSchema.partial().optional(),
    academicDetails: z.array(academicDetailSchema.partial()).optional()
  })
  .partial()
  .strip();

export const enquiryDraftStep1UpdateSchema = enquiryDraftStep1RequestSchema
  .extend({
    id: z.string().optional() // This is referring to _id in the enquiryDraftsTable
  })
  .partial()
  .strict();
