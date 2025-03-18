export default function TechnoRightDrawer({ title, isOpen, onClose, children }: any) {
    return (
        <div className={`fixed inset-0 z-50 flex transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {isOpen && (
                <div
                    className="fixed inset-0  bg-opacity-50"
                    onClick={onClose}
                />
            )}

            <aside className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg p-4 overflow-y-auto transition-all duration-300">
                <div className="flex h-10 w-full items-baseline ">
                    <div className="text-2xl font-bold">{title}</div>
                    <button
                        onClick={onClose}
                        className="ml-auto"
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
