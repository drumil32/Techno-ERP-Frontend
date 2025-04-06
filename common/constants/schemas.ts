import { Countries, Districts, StatesOfIndia } from '@/types/enum';
import { z } from 'zod';

export const requestDateSchema = z
  .string()
  .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Date must be in DD/MM/YYYY format');

export const contactNumberSchema = z
  .string()
  .regex(/^[1-9]\d{9}$/, 'Invalid contact number format. Expected: 1234567890');

export const addressSchema = z.object({
  addressLine1: z.string().min(5, 'Permanent address must be at least 5 characters'),
  addressLine2: z.string().min(5, 'Permanent address must be at least 5 characters'),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, 'Pincode must be a 6-digit number starting with a non-zero digit'),

  district: z.nativeEnum(Districts),
  state: z.nativeEnum(StatesOfIndia),
  country: z.nativeEnum(Countries)
});

export const previousCollegeDataSchema = z.object({
  collegeName: z.string().min(3, 'College Name must be at least 3 characters').optional(),
  district: z.string().optional(),
  boardUniversity: z.string().optional(),
  passingYear: z
    .number()
    .int()
    .refine((year) => year.toString().length === 4, {
      message: 'Passing Year must be a valid 4-digit year'
    }),
  aggregatePercentage: z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100')
});
