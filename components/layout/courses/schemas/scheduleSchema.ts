import { z } from 'zod';
import { objectIdSchema, requestDateSchema } from '../../allLeads/validators';
import { LectureConfirmation } from '@/types/enum';

export const scheduleSchema = z
  .object({
    unit: z.number().nonnegative({ message: 'Unit Number is required' }),
    lectureNumber: z.number().nonnegative({ message: 'Lecture Number is required' }),
    topicName: z.string(),
    instructor: objectIdSchema.optional(),
    plannedDate: requestDateSchema,
    actualDate: requestDateSchema.optional(),
    classStrength: z.number().nonnegative().optional(),
    attendance: z.number().nonnegative().optional(),
    absent: z.number().nonnegative().optional(),
    confirmation: z.nativeEnum(LectureConfirmation).default(LectureConfirmation.TO_BE_DONE),
    remarks: z.string().optional(),
    documents: z.array(z.string().url()).optional()
  })
  .superRefine((data, ctx) => {
    if (data.classStrength !== undefined) {
      if (data.attendance !== undefined) {
        if (data.attendance > data.classStrength) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Attendance cannot be greater than class strength',
            path: ['attendance']
          });
        }
      }

      if (data.absent !== undefined) {
        if (data.absent > data.classStrength) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Absent count cannot be greater than class strength',
            path: ['absent']
          });
        }
      }

      if (data.attendance !== undefined && data.absent !== undefined) {
        if (data.attendance + data.absent !== data.classStrength) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Sum of attendance and absent must equal class strength',
            path: ['attendance']
          });
        }
      }
    }

    if (
      (data.attendance !== undefined || data.absent !== undefined) &&
      data.classStrength === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Class strength is required when providing attendance or absent count',
        path: ['classStrength']
      });
    }
  });
export const fetchScheduleSchema = z.object({
  unit: z.number().nonnegative({ message: 'Unit Number is required ' }),
  lectureNumber: z.number().nonnegative({ message: 'Lecture Number is required ' }),
  topicName: z.string(),
  instructor: objectIdSchema.optional(),
  plannedDate: requestDateSchema,
  actualDate: requestDateSchema.optional(),
  classStrength: z.string().optional(),
  attendance: z.string().optional(),
  absent: z.string().optional(),
  confirmation: z.nativeEnum(LectureConfirmation).default(LectureConfirmation.TO_BE_DONE),
  remarks: z.string().optional(),
  documents: z.array(z.string().url()).optional()
});

export type IScheduleSchema = z.infer<typeof scheduleSchema>;
export type IFetchScheduleSchema = z.infer<typeof fetchScheduleSchema>;
