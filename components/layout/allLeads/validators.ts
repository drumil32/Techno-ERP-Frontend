import { z } from 'zod';
import { Course, FinalConversionType, Gender, LeadType, Locations, Marketing_Source, UserRoles } from '@/static/enum';


export const objectIdSchema = z.string();

export const requestDateSchema = z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 'Date must be in DD/MM/YYYY format');

export const contactNumberSchema = z
    .string()
    .regex(/^[1-9]\d{9}$/, 'Invalid contact number format. Expected: 1234567890');


// // DTODO: make emailSchema uniform
// export const emailSchema = z
//     .string()
//     .email();

// export const addressSchema = z.object({
//     landmark: z.string().min(5, 'Permanent address must be at least 5 characters'),
//     district: z.string(),
//     pincode: z
//         .string()
//         .regex(/^[1-9][0-9]{5}$/, 'Pincode must be a 6-digit number starting with a non-zero digit'),
//     state: z.string(),
//     country: z.string()
// });

// export type IAddressSchema = z.infer<typeof addressSchema>;

// export const roleSchema = z.nativeEnum(UserRoles);




// export const leadSchema = z.object({
//     date:
//         z.date(),
//     source: z.string().optional(),
//     name: z.string().min(1, 'Name field is required'),
//     phoneNumber: contactNumberSchema,

//     altPhoneNumber: contactNumberSchema
//         .optional(),
//     email: z.string().email('Invalid Email Format').optional(),
//     gender: z.nativeEnum(Gender).default(Gender.NOT_TO_MENTION),
//     location: z.nativeEnum(Locations).optional(),
//     course: z.nativeEnum(Course).optional(),
//     assignedTo: objectIdSchema, // TODO: need to test this
//     leadType: z.nativeEnum(LeadType).default(LeadType.ORANGE),
//     remarks: z.string().optional(),
//     leadTypeModifiedDate: z.date().optional(),
//     nextDueDate: z
//         .date()
//         .optional()
// });
// export type ILead = z.infer<typeof leadSchema>;


// export const leadRequestSchema = z.object({
//     date: requestDateSchema,
//     source: z.string().optional(),
//     name: z.string().min(1, 'Name field is required'),
//     phoneNumber: contactNumberSchema,
//     altPhoneNumber: contactNumberSchema
//         .optional(),
//     email: z.string().email('Invalid Email Format').optional(),
//     gender: z.nativeEnum(Gender).default(Gender.NOT_TO_MENTION),
//     location: z.nativeEnum(Locations).optional(),
//     course: z.nativeEnum(Course).optional(),
//     assignedTo: objectIdSchema, // TODO: need to test this
//     leadType: z.nativeEnum(LeadType).default(LeadType.ORANGE),
//     remarks: z.string().optional(),
//     leadTypeModifiedDate: z.date().optional(),
//     nextDueDate: requestDateSchema
//         .optional()
// });
// export type ILeadRequest = z.infer<typeof leadRequestSchema>;


// export const updateLeadRequestSchema = z.object({
//     _id: objectIdSchema,
//     name: z.string().min(1, 'Name field is required').optional(),
//     phoneNumber: contactNumberSchema
//         .optional(),
//     altPhoneNumber: contactNumberSchema
//         .optional(),
//     email: z.string().email('Invalid Email Format').optional(),
//     gender: z.nativeEnum(Gender).optional(),
//     location: z.nativeEnum(Locations).optional(),
//     course: z.nativeEnum(Course).optional(),
//     leadType: z.nativeEnum(LeadType).optional(),
//     remarks: z.string().optional(),
//     nextDueDate:
//         requestDateSchema
//             .optional()
// }).strict(); // strict will restrict extra properties

// export type IUpdateLeadRequestSchema = z.infer<typeof updateLeadRequestSchema>;




export const leadMasterSchema = z.object({
    date: z.date(),
    source: z.nativeEnum(Marketing_Source).optional(),
    name: z.string().min(1, 'Name field is required'),
    phoneNumber: contactNumberSchema,
    altPhoneNumber: contactNumberSchema.optional(),
    email: z.string().email('Invalid Email Format').optional(),
    gender: z.nativeEnum(Gender).default(Gender.NOT_TO_MENTION),
    area: z.string().optional(),
    city: z.nativeEnum(Locations).optional(),
    course: z.nativeEnum(Course).optional(),
    assignedTo: objectIdSchema, // TODO: need to test this
    leadType: z.nativeEnum(LeadType).default(LeadType.OPEN),
    leadTypeModifiedDate: z.date().optional(),
    nextDueDate: z.date().optional(),
    footFall: z.boolean().optional(),   //This is referring to Campus Visit
    finalConversion: z.nativeEnum(FinalConversionType).optional().default(FinalConversionType.PENDING),
    remarks: z.string().optional(),
    leadsFollowUpCount: z.number().optional().default(0),
    yellowLeadsFollowUpCount: z.number().optional().default(0)
})

export const leadSchema = leadMasterSchema.omit({
    finalConversion: true,
    remarks: true,
    footFall: true,
    yellowLeadsFollowUpCount: true
}).strict();

export const yellowLeadSchema = leadMasterSchema.omit({ leadType: true, leadsFollowUpCount: true }).strict();

export const leadRequestSchema = leadSchema.extend({
    date: requestDateSchema,
    nextDueDate: requestDateSchema.optional()
})

export const updateLeadRequestSchema = leadRequestSchema.extend({
    _id: objectIdSchema,
    date: requestDateSchema.optional(),
    phoneNumber: contactNumberSchema.optional(),
    gender: z.nativeEnum(Gender).optional(),
    leadType: z.nativeEnum(LeadType).optional(),
    assignedTo: objectIdSchema.optional(),
    nextDueDate: requestDateSchema.optional(),
}).omit({ source: true }).strict(); // strict will restrict extra properties

export const yellowLeadUpdateSchema = yellowLeadSchema.extend({
    _id: objectIdSchema,
    name: z.string().optional(),
    phoneNumber: contactNumberSchema.optional(),
    campusVisit: z.boolean().optional(),
    assignedTo: objectIdSchema.optional(),
    date: requestDateSchema.optional(),
    nextDueDate: requestDateSchema.optional(),
}).strict();

export type ILeadMaster = z.infer<typeof leadMasterSchema>;
export type ILead = z.infer<typeof leadSchema>;
export type IYellowLead = z.infer<typeof yellowLeadSchema>;
export type IUpdateLeadRequestSchema = z.infer<typeof updateLeadRequestSchema>;
export type ILeadRequest = z.infer<typeof leadRequestSchema>;
export type IYellowLeadUpdate = z.infer<typeof yellowLeadUpdateSchema>;



