/**
 * Marketing Module Enums
 */
export enum UserRoles {
  ADMIN = 'ADMIN',
  LEAD_MARKETING = 'LEAD_MARKETING',
  EMPLOYEE_MARKETING = 'EMPLOYEE_MARKETING',
  BASIC_USER = 'BASIC_USER',
  COUNSELOR = 'COUNSELOR',
  REGISTAR = 'REGISTAR',
  HOD = 'HOD',
  INSTRUCTOR = 'INSTRUCTOR'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHERS'
}

export enum Source {
  SCHOOL = 'School'
}

export enum Marketing_Source {
  SCHOOL = 'School',
  DIGITAL_MARKETING = 'Digital_Marketing'
}
export enum DropDownType {
  CITY = 'CITY',
  MAKRETING_SOURCE = 'MAKRETING_SOURCE'
}
/*
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
  TechnoligenceStaffCalling = 'Technoligence',
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

export enum DropDownType {
  MARKETING_CITY = 'MARKETING_CITY',
  FIX_MARKETING_CITY = 'FIX_MARKETING_CITY',
  DISTRICT = 'DISTRICT',
  MARKETING_SOURCE = 'MARKETING_SOURCE',
  MARKETING_COURSE_CODE = 'MARKETING_COURSE_CODE',
  FIX_MARKETING_COURSE_CODE = 'FIX_MARKETING_COURSE_CODE'
}

export const ReverseCourseNameMapper: Record<string, Course> = {
  'B.COM': Course.BCOM,
  'B.COM (HONS)': Course.BCOMH,
  'BA-JMC': Course.BAJMC,
  'B.ED': Course.BED,
  'B.SC (PCM)': Course.BSCM,
  'B.SC (ZBC)': Course.BSCB,
  BBA: Course.BBA,
  BCA: Course.BCA,
  'BVA (App Art)': Course.BVAA,
  'BVA (Painting)': Course.BVAP,
  'MA-JMC': Course.MAJMC,
  'M.COM (COM)': Course.MCOMC,
  MBA: Course.MBA,
  LLB: Course.LLB,
  MCA: Course.MCA,
  'MVA (Paint)': Course.MVAP,
  'M.SC (Chem)': Course.MSCC
};

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

export const CourseAppliedMapper: Record<Course, string> = {
  [Course.BCOM]: 'Bachelor of Commerce',
  [Course.BCOMH]: 'Bachelor of Commerce (Honours)',
  [Course.BAJMC]: 'Bachelor of Arts in Journalism and Mass Communication',
  [Course.BED]: 'Bachelor of Education',
  [Course.BSCM]: 'Bachelor of Science (PCM)',
  [Course.BSCB]: 'Bachelor of Science (ZBC)',
  [Course.BBA]: 'Bachelor of Business Administration',
  [Course.BCA]: 'Bachelor of Computer Applications',
  [Course.BVAA]: 'Bachelor of Fine Arts (Applied Art)',
  [Course.BVAP]: 'Bachelor of Fine Arts (Painting)',
  [Course.MAJMC]: 'Master of Arts in Journalism and Mass Communication',
  [Course.MCOMC]: 'Master of Commerce',
  [Course.MBA]: 'Master of Business Administration',
  [Course.LLB]: 'Bachelor of Laws',
  [Course.MCA]: 'Master of Computer Applications',
  [Course.MVAP]: 'Master of Fine Arts',
  [Course.MSCC]: 'Master of Science (Chem)'
};

export const CollegeNameMapper: Record<Course, string> = {
  [Course.BCOM]: 'Techno Institute of Higher Studies',
  [Course.BCOMH]: 'Techno Institute of Higher Studies',
  [Course.BAJMC]: 'Techno Institute of Higher Studies',
  [Course.BED]: 'Techno Institute of Higher Studies',
  [Course.BSCM]: 'Techno Institute of Higher Studies',
  [Course.BSCB]: 'Techno Institute of Higher Studies',
  [Course.BBA]: 'Techno Institute of Higher Studies',
  [Course.BCA]: 'Techno Institute of Higher Studies',
  [Course.BVAA]: 'Techno Institute of Higher Studies',
  [Course.BVAP]: 'Techno Institute of Higher Studies',
  [Course.MAJMC]: 'Techno Institute of Higher Studies',
  [Course.MCOMC]: 'Techno Institute of Higher Studies',
  [Course.MBA]: 'Techno Institute of Management Sciences',
  [Course.LLB]: 'Techno College of Law',
  [Course.MCA]: 'Techno Institute of Management Sciences',
  [Course.MVAP]: 'Techno Institute of Higher Studies',
  [Course.MSCC]: 'Techno Institute of Higher Studies'
};

export const AffiliationMapper: Record<Course, string> = {
  [Course.BCOM]: 'Lucknow University',
  [Course.BCOMH]: 'Lucknow University',
  [Course.BAJMC]: 'Lucknow University',
  [Course.BED]: 'Lucknow University',
  [Course.BSCM]: 'Lucknow University',
  [Course.BSCB]: 'Lucknow University',
  [Course.BBA]: 'Lucknow University',
  [Course.BCA]: 'Lucknow University',
  [Course.BVAA]: 'Lucknow University',
  [Course.BVAP]: 'Lucknow University',
  [Course.MAJMC]: 'Lucknow University',
  [Course.MCOMC]: 'Lucknow University',
  [Course.MBA]: 'Dr. A. P. J. Abdul Kalam Technical University',
  [Course.LLB]: 'Lucknow University',
  [Course.MCA]: 'Dr. A. P. J. Abdul Kalam Technical University',
  [Course.MVAP]: 'Lucknow University',
  [Course.MSCC]: 'Lucknow University'
};

export enum EducationLevel {
  Tenth = '10th',
  Twelfth = '12th',
  Graduation = 'Graduation',
  Others = 'Others'
}

export enum FormNoPrefixes {
  'TIHS' = 'TIHS',
  'TIMS' = 'TIMS',
  'TCL' = 'TCL',
  'PHOTO' = 'PHOTO'
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
  EWS_CERTIFICATE = 'EWS_Certificate',
  SIGNATURE = 'Signature'
}

export enum AcademicDetails {
  Tenth = '10th',
  Twelfth = '12th',
  Graduation = 'Graduation',
  Others = 'Others'
}

export enum ApplicationStatus {
  STEP_1 = 'Step_1',
  STEP_2 = 'Step_2',
  STEP_3 = 'Step_3',
  STEP_4 = 'Step_4',
  CONFIRMED = 'Confirmed'
}
export enum ApplicationIdPrefix {
  'TIHS' = 'TIHS',
  'TIMS' = 'TIMS',
  'TCL' = 'TCL'
}

export enum ModuleNames {
  MARKETING = 'MARKETING',
  ADMISSION = 'ADMISSION',
  COURSE = 'COURSE'
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

export enum FeeStatus {
  FINAL = 'FINAL',
  DRAFT = 'DRAFT'
}

export enum AdmissionMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum AreaType {
  URBAN = 'URBAN',
  RURAL = 'RURAL',
  OTHERS = 'OTHERS'
}

export enum StatesOfIndia {
  AndhraPradesh = 'Andhra Pradesh',
  ArunachalPradesh = 'Arunachal Pradesh',
  Assam = 'Assam',
  Bihar = 'Bihar',
  Chhattisgarh = 'Chhattisgarh',
  Goa = 'Goa',
  Gujarat = 'Gujarat',
  Haryana = 'Haryana',
  HimachalPradesh = 'Himachal Pradesh',
  Jharkhand = 'Jharkhand',
  Karnataka = 'Karnataka',
  Kerala = 'Kerala',
  MadhyaPradesh = 'Madhya Pradesh',
  Maharashtra = 'Maharashtra',
  Manipur = 'Manipur',
  Meghalaya = 'Meghalaya',
  Mizoram = 'Mizoram',
  Nagaland = 'Nagaland',
  Odisha = 'Odisha',
  Punjab = 'Punjab',
  Rajasthan = 'Rajasthan',
  Sikkim = 'Sikkim',
  TamilNadu = 'Tamil Nadu',
  Telangana = 'Telangana',
  Tripura = 'Tripura',
  UttarPradesh = 'Uttar Pradesh',
  Uttarakhand = 'Uttarakhand',
  WestBengal = 'West Bengal'
}

// export enum Countries {
//   India = "India",
//   Pakistan = "Pakistan",
//   China = "China",
//   Nepal = "Nepal",
//   Bhutan = "Bhutan",
//   Bangladesh = "Bangladesh",
//   Myanmar = "Myanmar",
//   SriLanka = "Sri Lanka",
//   Afghanistan = "Afghanistan",
//   Maldives = "Maldives",
//   Thailand = "Thailand",
// }

export enum Countries {
  India = 'India',
  NON_INDIA = 'Non-India'
}
// Fee types

export enum FeeType {
  SEM1FEE = 'SEM1FEE',
  PROSPECTUS = 'PROSPECTUS',
  STUDENTID = 'STUDENTID',
  UNIFORM = 'UNIFORM',
  STUDENTWELFARE = 'STUDENTWELFARE',
  BOOKBANK = 'BOOKBANK',
  HOSTEL = 'HOSTEL',
  TRANSPORT = 'TRANSPORT'
  // EXAMFEES = 'EXAMFEES'
}

export enum Districts {
  Agra = 'Agra',
  Aligarh = 'Aligarh',
  AmbedkarNagar = 'Ambedkar Nagar',
  Amethi = 'Amethi',
  Amroha = 'Amroha',
  Auraiya = 'Auraiya',
  Ayodhya = 'Ayodhya',
  Azamgarh = 'Azamgarh',
  Baghpat = 'Baghpat',
  Bahraich = 'Bahraich',
  Ballia = 'Ballia',
  Balrampur = 'Balrampur',
  Banda = 'Banda',
  Barabanki = 'Barabanki',
  Bareilly = 'Bareilly',
  Basti = 'Basti',
  Bhadohi = 'Bhadohi',
  Bijnor = 'Bijnor',
  Budaun = 'Budaun',
  Bulandshahr = 'Bulandshahr',
  Chandauli = 'Chandauli',
  Chitrakoot = 'Chitrakoot',
  Deoria = 'Deoria',
  Etah = 'Etah',
  Etawah = 'Etawah',
  Farrukhabad = 'Farrukhabad',
  Fatehpur = 'Fatehpur',
  Firozabad = 'Firozabad',
  GautamBuddhaNagar = 'Gautam Buddha Nagar',
  Ghaziabad = 'Ghaziabad',
  Ghazipur = 'Ghazipur',
  Gonda = 'Gonda',
  Gorakhpur = 'Gorakhpur',
  Hapur = 'Hapur',
  Hardoi = 'Hardoi',
  Hathras = 'Hathras',
  Jalaun = 'Jalaun',
  Jaunpur = 'Jaunpur',
  Jhansi = 'Jhansi',
  Kannauj = 'Kannauj',
  KanpurDehat = 'Kanpur Dehat',
  KanpurNagar = 'Kanpur Nagar',
  Kasganj = 'Kasganj',
  Kaushambi = 'Kaushambi',
  Kushinagar = 'Kushinagar',
  LakhimpurKheri = 'Lakhimpur Kheri',
  Lalitpur = 'Lalitpur',
  Lucknow = 'Lucknow',
  Maharajganj = 'Maharajganj',
  Mahoba = 'Mahoba',
  Mainpuri = 'Mainpuri',
  Mathura = 'Mathura',
  Mau = 'Mau',
  Meerut = 'Meerut',
  Mirzapur = 'Mirzapur',
  Moradabad = 'Moradabad',
  Muzaffarnagar = 'Muzaffarnagar',
  Pilibhit = 'Pilibhit',
  Pratapgarh = 'Pratapgarh',
  RaeBareli = 'Rae Bareli',
  Rampur = 'Rampur',
  Saharanpur = 'Saharanpur',
  Sambhal = 'Sambhal',
  SantKabirNagar = 'Sant Kabir Nagar',
  Shahjahanpur = 'Shahjahanpur',
  Shamli = 'Shamli',
  Shravasti = 'Shravasti',
  Siddharthnagar = 'Siddharthnagar',
  Sitapur = 'Sitapur',
  Sonbhadra = 'Sonbhadra',
  Sultanpur = 'Sultanpur',
  Unnao = 'Unnao',
  Varanasi = 'Varanasi',
  KanshiRamNagar = 'Kanshi Ram Nagar',
  Prayagraj = 'Prayagraj',
  Hamirpur = 'Hamirpur',
  Other = 'Other'
}

export enum MimeType {
  PNG = 'image/png',
  JPG = 'image/jpeg',
  JPEG = 'image/jpeg',
  PDF = 'application/pdf'
}

export const ADMISSION = 'admissions';

export const TGI = 'TGI';
export const PHOTO = 'PHOTO';

export const MARKETING_SHEET = 'Marketing Sheet';

export enum COLLECTION_NAMES {
  USER = 'User',
  VERIFY_OTP = 'VerifyOtp',
  ENQUIRY = 'Enquiry',
  ENQUIRY_DRAFT = 'EnquiryDraft',
  ENQUIRY_ID_META_DATA = 'EnquiryIdMetaData',
  STUDENT_FEE = 'studentFee',
  STUDENT_FEE_DRAFT = 'studentFeeDraft',
  DEPARTMENT_COURSE = 'deptandcourse',
  LEAD = 'Lead',
  SPREADSHEET_META_DATA = 'spreadSheetMetaData',
  YELLOW_LEAD = 'YellowLead',
  COURSE_OTHER_FEES = 'CourseAndOtherFees',
  STUDENT = 'Student'
}

export enum LeadType {
  LEFT_OVER = 'LEFT_OVER',
  NOT_INTERESTED = 'NOT_INTERESTED',
  ACTIVE = 'ACTIVE',
  NEUTRAL = 'NEUTRAL',
  DID_NOT_PICK = 'DID_NOT_PICK',
  COURSE_UNAVAILABLE = 'COURSE_UNAVAILABLE',
  INVALID = 'INVALID'
}

export const LeadTypeMapper: Record<LeadType, string> = {
  [LeadType.LEFT_OVER]: 'Left Over Data',
  [LeadType.NOT_INTERESTED]: 'Dead Data',
  [LeadType.COURSE_UNAVAILABLE]: 'Course NA',
  [LeadType.NEUTRAL]: 'Neutral Data',
  [LeadType.ACTIVE]: 'Active Data',
  [LeadType.DID_NOT_PICK]: 'Did Not Pick',
  [LeadType.INVALID]: 'Invalid Data'
};

export enum LectureConfirmation {
  CONFIRMED = 'CONFIRMED',
  DELAYED = 'DELAYED',
  TO_BE_DONE = 'TO_BE_DONE'
}

export enum CourseMaterialType {
  LPLAN = 'LPlan',
  PPLAN = 'PPlan',
  General = 'General'
}

export enum CollegeNames {
  'TIHS' = 'TIHS',
  'TIMS' = 'TIMS',
  'TCL' = 'TCL'
}

export enum CourseYear {
  FIRST = 'First',
  SECOND = 'Second',
  THIRD = 'Third',
  FOURTH = 'Fourth'
}

export enum FeeSchedule {
  ONETIME = 'ONETIME',
  HALF_YEARLY = 'HALF_YEARLY',
  YEARLY = 'YEARLY'
}
export enum FeesPaidStatus {
  DUE = 'DUE',
  PAID = 'PAID',
  NOT_PROVIDED = 'NOT_PROVIDED'
}

export enum Schedule {
  ONE_TIME = 'ONE_TIME',
  SEMESTER = 'SEMESTER',
  YEARLY = 'YEARLY',
  OPTIONAL = 'OPTIONAL',
  AS_APPLICABLE = 'AS_APPLICABLE'
}

export enum FeeActions {
  REFUND = 'REFUND',
  DEPOSIT = 'DEPOSIT'
}

export enum TransactionTypes {
  NEFT_IMPS_RTGS = 'NEFT/RTGS/IMPS',
  UPI = 'UPI',
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  OTHERS = 'OTHERS'
}

export enum FinanceFeeType {
  HOSTEL = 'HOSTEL', //OPTIONAL
  TRANSPORT = 'TRANSPORT', //OPTIONAL
  PROSPECTUS = 'PROSPECTUS', //ONE-TIME
  STUDENTID = 'STUDENTID', //ONE-TIME
  UNIFORM = 'UNIFORM', //ONE-TIME
  STUDENTWELFARE = 'STUDENTWELFARE', //YEARLY
  BOOKBANK = 'BOOKBANK', //SEMESTERWISE
  EXAMFEES = 'EXAMFEES',
  MISCELLANEOUS = 'MISCELLANEOUS', //OTHERS
  SEMESTERFEE = 'SEMESTERFEE'
}

export enum FinanceFeeSchedule {
  HOSTEL = 'YEARLY',
  TRANSPORT = 'YEARLY',
  PROSPECTUS = 'ONETIME',
  STUDENTID = 'ONETIME',
  UNIFORM = 'ONETIME',
  STUDENTWELFARE = 'YEARLY',
  BOOKBANK = 'HALF_YEARLY',
  EXAMFEES = 'HALF_YEARLY',
  MISCELLANEOUS = 'HALF_YEARLY',
  SEMESTERFEE = 'HALF_YEARLY'
}

export enum FinalConversionStatus {
  NO_FOOTFALL = 'NO_FOOTFALL',
  UNCONFIRMED = 'UNCONFIRMED',
  CONVERTED = 'CONVERTED',
  NOT_INTERESTED = 'NOT_INTERESTED'
}

export const FinalConversionStatusMapper: Record<FinalConversionStatus, string> = {
  [FinalConversionStatus.CONVERTED]: 'Admission',
  [FinalConversionStatus.NOT_INTERESTED]: 'Not Interested',
  [FinalConversionStatus.UNCONFIRMED]: 'Unconfirmed',
  [FinalConversionStatus.NO_FOOTFALL]: 'No Footfall'
};
