'use client'

import FinanceAdminTrackerPage from "@/components/layout/finance-admin-tracker/finance-admin-tracker";
import { FinanceLayout } from "@/components/layout/finance-layout";
import RoleGuard from "@/guards/role-guard";
import { getHomePage } from "@/lib/enumDisplayMapper";
import useAuthStore from "@/stores/auth-store";
import { UserRoles } from "@/types/enum";
import { useEffect } from "react";
import { useHomeContext } from "../../HomeRouteContext";

export default function CourseDuesPage() {
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
    <RoleGuard allowedRoles={[UserRoles.ADMIN]} fallbackPath={homeRoute} >
      <FinanceLayout>
        <FinanceAdminTrackerPage />
      </FinanceLayout>
    </RoleGuard>
  )
}
