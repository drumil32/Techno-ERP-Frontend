export interface AdminTrackerContextType {
    getAnalytics: () => Promise<any>;
}

export interface AdminAnalyticsResponse {
    success: boolean;
    message: string;
    data?: {
      allLeadsAnalytics?: LeadsAnalytics;
      yellowLeadsAnalytics?: YellowLeadsAnalytics;
    };
    error?: string;
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
    yellow: number;
  }
  
export interface YellowLeadsAnalytics {
    _id: string | null;
    campusVisit: number;
    noCampusVisit: number;
    unconfirmed: number;
    declined: number;
    finalConversion: number;
}
  
export interface AnalyticsSection {
    title: string;
    headers: string[];
    values: number[];
    total: number;
  };