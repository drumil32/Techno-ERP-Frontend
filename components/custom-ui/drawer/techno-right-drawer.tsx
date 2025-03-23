import { ChevronsLeft } from 'lucide-react';

export default function TechnoRightDrawer({ title, isOpen, onClose, children }: any) {
    return (
        <div className={`fixed inset-0 z-50 flex transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-opacity-50"
                    onClick={onClose}
                />
            )}

            <aside className="fixed right-0 top-0 h-full w-[439px] bg-white shadow-lg overflow-y-auto transition-all duration-300">
                <div className="flex h-[52px] px-[10px] py-[12px] gap-2 w-full items-center  shadow-sm">
                    <button
                        onClick={onClose}
                        className="bg-[#F8F8F8] p-[6px] rounded-[5px] h-[28px] w-[28px] flex items-center justify-center"
                    >
                        <ChevronsLeft size={16}/>
                    </button>
                    <div className="text-[16px] font-bold">{title}</div>
                    <button
                        onClick={onClose}
                        className="bg-[#F8F8F8] p-[6px] rounded-[5px] h-[28px] w-[28px] flex items-center justify-center ml-auto"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-8">
                    {children}
                </div>
            </aside>
        </div>
    );
}
