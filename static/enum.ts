/**
 * Marketing Module Enums
 */
export enum UserRoles {
  ADMIN = 'ADMIN',
  LEAD_MARKETING = 'LEAD_MARKETING',
  EMPLOYEE_MARKETING = 'EMPLOYEE_MARKETING',
  BASIC_USER = 'BASIC_USER',
  COUNSELOR = 'COUNSELOR'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHERS',
  NOT_TO_MENTION = 'NOT_TO_MENTION'
}


export enum FinalConversionType {
  NO_FOOTFALL = 'NO_FOOTFALL',
  UNCONFIRMED = 'UNCONFIRMED',
  CONVERTED = 'CONVERTED',
  DEAD = 'DEAD',
}

export enum LeadType {
  OPEN = 'OPEN',
  DEAD = 'DEAD',
  COURSE_UNAVAILABLE = 'COURSE_UNAVAILABLE',
  NO_CLARITY = 'NO_CLARITY',
  INTERESTED = 'INTERESTED',
  DID_NOT_PICK = 'DID_NOT_PICK',
  INVALID = 'INVALID'
}
export const LeadTypeMapper:Record<LeadType,string>={
  [LeadType.OPEN]:'Left Over Data',
  [LeadType.DEAD]:'Dead Data',
  [LeadType.COURSE_UNAVAILABLE]:'Course NA',
  [LeadType.INTERESTED]:'Active Data',
  [LeadType.NO_CLARITY]:'Neutral Data',
  [LeadType.DID_NOT_PICK]:'Did Not Pick',
  [LeadType.INVALID]:'Invalid Data'
}

// Open Lead - Left Over Data	
// Not Interested - Dead Data	
// Interested - Active Data	
// No Clarity - Neutral Data	
// Did not pick - Not Connected	
// Invalid Data	
// Course Unavailable	
/**
 * Admission Module Enums
 */

export enum Category {
  SC = 'SC',
  ST = 'ST',
  OBC = 'OBC',
  GENERAL = 'General',
  EWS = 'EWS',
  OTHER = 'Other'
}

export enum AdmissionReference {
  Advertising = 'Advertising',
  BusinessAssociate = 'Business Associate',
  DigitalMarketing = 'Digital Marketing',
  DirectWalkIn = 'Direct Walk-in',
  LUNPGExternalVenue = 'LU/NPG/External Venue',
  StudentReference = 'Student Reference',
  TechnoligenceStaffCalling = 'Technoligence/Staff Calling',
  Other = 'Other'
}

export enum Course {
  BCOM = 'BCOM',
  BCOMH = 'BCOMH',
  BAJMC = 'BAJMC',
  BED = 'BED',
  BSCM = 'BSCM',
  BSCB = 'BSCB',
  BBA = 'BBA',
  BCA = 'BCA',
  BVAA = 'BVAA',
  BVAP = 'BVAP',
  MAJMC = 'MAJMC',
  MCOMC = 'MCOMC',
  MBA = 'MBA',
  LLB = 'LLB',
  MCA = 'MCA',
  MVAP = 'MVAP',
  MSCC = 'MSCC'
}

export const CourseNameMapper: Record<Course, string> = {
  [Course.BCOM]: 'B.COM',
  [Course.BCOMH]: 'B.COM (HONS)',
  [Course.BAJMC]: 'BA-JMC',
  [Course.BED]: 'B.ED',
  [Course.BSCM]: 'B.SC (PCM)',
  [Course.BSCB]: 'B.SC (ZBC)',
  [Course.BBA]: 'BBA',
  [Course.BCA]: 'BCA',
  [Course.BVAA]: 'BVA (App Art)',
  [Course.BVAP]: 'BVA (Painting)',
  [Course.MAJMC]: 'MA-JMC',
  [Course.MCOMC]: 'M.COM (COM)',
  [Course.MBA]: 'MBA',
  [Course.LLB]: 'LLB',
  [Course.MCA]: 'MCA',
  [Course.MVAP]: 'MVA (Paint)',
  [Course.MSCC]: 'M.SC (Chem)'
};

export enum AcademicDetails {
  Tenth = '10th',
  Twelfth = '12th',
  Graduation = 'Graduation',
  Others = 'Others'
}

export enum ApplicationIdPrefix {
  'TIHS' = 'TIHS',
  'TIMS' = 'TIMS',
  'TCL' = 'TCL'
}

export enum Religion {
  HINDUISM = 'Hinduism',
  ISLAM = 'Islam',
  CHRISTIANITY = 'Christianity',
  SIKHISM = 'Sikhism',
  BUDDHISM = 'Buddhism',
  JAINISM = 'Jainism',
  OTHERS = 'Others'
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export enum AdmittedThrough {
  DIRECT = 'Direct',
  COUNSELLING = 'Counselling'
}

export enum DocumentType {
  TENTH_MARKSHEET = '10th_Marksheet',
  TENTH_CERTIFICATE = '10th_Certificate',
  TWELFTH_MARKSHEET = '12th_Marksheet',
  TWELFTH_CERTIFICATE = '12th_Certificate',
  GRADUATION_FINAL_YEAR_MARKSHEET = 'Graduation_Final_Year_Marksheet',
  CHARACTER_CERTIFICATE = 'Character_Certificate',
  TC_MIGRATION = 'TC_Migration',
  MEDICAL_CERTIFICATE = 'Medical_Certificate',
  ANTI_RAGGING_BY_STUDENT = 'Anti_Ragging_by_Student',
  ANTI_RAGGING_BY_PARENT = 'Anti_Ragging_by_Parent',
  ALLOTMENT_LETTER = 'Allotment_Letter',
  PHOTO = 'Photo',
  CASTE_CERTIFICATE = 'Caste_Certificate',
  INCOME_CERTIFICATE = 'Income_Certificate',
  NIVAS_CERTIFICATE = 'Nivas_Certificate',
  GAP_AFFIDAVIT = 'Gap_Affidavit',
  AADHAR = 'Aadhar',
  DECLARATION_FILLED = 'Declaration_Filled',
  PHYSICALLY_HANDICAPPED_CERTIFICATE = 'Physically_Handicapped_Certificate',
  EWS_CERTIFICATE = 'EWS_Certificate'
}

export enum ApplicationStatus {
  STEP_1 = 'Step_1',
  STEP_2 = 'Step_2',
  STEP_3 = 'Step_3',
  STEP_4 = 'Step_4'
}

export enum MimeType {
  PNG = 'image/png',
  JPG = 'image/jpeg',
  JPEG = 'image/jpeg',
  PDF = 'application/pdf'
}

export enum ModuleNames {
  MARKETING = 'MARKETING'
}

export enum Locations {
  KNP = 'Kanpur',
  UNA = 'Unnao',
  STP = 'Sitapur',
  HRD = 'Hardoi',
  BBK = 'Barabanki',
  AMT = 'Amethi',
  FTP = 'Fatehpur',
  LKO = 'Lucknow'
}

export enum Marketing_Source {
  SCHOOL = 'School',
  DIGITAL_MARKETING = 'Digital_Marketing'
}


export const ADMISSION = 'admissions';

export const MARKETING_SHEET = 'Marketing Sheet';
