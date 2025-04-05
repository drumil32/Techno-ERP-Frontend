import { CampusVisitStatus } from "@/components/layout/yellowLeads/campus-visit-tag";
import { FinalConversionStatus } from "@/components/layout/yellowLeads/final-conversion-tag";

export interface YellowLead {
  _id: string;
  srNo: number;
  name: string;
  phoneNumber: string;
  altPhoneNumber: string;
  email: string;
  gender: string;
  assignedTo: string;
  location: string;
  course: string;
  campusVisit: CampusVisitStatus;
  finalConversion: FinalConversionStatus;
  remarks: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
  date: string; // DD/MM/YYYY format
  ltcDate: string; // DD/MM/YYYY format
  nextDueDate: string; // DD/MM/YYYY format
  [key: string]: any;
}
