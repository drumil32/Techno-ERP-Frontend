import { FinanceFeeSchedule, FinanceFeeType } from "@/types/enum";

export function getFinanceFeeTypeLabel(type: FinanceFeeType): string {
  const labels: Record<FinanceFeeType, string> = {
    [FinanceFeeType.HOSTEL]: "Hostel Fee",
    [FinanceFeeType.TRANSPORT]: "Transport Fee",
    [FinanceFeeType.PROSPECTUS]: "Prospectus Fee",
    [FinanceFeeType.STUDENTID]: "Student ID Fee",
    [FinanceFeeType.UNIFORM]: "Uniform Fee",
    [FinanceFeeType.STUDENTWELFARE]: "Student Welfare Fee",
    [FinanceFeeType.BOOKBANK]: "Book Bank Fee",
    [FinanceFeeType.EXAMFEES]: "Exam Fees",
    [FinanceFeeType.MISCELLANEOUS]: "Miscellaneous Fee",
    [FinanceFeeType.SEMESTERFEE]: "Semester Fee",
  };
  return labels[type] ?? type;
}

export function getScheduleLabel(schedule: FinanceFeeSchedule): string {
  const map: Record<string, string> = {
    YEARLY: "Yearly",
    ONETIME: "One-Time",
    HALF_YEARLY: "Semester-wise",
  };
  return map[schedule] ?? schedule;
}

