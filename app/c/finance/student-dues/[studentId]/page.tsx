"use client"
import { useHomeContext } from "@/app/c/HomeRouteContext";
import { FinanceLayout } from "@/components/layout/finance-layout";
import SelectedStudentDuesDetails from "@/components/layout/finance-student-dues/selected-student-dues";
import RoleGuard from "@/guards/role-guard";
import { getHomePage } from "@/lib/enumDisplayMapper";
import useAuthStore from "@/stores/auth-store";
import { UserRoles } from "@/types/enum";
import { useEffect } from "react";

export default function SelectedStudentDuesPage() {
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
        <RoleGuard allowedRoles={[UserRoles.ADMIN, UserRoles.FINANCE]} fallbackPath={homeRoute} >
            <FinanceLayout>
                <SelectedStudentDuesDetails />
            </FinanceLayout>
        </RoleGuard>
    )
}