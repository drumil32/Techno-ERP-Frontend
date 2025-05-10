import { FootFallStatus } from "@/components/layout/yellowLeads/foot-fall-tag";
import { FinalConversionStatus } from "@/types/enum";

export interface YellowLead {
  _id: string;
  srNo: number;
  name: string;
  phoneNumber: string;
  altPhoneNumber: string;
  email: string;
  gender: string;
  assignedTo: string[];
  location: string;
  course: string;
  footFall: boolean;
  finalConversion: FinalConversionStatus;
  yellowLeadsFollowUpCount:number;
  remarks: string[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
  date: string; // DD/MM/YYYY format
  leadTypeModifiedDate: string; // DD/MM/YYYY format
  nextDueDate: string; // DD/MM/YYYY format
  [key: string]: any;
}
