import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";
import { FinanceLayout } from "@/components/layout/finance-layout";
import StudentDuesPage from "@/components/layout/finance-student-dues/finance-student-dues-page";

export default function FinancePage() {
    return (
        <FinanceLayout>
            <TechnoFilterProvider key="student-dues">
                <StudentDuesPage/>
            </TechnoFilterProvider>
        </FinanceLayout>
    )
}