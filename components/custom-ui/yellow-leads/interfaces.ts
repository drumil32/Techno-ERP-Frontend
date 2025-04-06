import { FootFallStatus } from "@/components/layout/yellowLeads/foot-fall-tag";
import { FinalConversionStatus } from "@/components/layout/yellowLeads/final-conversion-tag";
import { finalConversion } from "@/static/enum";

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
  footFall: FootFallStatus;
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
