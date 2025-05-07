'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FinanceLayout } from "@/components/layout/finance-layout";
import CourseDuesDetails from "@/components/layout/finance-course-dues/course-dues-page";
import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";

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
      <TechnoFilterProvider key="college-name">
        <FinanceLayout>
          <CourseDuesDetails />
        </FinanceLayout>
      </TechnoFilterProvider>
    </QueryClientProvider>
  )
}
