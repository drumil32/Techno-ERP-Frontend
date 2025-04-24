import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ConfirmDialog({ open, title, icon, description, onCancel, onConfirm }: {
    open: boolean;
    title: string;
    icon: React.ReactNode;
    description: React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={open => !open && onCancel()}>
            <DialogContent>
                <DialogTitle>
                    <span className="flex text-2xl items-center gap-2">
                        {icon}
                        {title}
                    </span>
                </DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel} className="hover:bg-gray-200 hover:text-black">Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm} className="text-red-100 hover:text-destructive hover:bg-red-200">Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
