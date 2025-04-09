import { DocumentType } from "@/types/enum";

export const getReadableDocumentName = (type : DocumentType) => {
  const mapping = {
    [DocumentType.TENTH_MARKSHEET]: "10th Marksheet",
    [DocumentType.TENTH_CERTIFICATE]: "10th Certificate",
    [DocumentType.TWELFTH_MARKSHEET]: "12th Marksheet",
    [DocumentType.TWELFTH_CERTIFICATE]: "12th Certificate",
    [DocumentType.GRADUATION_FINAL_YEAR_MARKSHEET]: "Graduation Final Year Marksheet",
    [DocumentType.CHARACTER_CERTIFICATE]: "Character Certificate",
    [DocumentType.TC_MIGRATION]: "TC / Migration Certificate",
    [DocumentType.MEDICAL_CERTIFICATE]: "Medical Certificate",
    [DocumentType.ANTI_RAGGING_BY_STUDENT]: "Anti Ragging Affidavit (Student)",
    [DocumentType.ANTI_RAGGING_BY_PARENT]: "Anti Ragging Affidavit (Parent)",
    [DocumentType.ALLOTMENT_LETTER]: "Allotment Letter",
    [DocumentType.PHOTO]: "Passport Size Photo",
    [DocumentType.CASTE_CERTIFICATE]: "Caste Certificate",
    [DocumentType.INCOME_CERTIFICATE]: "Income Certificate",
    [DocumentType.NIVAS_CERTIFICATE]: "Domicile / Nivas Certificate",
    [DocumentType.GAP_AFFIDAVIT]: "Gap Affidavit",
    [DocumentType.AADHAR]: "Aadhar Card",
    [DocumentType.DECLARATION_FILLED]: "Filled Declaration Form",
    [DocumentType.PHYSICALLY_HANDICAPPED_CERTIFICATE]: "Physically Handicapped Certificate",
    [DocumentType.EWS_CERTIFICATE]: "EWS Certificate",
  };

  return mapping[type as DocumentType] || "Unknown Document";
};

