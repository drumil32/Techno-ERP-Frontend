'use client';
import { HoverContext } from '@/components/custom-ui/sidebar/hover-context';
import { SidebarProvider } from '@/components/custom-ui/sidebar/sidebar-context';
import TechnoSidebar from '@/components/custom-ui/sidebar/techno-sidebar';
import { useState } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <HoverContext.Provider value={hovered}>
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                    <aside
                        className={`fixed left-0 top-0 h-full bg-primary text-white transition-all duration-300 flex flex-col items-center py-6 px-2 rounded-r-4xl shadow-lg gap-8 ${hovered ? 'w-72' : 'w-[62px]'}`}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <TechnoSidebar />
                    </aside>

                    <main
                        className={`flex-1 overflow-y-auto transition-all duration-300 bg-[#FAFAFA] ${hovered ? 'pl-80' : 'pl-24'}`}
                    >
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        </HoverContext.Provider>
    );
}