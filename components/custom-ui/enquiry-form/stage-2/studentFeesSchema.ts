import { z } from 'zod';
import { requestDateSchema } from '@/common/constants/schemas';
import { AdmissionReference, FeeStatus, FeeType } from '@/types/enum';

export const otherFeesSchema = z.object({
  type: z.nativeEnum(FeeType),
  feeAmount: z.number().min(0, '').optional().nullable(),
  finalFee: z.number().min(0, '').optional().nullable(),
  feesDepositedTOA: z.number().min(0, '').optional().nullable(),
  remarks: z.string().optional().nullable()
});

export const requiredOtherFeesSchema = otherFeesSchema
  .extend({
    feesDepositedTOA: z.number({ required_error: '' }).min(0, '').default(0),
    finalFee: z.number({ required_error: '' }).min(0, '').default(0)
  })
  .omit({ feeAmount: true });

export const singleSemSchema = z.object({
  feeAmount: z.number().min(0, ''),
  finalFee: z.number().min(0, '').optional().nullable()
});

export const requiredSingleSemSchema = singleSemSchema
  .extend({
    finalFee: z.number({ required_error: '' }).min(0, '')
  })
  .omit({ feeAmount: true });

const otherFeesSchemaWithoutFeeAmount = otherFeesSchema.omit({ feeAmount: true });

const singleSemSchemaWithoutFeeAmount = singleSemSchema.omit({ feeAmount: true });

const studentFeesSchema = z.object({
  otherFees: z.array(otherFeesSchema).optional(),
  semWiseFees: z.array(singleSemSchema),
  feeStatus: z.nativeEnum(FeeStatus).default(FeeStatus.DRAFT).optional(),
  feesClearanceDate: z.string().nullable().optional(),
  counsellor: z.array(z.string()).optional(),
  telecaller: z.array(z.string()).optional(),
  remarks: z.string().optional().nullable(),
  isFeeApplicable: z.boolean().default(false).optional()
});

export const feesRequestSchema = z.object({
  enquiryId: z.string().min(1, 'Required Field'),
  otherFees: z.array(otherFeesSchema.omit({ feeAmount: true })),
  semWiseFees: z.array(singleSemSchema.omit({ feeAmount: true })),
  feesClearanceDate: z.string().nullable().optional(),
  counsellor: z.array(z.string()).optional(),
  telecaller: z.array(z.string()).optional(),
  remarks: z.string().optional().nullable(),
  confirmationCheck: z.boolean().optional(),
  otpTarget: z.string().nullable().optional(),
  references: z.array(z.nativeEnum(AdmissionReference)).optional(),
  otpVerificationEmail: z.string().nullable().optional(),
  isFeeApplicable: z.boolean().default(false).optional()
});

export const finalFeesCreateSchema = feesRequestSchema.extend({
  otherFees: z.array(requiredOtherFeesSchema),
  semWiseFees: z.array(requiredSingleSemSchema),
  confirmationCheck: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the terms before submitting.'
  })
});

export const finalFeesUpdateSchema = z.object({
  id: z.string().min(1, 'Record ID is required for update'),
  enquiryId: z.string().min(1, 'Enquiry ID is required'),
  otherFees: z.array(requiredOtherFeesSchema),
  semWiseFees: z.array(requiredSingleSemSchema),
  feesClearanceDate: z.string().optional().nullable(),
  counsellor: z.array(z.string()).optional(),
  telecaller: z.array(z.string()).optional(),
  remarks: z.string().optional().nullable(),
  confirmationCheck: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the terms before submitting.'
  }),

  otpTarget: z.string().nullable().optional(),
  otpVerificationEmail: z.string().nullable().optional()
});

export const feesDraftRequestSchema = feesRequestSchema
  .extend({
    otherFees: z.array(otherFeesSchema.partial()).optional(),
    semWiseFees: z.array(singleSemSchema.partial()).optional(),
    enquiryId: z.string().min(1, 'Reuired Field'),
    feesClearanceDate: requestDateSchema
  })
  .strict();

export const frontendFeesDraftValidationSchema = z
  .object({
    enquiryId: z.string().min(1, 'Enquiry ID is required'),
    otherFees: z.array(otherFeesSchema.omit({ feeAmount: true }).partial()).optional(),
    semWiseFees: z.array(singleSemSchema.omit({ feeAmount: true }).partial()).optional(),
    feesClearanceDate: z.string().optional().nullable(),
    counsellor: z.array(z.string()).optional(),
    telecaller: z.array(z.string()).optional(),
    remarks: z.string().optional().nullable(),
    isFeeApplicable: z.boolean().default(false).optional(),
    references : z.array(z.string()).optional()
  })
  .partial();

export const feesDraftUpdateSchema = feesDraftRequestSchema
  .extend({ id: z.string().min(1, 'Reuired Field') })
  .omit({ enquiryId: true })
  .partial()
  .strict();

export type IFrontendFeesDraftValidationSchema = z.infer<typeof frontendFeesDraftValidationSchema>;

export type IOtherFeesSchema = z.infer<typeof otherFeesSchema>;
export type ISingleSemSchema = z.infer<typeof singleSemSchema>;
export type IFeesRequestSchema = z.infer<typeof feesRequestSchema>;
export type IFeesDraftRequestSchema = z.infer<typeof feesDraftRequestSchema>;
export type IFeesDraftUpdateSchema = z.infer<typeof feesDraftUpdateSchema>;
export type IFinalFeesCreateSchema = z.infer<typeof finalFeesCreateSchema>;
export type IFinalFeesUpdateSchema = z.infer<typeof finalFeesUpdateSchema>;
export type IStudentFeesSchema = z.infer<typeof studentFeesSchema>;
