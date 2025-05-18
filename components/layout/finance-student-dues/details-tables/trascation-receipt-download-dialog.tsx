import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { ReceiptIndianRupee } from "lucide-react";
import { FaCircleExclamation } from "react-icons/fa6";
import { fetchTransactionReceiptData } from "../helpers/fetch-data";
import { downloadFeeReceipt } from "../../admissions/helpers/download-pdf";

export function TransactionReceiptDialog({ studentId, transactionId }: { studentId: string; transactionId: string }) {
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const downloadAction = async () => {
        setIsLoading(true);
        try {
            const res = await fetchTransactionReceiptData({ studentId, transactionId });
            if (res) {
                await downloadFeeReceipt(res);
                setDownloadOpen(false); // close dialog after successful download
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Download failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Download Dialog */}
            <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
                <DialogTrigger asChild>
                    <Button variant='outline' className='ring-primary ring-1 text-primary hover:bg-primary/80 hover:ring-transparent hover:text-white'
                        onClick={() => setDownloadOpen(true)}>
                        <ReceiptIndianRupee className='size-4' /> Receipt
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex gap-2 items-center">
                            <FaCircleExclamation className="text-yellow-500 w-6 h-6" />
                            Download Transaction Slip
                        </DialogTitle>
                        <DialogDescription className="my-3">
                            Are you sure you want to download transaction slip?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 sm:justify-end">
                        <DialogClose asChild disabled={isLoading}>
                            <Button variant="outline" className="font-inter text-sm" disabled={isLoading}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={downloadAction} className="font-inter text-sm" disabled={isLoading}>
                            {isLoading ? 'Downloading...' : 'Confirm Download'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
