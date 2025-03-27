import CRMLayout from "@/components/layout/crm-layout";
import AllLeadsPage from "@/components/layout/allLeads/all-leads-page";
import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";

export default function AllLeads() {
    return (
        <CRMLayout>
            <TechnoFilterProvider key="all-leads">
                <AllLeadsPage />
            </TechnoFilterProvider>
        </CRMLayout>
    );
}
