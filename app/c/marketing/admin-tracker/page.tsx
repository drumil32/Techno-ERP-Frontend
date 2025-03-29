import CRMLayout from "@/components/layout/crm-layout";
import AdminTracker from "@/components/layout/admin-tracker/admin-tracker";
import { AdminTrackerProvider } from "@/components/layout/admin-tracker/admin-tracker-context";
import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";

export default function AdminTrackerPage() {
    return (
        <CRMLayout>
            <TechnoFilterProvider key="admin-tracker">
                <AdminTrackerProvider key="admin-tracker">
                    <AdminTracker />
                </AdminTrackerProvider>
            </TechnoFilterProvider>
        </CRMLayout>
    );
}
