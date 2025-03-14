"use client"
import { useState } from "react";
import { HoverContext } from './hover-context';
import TechnoSidebarHeader from "./techno-sidebar-header";
import TechnoSidebarBody from "./techno-sidebar-body";
import TechnoSidebarFooter from "./techno-sidebar-footer";

export default function TechnoSidebar() {
    return (
        <TechnoSidebarSkeleton>
            <TechnoSidebarHeader></TechnoSidebarHeader>
            <TechnoSidebarBody></TechnoSidebarBody>
            <span className="mt-auto"></span>
            <TechnoSidebarFooter></TechnoSidebarFooter>
        </TechnoSidebarSkeleton>
    )
}

function TechnoSidebarSkeleton({ children }: { children: React.ReactNode }) {
    const [hovered, setHovered] = useState<boolean>(false)
    return (
        <HoverContext.Provider value={hovered}>
           <aside className="absolute top-0 left-0 bg-primary group h-full w-24 hover:w-72 bg-gray-900 text-white transition-all duration-300 flex flex-col items-center py-4 px-6 rounded-r-4xl shadow-lg gap-8"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {children}
            </aside>
        </HoverContext.Provider>
    );
}
