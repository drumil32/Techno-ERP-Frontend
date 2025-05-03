
'use client'

import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";
import { FinanceLayout } from "@/components/layout/finance-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudentDuesPage from "@/components/layout/finance-student-dues/finance-student-dues-page";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
    },
  },
});

export default function FinancePage() {
    return (
        <QueryClientProvider client={queryClient}>
            <FinanceLayout>
                <TechnoFilterProvider key="student-dues">
                    <StudentDuesPage/>
                </TechnoFilterProvider>
            </FinanceLayout>
        </QueryClientProvider>
    )
}