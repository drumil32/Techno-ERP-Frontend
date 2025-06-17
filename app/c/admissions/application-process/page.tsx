"use client"
import AdmissionLayout from "@/components/layout/admission-layout";
import AdmissionsLandingPage from "@/components/layout/admissions/admission-page";
import RoleGuard from "@/guards/role-guard";
import { getHomePage } from "@/lib/enumDisplayMapper";
import useAuthStore from "@/stores/auth-store";
import { UserRoles } from "@/types/enum";
import { useEffect } from "react";
import { useHomeContext } from "../../HomeRouteContext";

export default function AdmissionsPage() {
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
            <AdmissionLayout>
                <AdmissionsLandingPage />
            </AdmissionLayout>
        </RoleGuard>
    );
}