import { FeeType } from "@/types/enum";

export const displayFeeMapper = (feeType: FeeType): string => {
  const feeDisplayNames: Record<FeeType, string> = {
    [FeeType.HOSTEL]: "Hostel Fees",
    [FeeType.TRANSPORT]: "Transport Fees",
    [FeeType.PROSPECTUS]: "Prospectus Fees",
    [FeeType.STUDENTID]: "Student ID",
    [FeeType.UNIFORM]: "Uniform",
    [FeeType.STUDENTWELFARE]: "Student Welfare",
    [FeeType.BOOKBANK]: "Book Bank",
    [FeeType.EXAMFEES]: "Semester 1 Fees",
  };

  return feeDisplayNames[feeType] || "Unknown Fee";
};

export const scheduleFeeMapper = (feeType: FeeType): string => {
  const feeSchedules: Record<FeeType, string> = {
    [FeeType.HOSTEL]: "One-time",
    [FeeType.TRANSPORT]: "One-time",
    [FeeType.PROSPECTUS]: "One-time",
    [FeeType.STUDENTID]: "One-time",
    [FeeType.UNIFORM]: "One-time",
    [FeeType.STUDENTWELFARE]: "One-time",
    [FeeType.BOOKBANK]: "Yearly",
    [FeeType.EXAMFEES]: "One-time",
  };

  return feeSchedules[feeType] || "Unknown Schedule";
};
