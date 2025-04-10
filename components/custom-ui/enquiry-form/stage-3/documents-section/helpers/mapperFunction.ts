import { DocumentType } from "@/types/enum";

export const getReadableDocumentName = (type : DocumentType) => {
  const mapping = {
    [DocumentType.TENTH_MARKSHEET]: "10th Marksheet",
    [DocumentType.TENTH_CERTIFICATE]: "10th Certificate",
    [DocumentType.TWELFTH_MARKSHEET]: "12th Marksheet",
    [DocumentType.TWELFTH_CERTIFICATE]: "12th Certificate",
    [DocumentType.GRADUATION_FINAL_YEAR_MARKSHEET]: "Graduation Final Year Marksheet",
    [DocumentType.CHARACTER_CERTIFICATE]: "Character Certificate",
    [DocumentType.TC_MIGRATION]: "T.C / Migration Certificate",
    [DocumentType.MEDICAL_CERTIFICATE]: "Medical Certificate",
    [DocumentType.ANTI_RAGGING_BY_STUDENT]: "Anti-Ragging Student",
    [DocumentType.ANTI_RAGGING_BY_PARENT]: "Anti-Ragging Parent",
    [DocumentType.ALLOTMENT_LETTER]: "Allotment Letter",
    [DocumentType.PHOTO]: "Passport Photo",
    [DocumentType.CASTE_CERTIFICATE]: "Caste",
    [DocumentType.INCOME_CERTIFICATE]: "Income",
    [DocumentType.NIVAS_CERTIFICATE]: "Nivas",
    [DocumentType.GAP_AFFIDAVIT]: "Gap Affidavit",
    [DocumentType.AADHAR]: "Aadhar Card",
    [DocumentType.DECLARATION_FILLED]: "Declaration Filled",
    [DocumentType.PHYSICALLY_HANDICAPPED_CERTIFICATE]: "Physically Handicapped",
    [DocumentType.EWS_CERTIFICATE]: "EWS",
  };

  return mapping[type as DocumentType] || "Unknown Document";
};

