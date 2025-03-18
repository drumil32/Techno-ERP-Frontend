'use client'
import { createContext, useContext, ReactNode } from 'react';
import { useTechnoFilterContext } from '../filter/filter-context';
import Cookies from 'js-cookie';

interface AdminTrackerContextType {
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
  

const AdminTrackerContext = createContext<AdminTrackerContextType | null>(null);

export function AdminTrackerProvider({ children }: { children: ReactNode }) {

    const { filters } = useTechnoFilterContext();
    
    const getAnalytics = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const parseDate = (date: any) => {
            const parsedDate = new Date(date);
            return isNaN(parsedDate.getTime()) ? null : parsedDate.toLocaleDateString("en-GB");
        };
        
        const transformedValues = {
            startDate:  parseDate(filters?.date_start),
            endDate: parseDate(filters?.date_end),
            location: filters?.location,
            course: filters?.course,
            lead: filters?.lead,
            assignedTo: filters?.assignedTo
        }

        const authToken = Cookies.get('token');

        try {
            const response = await fetch(`${apiUrl}/crm/admin/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${authToken}`
                },
                body: JSON.stringify(transformedValues),
                credentials: 'include'
            });

            const data: AdminAnalyticsResponse = await response.json();
    
            if (data?.error) {
                return data?.error;
            };
    
            return data?.data;
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <AdminTrackerContext.Provider value={{getAnalytics}}>
            {children}
        </AdminTrackerContext.Provider>
    );
}

export function useAdminTrackerContext() {
    const context = useContext(AdminTrackerContext);
    if (!context) {
        throw new Error('useAdminTrackerContext must be used within a AdminTrackerProvider');
    }
    return context;
}
