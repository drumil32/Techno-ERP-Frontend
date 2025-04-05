import { z } from "zod";
import {
  requestDateSchema
} from '@/common/constants/schemas';
import { FeeStatus, FeeType } from "@/types/enum";

export const otherFeesSchema = z.object({
  type: z.nativeEnum(FeeType),
  feeAmount: z.number().min(0, 'Fee amount must be greater than 0').optional().nullable(),
  finalFee: z.number().min(0, 'Final fees must be non-negative').optional().nullable(),
  feesDepositedTOA: z.number().min(0, 'Fees deposited must be non-negative').optional().nullable(),
  remarks: z.string().optional().nullable(), 
});

export const singleSemSchema = z.object({
  feeAmount: z.number().min(0, 'Fee amount must be greater than 0'),
  finalFee: z.number().min(0, 'Final fees must be non-negative').optional().nullable() 
});

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
});

export const feesRequestSchema = studentFeesSchema.omit({ feeStatus: true }).extend({
  enquiryId: z.string().min(1, 'Reuired Field'),
  
  otherFees: z.array(otherFeesSchemaWithoutFeeAmount),
  semWiseFees: z.array(singleSemSchemaWithoutFeeAmount),
  confirmationCheck: z.boolean().refine(val => val === true, {
    message: "You must confirm the terms before submitting."
  }),
  otpTarget: z.string().nullable().optional(),
  otpVerificationEmail: z.string().nullable().optional(),

});

export const frontendFeesDraftValidationSchema = z.object({
  enquiryId: z.string().min(1, 'Enquiry ID is required'),
  otherFees: z.array(otherFeesSchemaWithoutFeeAmount.partial()).optional(), 
  semWiseFees: z.array(singleSemSchemaWithoutFeeAmount.partial()).optional(), 
  feesClearanceDate: z.string().optional().nullable(),
  counsellor: z.array(z.string()).optional(), 
  telecaller: z.array(z.string()).optional(), 
  remarks: z.string().optional().nullable(),
}).partial(); 

export const feesUpdateSchema = z.object({
  // id: z.string().min(1, 'Record ID is required'), 
  otherFees: z.array(otherFeesSchemaWithoutFeeAmount),
  semWiseFees: z.array(singleSemSchemaWithoutFeeAmount),
  feesClearanceDate: z.string().optional().nullable(),
  counsellor: z.array(z.string()).optional(),
  telecaller: z.array(z.string()).optional(),
  collegeSectionRemarks: z.string().optional().nullable(),
});

export const feesDraftRequestSchema = feesRequestSchema.extend({
  otherFees: z.array(otherFeesSchema.partial()).optional(),
  semWiseFees: z.array(singleSemSchema.partial()).optional(),
  enquiryId: z.string().min(1, 'Reuired Field'),
  feesClearanceDate: requestDateSchema,
}).strict();




export const feesDraftUpdateSchema = feesDraftRequestSchema.extend({ id: z.string().min(1, 'Reuired Field') }).omit({ enquiryId: true }).partial().strict()


export type IFrontendFeesDraftValidationSchema = z.infer<typeof frontendFeesDraftValidationSchema>;

export type IOtherFeesSchema = z.infer<typeof otherFeesSchema>;
export type ISingleSemSchema = z.infer<typeof singleSemSchema>;
export type IFeesRequestSchema = z.infer<typeof feesRequestSchema>;
export type IFeesUpdateSchema = z.infer<typeof feesUpdateSchema>;
export type IStudentFeesSchema = z.infer<typeof studentFeesSchema>;
export type IFeesDraftRequestSchema = z.infer<typeof feesDraftRequestSchema>;
export type IFeesDraftUpdateSchema = z.infer<typeof feesDraftUpdateSchema>;
