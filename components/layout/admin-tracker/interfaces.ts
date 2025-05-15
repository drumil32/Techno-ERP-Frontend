export interface AdminTrackerContextType {
  getAnalytics: () => Promise<any>;
}

export interface AdminAnalyticsResponse {
  SUCCESS: boolean;
  MESSAGE: string;
  DATA?: {
    allLeadsAnalytics?: LeadsAnalytics;
    yellowLeadsAnalytics?: YellowLeadsAnalytics;
  };
  ERROR?: string;
}

export interface LeadsAnalytics {
  _id: string | null;
  allLeads: number;
  reached: number;
  notReached: number;
  white: number;
  black: number;
  red: number;
  blue: number;
  orange: number;
  activeLeads: number;
  invalidType: number;
}

export interface YellowLeadsAnalytics {
  _id: string | null;
  footFall: number;
  noFootFall: number;
  neutral: number;
  dead: number;
  admissions: number;
}

export interface AnalyticsSection {
  title: string;
  headers: string[];
  values: number[];
  total: number;
}
