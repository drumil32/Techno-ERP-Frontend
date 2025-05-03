'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FinanceLayout } from "@/components/layout/finance-layout";
import CourseDuesDetails from "@/components/layout/finance-course-dues/course-dues-page";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, 
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

export default function CourseDuesPage() {
  return (
    <QueryClientProvider client={queryClient}>
        <FinanceLayout>
          <CourseDuesDetails />
        </FinanceLayout>
    </QueryClientProvider>
  )
}