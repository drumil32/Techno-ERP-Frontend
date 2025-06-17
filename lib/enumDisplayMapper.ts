import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { FeeActions, FinanceFeeSchedule, FinanceFeeType, TransactionTypes, UserRoles } from '@/types/enum';

export function getFinanceFeeTypeLabel(type: FinanceFeeType): string {
  const labels: Record<FinanceFeeType, string> = {
    [FinanceFeeType.HOSTEL]: 'Hostel Fee',
    [FinanceFeeType.TRANSPORT]: 'Transport Fee',
    [FinanceFeeType.PROSPECTUS]: 'Prospectus Fee',
    [FinanceFeeType.STUDENTID]: 'Student ID Fee',
    [FinanceFeeType.UNIFORM]: 'Uniform Fee',
    [FinanceFeeType.STUDENTWELFARE]: 'Student Welfare Fee',
    [FinanceFeeType.BOOKBANK]: 'Book Bank Fee',
    [FinanceFeeType.EXAMFEES]: 'Exam Fees',
    [FinanceFeeType.MISCELLANEOUS]: 'Miscellaneous Fee',
    [FinanceFeeType.SEMESTERFEE]: 'Semester Fee'
  };
  return labels[type] ?? type;
}

export function getScheduleLabel(schedule: FinanceFeeSchedule): string {
  const map: Record<string, string> = {
    YEARLY: 'Yearly',
    ONETIME: 'One-Time',
    HALF_YEARLY: 'Semester-wise'
  };
  return map[schedule] ?? schedule;
}

export function getFeeActionLabel(feeAction: FeeActions): string {
  const map: Record<string, string> = {
    [FeeActions.DEPOSIT]: 'Fee Deposit',
    [FeeActions.REFUND]: 'Fee Refund'
  };

  return map[feeAction] ?? feeAction;
}

export function getTransactionTypeLabel(txnType: TransactionTypes): string {
  const map: Record<string, string> = {
    [TransactionTypes.UPI]: 'UPI',
    [TransactionTypes.CASH]: 'Cash',
    [TransactionTypes.CHEQUE]: 'Cheque',
    [TransactionTypes.NEFT_IMPS_RTGS]: 'NEFT/IMPS/RTGS',
    [TransactionTypes.OTHERS]: 'Other'
  };
  return map[txnType] ?? txnType;
}

export function getSidebarItemsByUserRoles(role: UserRoles): string[] {
  const map: Record<string, string[]> = {
    [UserRoles.ADMIN]: [SIDEBAR_ITEMS.ACADEMICS, SIDEBAR_ITEMS.ADMISSIONS, SIDEBAR_ITEMS.FACULTY, SIDEBAR_ITEMS.FINANCE, SIDEBAR_ITEMS.MARKETING, SIDEBAR_ITEMS.STUDENT_REPOSITORY],
    [UserRoles.FRONT_DESK]: [SIDEBAR_ITEMS.MARKETING, SIDEBAR_ITEMS.ADMISSIONS, SIDEBAR_ITEMS.STUDENT_REPOSITORY],
    [UserRoles.FINANCE]: [SIDEBAR_ITEMS.FINANCE, SIDEBAR_ITEMS.ADMISSIONS, SIDEBAR_ITEMS.STUDENT_REPOSITORY],
    [UserRoles.REGISTAR]: [SIDEBAR_ITEMS.ADMISSIONS, SIDEBAR_ITEMS.STUDENT_REPOSITORY],
    [UserRoles.LEAD_MARKETING]: [SIDEBAR_ITEMS.MARKETING],
    [UserRoles.EMPLOYEE_MARKETING]: [SIDEBAR_ITEMS.MARKETING],
    [UserRoles.SYSTEM_ADMIN]: [SIDEBAR_ITEMS.ACADEMICS]
  }

  return map[role] ?? role;
}

export function getRequiredRoles(item: string): string[] {
  const map: Record<string, string[]> = {
    [SIDEBAR_ITEMS.ACADEMICS]: [UserRoles.ADMIN],
    [SIDEBAR_ITEMS.ADMISSIONS]: [UserRoles.ADMIN, UserRoles.REGISTAR, UserRoles.FINANCE, UserRoles.FRONT_DESK],
    [SIDEBAR_ITEMS.FACULTY]: [UserRoles.ADMIN],
    [SIDEBAR_ITEMS.FINANCE]: [UserRoles.ADMIN, UserRoles.FINANCE],
    [SIDEBAR_ITEMS.MARKETING]: [UserRoles.ADMIN, UserRoles.LEAD_MARKETING, UserRoles.EMPLOYEE_MARKETING, UserRoles.FRONT_DESK],
    [SIDEBAR_ITEMS.STUDENT_REPOSITORY]: [UserRoles.ADMIN, UserRoles.REGISTAR, UserRoles.FINANCE, UserRoles.FRONT_DESK],
  }

  return map[item] ?? item
}

export function getHomePage(role: UserRoles): string {
  const map: Record<string, string> = {
    [UserRoles.ADMIN] : "/c/marketing/all-leads",
    [UserRoles.FRONT_DESK] : "/c/marketing/all-leads",
    [UserRoles.FINANCE] : "/c/admissions/application-process",
    [UserRoles.REGISTAR] : "/c/admissions/application-process",
    [UserRoles.LEAD_MARKETING] : "/c/marketing/all-leads",
    [UserRoles.EMPLOYEE_MARKETING] : "/c/marketing/all-leads",
    [UserRoles.SYSTEM_ADMIN] : "/c/academics/subjects"
  }

  return map[role] ?? ""
}