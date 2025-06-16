"use client"
import { useHomeContext } from "@/app/c/HomeRouteContext";
import CourseLayout from "@/components/layout/course-layout";
import { SingleCoursePage } from "@/components/layout/courses/single-course-page";
import RoleGuard from "@/guards/role-guard";
import { getHomePage } from "@/lib/enumDisplayMapper";
import useAuthStore from "@/stores/auth-store";
import { UserRoles } from "@/types/enum";
import { useEffect } from "react";

export default function CourseCodePage() {
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
        <RoleGuard allowedRoles={[UserRoles.ADMIN]} fallbackPath={homeRoute}>
            <CourseLayout>
                <SingleCoursePage />
            </CourseLayout>
        </RoleGuard>
    )
}