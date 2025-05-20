import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
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
import { Button } from '@/components/ui/button';

import { fetchTransactionReceiptData } from '../helpers/fetch-data';
import { downloadFeeReceipt } from '../../admissions/helpers/download-pdf';

import { Loader, Receipt, ReceiptIndianRupee, ZoomIn, ZoomOut, Printer } from 'lucide-react';

export function TransactionReceiptDialog({
  studentId,
  transactionId
}: {
  studentId: string;
  transactionId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      setPdfDataUrl(null);
      try {
        const res = await fetchTransactionReceiptData({ studentId, transactionId });
        if (res) {
          const { url } = await downloadFeeReceipt(res);
          setPdfDataUrl(url || null);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    if (open) loadPreview();
  }, [open, studentId, transactionId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="ring-primary ring-1 text-primary hover:bg-primary/80 hover:ring-transparent hover:text-white"
        >
          <ReceiptIndianRupee className="size-4" /> Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="text-primary w-6 h-6" />
              <DialogTitle>Transaction Slip</DialogTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription>Transaction receipt preview</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {pdfDataUrl ? (
            <div className="overflow-auto h-full">
              <iframe
                ref={iframeRef}
                src={pdfDataUrl}
                className="w-full h-full border border-gray-200 bg-white"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: '0 0',
                  width: `${100 / scale}%`,
                  height: `${100 / scale}%`
                }}
                title="Receipt PDF Preview"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <Loader className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
