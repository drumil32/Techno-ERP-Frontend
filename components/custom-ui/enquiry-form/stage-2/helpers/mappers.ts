import { FeeType } from "@/types/enum";

export const displayFeeMapper = (feeType: FeeType | string | undefined): string => {
  switch (feeType) {
    case FeeType.HOSTEL: return "Hostel Fees";
    case FeeType.TRANSPORT: return "Transport Fees";
    case FeeType.PROSPECTUS: return "Prospectus Fees";
    case FeeType.STUDENTID: return "Student ID Card Fees";
    case FeeType.UNIFORM: return "Uniform Fees";
    case FeeType.STUDENTWELFARE: return "Student Welfare Fees";
    case FeeType.BOOKBANK: return "Book Bank";
    case FeeType.EXAMFEES: return "Exam Fees";
    case FeeType.SEM1FEE: return "Semester 1 Fees"; 
    default: return "Unknown Fee Type";
  }
};

export const scheduleFeeMapper = (feeType: FeeType | string | undefined): string => {
  switch (feeType) {
    case FeeType.HOSTEL: return "Yearly";
    case FeeType.TRANSPORT: return "Yearly";
    case FeeType.PROSPECTUS: return "One-time";
    case FeeType.STUDENTID: return "One-time";
    case FeeType.UNIFORM: return "One-time";
    case FeeType.STUDENTWELFARE: return "Yearly";
    case FeeType.BOOKBANK: return "One-time";
    case FeeType.EXAMFEES: return "Per Exam";
    case FeeType.SEM1FEE: return "One-time";
    default: return "N/A";
  }
};
