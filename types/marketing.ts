export type SheetItem = {
  _id: string;
  id: string;
  name: string;
};

export type UserAnalyticsData = {
  userId: string;
  userFirstName: string;
  userLastName: string;
  totalCalls: number;
  newLeadCalls: number;
  activeLeadCalls: number;
  nonActiveLeadCalls: number;
  totalFootFall: number;
  totalAdmissions: number;
};
