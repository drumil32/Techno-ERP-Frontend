'use client';
import { useEffect, useState } from 'react';
import { HoverContext } from '../custom-ui/sidebar/hover-context';
import TechnoSidebar from '../custom-ui/sidebar/techno-sidebar';
import { SidebarProvider, useSidebarContext } from '../custom-ui/sidebar/sidebar-context';
import { useRouter } from 'next/navigation';

export default function AppLayout() {
    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <HoverContext.Provider value={hovered}>
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                    <aside
                        className={`fixed left-0 top-0 h-full bg-primary text-white transition-all duration-300 flex flex-col items-center py-6 px-2  rounded-r-4xl shadow-lg gap-8 ${hovered ? 'w-72' : 'w-[62px]'
                            }`}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <TechnoSidebar />
                    </aside>

                    <main
                        className={`flex-1 overflow-y-auto transition-all duration-300 bg-[#FAFAFA] ${hovered ? 'pl-80' : 'pl-24'
                            }`}
                    >
                        <ContentRenderer />
                    </main>
                </div>
            </SidebarProvider>
        </HoverContext.Provider>
    );
}

function ContentRenderer() {
    const { sidebarActiveItem } = useSidebarContext();
    const router = useRouter();

    useEffect(() => {
        switch (sidebarActiveItem) {
            case 'Marketing':
                router.push('/crm');
                break;
            case 'Admissions':
                router.push('/admissions');
                break;
            default:
                router.push('/');
        }
    }, [sidebarActiveItem, router]);

    return null; 
}
