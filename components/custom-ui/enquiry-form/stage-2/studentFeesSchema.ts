import { z } from "zod";
import {
  requestDateSchema
} from '@/common/constants/schemas';
import { FeeStatus, FeeType } from "@/types/enum";

export const otherFeesSchema = z.object({
  type: z.nativeEnum(FeeType),
  feeAmount: z.number().min(0, 'Fee amount must be greater than 0'),
  finalFee: z.number().min(0, 'Final fees to be paid must be greater than 0'),
  feesDepositedTOA: z.number().min(0, 'Fees to be deposited must be greater then 0').default(0),
  remarks: z.string()
});

export const singleSemSchema = z.object({
  feeAmount: z.number().min(0, 'Fee amount must be greater than 0'),
  finalFee: z.number().min(0, 'Final fees to be paid must be Positive')
});

const otherFeesSchemaWithoutFeeAmount = otherFeesSchema.omit({ feeAmount: true });

const singleSemSchemaWithoutFeeAmount = singleSemSchema.omit({ feeAmount: true });


const studentFeesSchema = z.object({
  otherFees: z.array(otherFeesSchema).optional(),
  semWiseFees: z.array(singleSemSchema),
  feeStatus: z.nativeEnum(FeeStatus).default(FeeStatus.DRAFT).optional(),
  feesClearanceDate: requestDateSchema
});

export const feesRequestSchema = studentFeesSchema.omit({ feeStatus: true }).extend({
  otherFees: z.array(otherFeesSchemaWithoutFeeAmount),
  semWiseFees: z.array(singleSemSchemaWithoutFeeAmount),
  enquiryId: z.string().min(1, 'Reuired Field'),
  feesClearanceDate: requestDateSchema,
  counsellorName: z.string().optional().nullable(),
  telecallerName: z.string().optional().nullable(),
  collegeSectionDate: z.date().optional().nullable(),
  collegeSectionRemarks: z.string().optional().nullable(),
});

export const feesUpdateSchema = feesRequestSchema.extend({
  id: z.string().min(1, 'Reuired Field')
}).omit({ enquiryId: true });


export const feesDraftRequestSchema = feesRequestSchema.extend({
  otherFees: z.array(otherFeesSchema.partial()).optional(),
  semWiseFees: z.array(singleSemSchema.partial()).optional(),
  enquiryId: z.string().min(1, 'Reuired Field'),
  feesClearanceDate: requestDateSchema,
}).strict();


export const feesDraftUpdateSchema = feesDraftRequestSchema.extend({ id: z.string().min(1, 'Reuired Field') }).omit({ enquiryId: true }).partial().strict()


export type IOtherFeesSchema = z.infer<typeof otherFeesSchema>;
export type ISingleSemSchema = z.infer<typeof singleSemSchema>;
export type IFeesRequestSchema = z.infer<typeof feesRequestSchema>;
export type IFeesUpdateSchema = z.infer<typeof feesUpdateSchema>;
export type IStudentFeesSchema = z.infer<typeof studentFeesSchema>;
export type IFeesDraftRequestSchema = z.infer<typeof feesDraftRequestSchema>;
export type IFeesDraftUpdateSchema = z.infer<typeof feesDraftUpdateSchema>;
