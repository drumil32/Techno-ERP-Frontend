"use client"
import TechnoSidebarHeader from "./techno-sidebar-header";
import TechnoSidebarBody from "./techno-sidebar-body";
import TechnoSidebarFooter from "./techno-sidebar-footer";

export default function TechnoSidebar() {
    return (
        <>
            <TechnoSidebarHeader />
            <TechnoSidebarBody />
            <span className="mt-auto"></span>
            <TechnoSidebarFooter />
        </>
    );
}
