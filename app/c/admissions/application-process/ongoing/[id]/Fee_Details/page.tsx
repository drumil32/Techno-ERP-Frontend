"use client"
import { useHomeContext } from "@/app/c/HomeRouteContext";
import { StudentFeesForm } from "@/components/custom-ui/enquiry-form/stage-2/student-fees-form";
import AdmissionFormLayout from "@/components/layout/admission-form-layout";
import AdmissionLayout from "@/components/layout/admission-layout";
import RoleGuard from "@/guards/role-guard";
import { getHomePage } from "@/lib/enumDisplayMapper";
import useAuthStore from "@/stores/auth-store";
import { UserRoles } from "@/types/enum";
import { useEffect } from "react";

export default function StudentFeesPage() {
    const { user } = useAuthStore()
    const { setHomeRoute, homeRoute } = useHomeContext();

    useEffect(() => {
        if (user && user.roles) {
            for (const role of user.roles) {
                const homePage = getHomePage(role);
                if (homePage) {
                    setHomeRoute(homePage)
                    return;
                }
            }
        }

    }, [user])
    return (
        <RoleGuard allowedRoles={[UserRoles.ADMIN, UserRoles.REGISTAR, UserRoles.FINANCE, UserRoles.FRONT_DESK]} fallbackPath={homeRoute} >
            <AdmissionFormLayout>
                <StudentFeesForm />
            </AdmissionFormLayout>
        </RoleGuard>
    );
}
