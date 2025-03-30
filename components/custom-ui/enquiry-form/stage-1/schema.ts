import {
  addressSchema,
  contactNumberSchema,
  previousCollegeDataSchema,
  requestDateSchema
} from '@/common/constants/schemas';
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
import { z } from 'zod';

export const academicDetailSchema = z.object({
  educationLevel: z.nativeEnum(EducationLevel),
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
  subjects: z
    .array(z.string().min(1, 'Subject name is required'))
    .nonempty('Subjects cannot be empty')
});

export const singleDocumentSchema = z.object({
    enquiryId : z.string(),
    type: z.nativeEnum(DocumentType),
    documentBuffer: z.object({
        buffer: z.instanceof(Buffer),
        mimetype: z.string(),
        size: z.number()
        .positive()
        .max(5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
        originalname: z.string(),
    }).refine(
        (file) => ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.mimetype),
        { message: 'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.' }
    )
});

export const academicDetailsArraySchema = z.array(academicDetailSchema);

export const enquirySchema = z.object({
  admissionMode: z.nativeEnum(AdmissionMode).default(AdmissionMode.OFFLINE),
  studentName: z
    .string({ required_error: 'Student Name is required' })
    .nonempty('Student Name is required'),

  dateOfBirth: requestDateSchema,
  dateOfEnquiry: requestDateSchema,
  studentPhoneNumber: contactNumberSchema,
  gender: z.nativeEnum(Gender).default(Gender.NOT_TO_MENTION),

  fatherName: z
    .string({ required_error: 'Father Name is required' })
    .nonempty("Father's Name is required"),
  fatherPhoneNumber: contactNumberSchema,
  fatherOccupation: z
    .string({ required_error: 'Father occupation is required' })
    .nonempty('Father occupation is required'),

  motherName: z
    .string({ required_error: "Mother's Name is required" })
    .nonempty("Mother's Name is required"),
  motherPhoneNumber: contactNumberSchema,
  motherOccupation: z
    .string({ required_error: 'Mother occupation is required' })
    .nonempty('Mother occupation is required'),

  category: z.nativeEnum(Category),
  address: addressSchema,
  emailId: z.string().email('Invalid email format').optional(),

  reference: z.nativeEnum(AdmissionReference),
  course: z.nativeEnum(Course),
  previousCollegeData: previousCollegeDataSchema.optional(),

  counsellor: z.string(),
  remarks: z.string().optional(),
  academicDetails: academicDetailsArraySchema.optional(),

  applicationStatus: z.nativeEnum(ApplicationStatus).default(ApplicationStatus.STEP_1),

  dateOfCounselling: requestDateSchema,

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
  approvedBy: z.string().optional(),
  telecallerName: z.string().optional(),
  counsellorName: z.string().optional(),
});

export const enquiryStep1RequestSchema = enquirySchema
  .omit({ studentFee: true, dateOfAdmission: true, bloodGroup: true, admittedThrough: true, aadharNumber: true, religion: true, previousCollegeData: true, documents: true })
  .strict();