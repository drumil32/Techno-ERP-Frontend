'use client';
import { useState } from 'react';
import { HoverContext } from '../custom-ui/sidebar/hover-context';
import TechnoSidebar from '../custom-ui/sidebar/techno-sidebar';
import { SidebarProvider, useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import CRMLayout from './crm-layout';

export default function AppLayout() {
    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <HoverContext.Provider value={hovered}>
            <SidebarProvider>
                <div className="flex h-screen w-full">
                    <aside
                        className={`bg-primary group h-full ${hovered ? 'w-72' : 'w-24'} bg-gray-900 text-white transition-all duration-300 flex flex-col items-center py-4 px-6 rounded-r-4xl shadow-lg gap-8`}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <TechnoSidebar />
                    </aside>

                    <main className={`transition-all duration-300 flex-1 ${hovered ? 'ml-8' : 'ml-8'}`}>
                        <ContentRenderer />
                    </main>
                </div>
            </SidebarProvider>
        </HoverContext.Provider>
    );
}

function ContentRenderer() {
    const { sidebarActiveItem } = useSidebarContext();

    switch (sidebarActiveItem) {
        case 'Marketing':
            return <CRMLayout />;
        default:
            return <div>Default Page</div>;
    }
}
