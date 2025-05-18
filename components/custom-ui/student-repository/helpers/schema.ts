import { addressSchema, contactNumberSchema, requestDateSchema } from '@/common/constants/schemas';
import {
  AdmissionReference,
  AreaType,
  BloodGroup,
  Category,
  Gender,
  Religion,
  StatesOfIndia
} from '@/types/enum';
import { z } from 'zod';
import {
  academicDetailsArraySchema,
  entranceExamDetailSchema,
  physicalDocumentNoteSchema
} from '../../enquiry-form/schema/schema';

export const SEMESTER_LIST = [1, 2, 3, 4];

export const updateStudentDetailsRequestSchema = z
  .object({
    id: z.string().optional(),
    studentName: z
      .string({ required_error: 'Student Name is required.' })
      .regex(/^[A-Za-z\s]+$/, 'Student Name must only contain alphabets and spaces')
      .nonempty('Student Name cannot be empty'),
    studentPhoneNumber: contactNumberSchema.optional(),
    emailId: z.string().email('Invalid email format').optional(),

    fatherName: z
      .string({ required_error: 'Father Name is required' })
      .regex(/^[A-Za-z\s]+$/, 'Father Name must only contain alphabets and spaces')
      .optional(),
    fatherPhoneNumber: contactNumberSchema,
    fatherOccupation: z
      .string({ required_error: 'Father occupation is required' })
      .regex(/^[A-Za-z\s]+$/, 'Father occupation must only contain alphabets and spaces')
      .optional(),

    motherName: z
      .string({ required_error: "Mother's Name is required" })
      .regex(/^[A-Za-z\s]+$/, 'Mother Name must only contain alphabets and spaces')
      .optional(),
    motherPhoneNumber: contactNumberSchema.optional(),
    motherOccupation: z
      .string({ required_error: 'Mother occupation is required' })
      .regex(/^[A-Za-z\s]+$/, 'Mother occupation must only contain alphabets and spaces')
      .optional(),

    gender: z.nativeEnum(Gender).default(Gender.OTHER),
    dateOfBirth: requestDateSchema,
    lurnRegistrationNo: z.string().optional(),
    religion: z.nativeEnum(Religion).optional(),
    category: z.nativeEnum(Category),
    reference: z.nativeEnum(AdmissionReference),
    bloodGroup: z.nativeEnum(BloodGroup).optional(),
    aadharNumber: z.string().regex(/^\d{12}$/, 'Aadhar Number must be exactly 12 digits'),
    stateOfDomicile: z.nativeEnum(StatesOfIndia),
    areaType: z.nativeEnum(AreaType).optional(),
    nationality: z.string().optional(),
    address: addressSchema,
    academicDetails: academicDetailsArraySchema.optional(),

    entranceExamDetails: entranceExamDetailSchema.optional()
  })
  .strict();

export const updateStudentPhysicalDocumentRequestSchema = physicalDocumentNoteSchema
  .extend({ id: z.string() })
  .strict();
