import { z } from "zod";
import { objectIdSchema, requestDateSchema } from "../../allLeads/validators";
import { LectureConfirmation } from "@/types/enum";

export const scheduleSchema = z.object({
    unit : z.number().nonnegative({ message : "Unit Number is required "}),
    lectureNumber : z.number().nonnegative({ message : "Lecture Number is required "}),
    topicName : z.string(),
    instructor : objectIdSchema.optional(),
    plannedDate : requestDateSchema,
    actualDate : requestDateSchema.optional(),
    classStrength: z.number().optional(),
    attendance: z.number().optional(),
    absent: z.number().optional(),
    confirmation: z.nativeEnum(LectureConfirmation).default(LectureConfirmation.TO_BE_DONE),
    remarks: z.string().optional(),
    documents: z.array(z.string().url()).optional()
});

export const fetchScheduleSchema = z.object({
    unit : z.number().nonnegative({ message : "Unit Number is required "}),
    lectureNumber : z.number().nonnegative({ message : "Lecture Number is required "}),
    topicName : z.string(),
    instructor : objectIdSchema.optional(),
    plannedDate : requestDateSchema,
    actualDate : requestDateSchema.optional(),
    classStrength: z.string().optional(),
    attendance: z.string().optional(),
    absent: z.string().optional(),
    confirmation: z.nativeEnum(LectureConfirmation).default(LectureConfirmation.TO_BE_DONE),
    remarks: z.string().optional(),
    documents: z.array(z.string().url()).optional()
});

export type IScheduleSchema = z.infer<typeof scheduleSchema>;  
export type IFetchScheduleSchema = z.infer<typeof fetchScheduleSchema>;  