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
  Course,
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
  passingYear: z
    .number()
    .int()
    .optional(), // Keep refinements for when value is present
  percentageObtained: z
    .number()
    .optional(), // Keep refinements for when value is present
  subjects: z
    .array(z.string().min(1, 'Subject name is required')) // Validate inner string if array present
    .optional()
});

// Create the partial version for use in draft schemas
export const academicDetailPartialSchema = academicDetailBaseSchema.partial();

// Create the fully validated version with refinements
export const academicDetailSchema = academicDetailBaseSchema.superRefine((data, ctx) => {
    // Helper function to check if any field *other than* educationLevel has data
    const isEffectivelyEmpty = (
        (data.schoolCollegeName === null || data.schoolCollegeName === undefined || data.schoolCollegeName === '') &&
        (data.universityBoardName === null || data.universityBoardName === undefined || data.universityBoardName === '') &&
        (data.passingYear === null || data.passingYear === undefined) &&
        (data.percentageObtained === null || data.percentageObtained === undefined) &&
        (data.subjects === null || data.subjects === undefined || data.subjects.length === 0)
    );

    // If the object is effectively empty (only educationLevel might be present), it's valid. Do nothing.
    if (isEffectivelyEmpty) {
        return;
    }

    // --- If NOT empty, enforce the original requirements for the fields ---

    // School/College Name Validation
    if (!data.schoolCollegeName || data.schoolCollegeName.trim().length < 1) {
        ctx.addIssue({
            code: ZodIssueCode.custom, // Use custom for required checks on optional fields
            message: 'School/College Name is required',
            path: ['schoolCollegeName'],
        });
    } else if (!/^[A-Za-z\s]+$/.test(data.schoolCollegeName)) {
         ctx.addIssue({
            code: ZodIssueCode.invalid_string,
            validation: 'regex',
            message: 'School/College Name must only contain alphabets and spaces',
            path: ['schoolCollegeName'],
        });
    }

    // University/Board Name Validation
    if (!data.universityBoardName || data.universityBoardName.trim().length < 1) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message: 'University/Board Name is required',
            path: ['universityBoardName'],
        });
    } else if (!/^[A-Za-z\s]+$/.test(data.universityBoardName)) {
         ctx.addIssue({
            code: ZodIssueCode.invalid_string,
            validation: 'regex',
            message: 'University/Board Name must only contain alphabets and spaces',
            path: ['universityBoardName'],
        });
    }

    // Passing Year Validation
    if (data.passingYear === null || data.passingYear === undefined) {
         ctx.addIssue({
            code: ZodIssueCode.invalid_type, // Type error if missing when required
            expected: 'number',
            received: 'undefined',
            message: 'Passing Year required',
            path: ['passingYear'],
        });
    } else { // Only apply number refinements if the value exists
        if (!Number.isInteger(data.passingYear)) {
            ctx.addIssue({
               code: ZodIssueCode.invalid_type,
               expected: 'integer',
               received: 'float',
               message: 'Passing Year must be an integer',
               path: ['passingYear'],
           });
        }
        if (data.passingYear.toString().length !== 4) {
             ctx.addIssue({
                code: ZodIssueCode.custom,
                message: 'Passing Year must be a valid 4-digit year',
                path: ['passingYear'],
            });
        }
    }


    // Percentage Obtained Validation
    if (data.percentageObtained === null || data.percentageObtained === undefined) {
         ctx.addIssue({
            code: ZodIssueCode.invalid_type, // Type error if missing when required
            expected: 'number',
            received: 'undefined',
            message: 'Percentage Obtained required', // Corrected double space
            path: ['percentageObtained'],
        });
    } else { // Only apply number refinements if the value exists
         if (data.percentageObtained < 0) {
             ctx.addIssue({
                code: ZodIssueCode.too_small,
                type: 'number',
                minimum: 0,
                inclusive: true,
                message: 'Percentage must be at least 0',
                path: ['percentageObtained'],
            });
        }
        if (data.percentageObtained > 100) {
             ctx.addIssue({
                code: ZodIssueCode.too_big,
                type: 'number',
                maximum: 100,
                inclusive: true,
                message: 'Percentage cannot exceed 100',
                path: ['percentageObtained'],
            });
        }
    }

    // Subjects Validation (Optional array, but non-empty if provided)
    if (data.subjects && Array.isArray(data.subjects)) {
        if (data.subjects.length === 0) {
             // If the array exists but is empty, treat as error based on original .nonempty()
             ctx.addIssue({
                 code: ZodIssueCode.too_small,
                 minimum: 1,
                 inclusive: true,
                 exact: false,
                 type: 'array',
                 message: 'Subjects cannot be empty if provided',
                 path: ['subjects'],
             });
        } else {
            // Check individual subjects in the non-empty array
            data.subjects.forEach((subject, index) => {
                if (typeof subject !== 'string' || subject.trim().length < 1) {
                     ctx.addIssue({
                        code: ZodIssueCode.custom,
                        message: 'Subject name cannot be empty',
                        path: ['subjects', index],
                     });
                }
            });
        }
    }
    // If data.subjects is null/undefined, the base .optional() handles it, no issue needed here.
});

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

export const academicDetailsArraySchema = z.array(academicDetailSchema);
export const academicDetailsPartialArraySchema = z.array(academicDetailPartialSchema);

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
  gender: z.nativeEnum(Gender).default(Gender.NOT_TO_MENTION),
  dateOfBirth: requestDateSchema,
  category: z.nativeEnum(Category),
  course: z.nativeEnum(Course),
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
  .partial()
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
export type IAcademicDetailPartialSchema = z.infer<typeof academicDetailPartialSchema>;