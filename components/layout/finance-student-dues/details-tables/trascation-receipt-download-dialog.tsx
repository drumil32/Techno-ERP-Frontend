import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchTransactionReceiptData } from '../helpers/fetch-data';
import { downloadFeeReceipt } from '../../admissions/helpers/download-pdf';
import {
  Loader,
  Receipt,
  ReceiptIndianRupee,
  ZoomIn,
  ZoomOut,
  Printer,
  Download
} from 'lucide-react';

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
  const [fileName, setFileName] = useState('');
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!iframeRef.current || !pdfDataUrl) return;
    try {
      const pdfWindow = iframeRef.current.contentWindow;
      if (pdfWindow) {
        pdfWindow.focus();
        pdfWindow.print();
      }
    } catch (error) {
      toast.error('Failed to initiate print. Please try again.');
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = fileName || `transaction-receipt-${transactionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      setPdfDataUrl(null);
      setFileName('');
      try {
        const res = await fetchTransactionReceiptData({ studentId, transactionId });
        if (res) {
          const { url, fileName } = await downloadFeeReceipt(res);
          if (fileName) setFileName(fileName);
          setPdfDataUrl(url ? `${url}#toolbar=0` : null);
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
      <DialogContent className="sm:max-w-4xl w-full h-[80vh] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Receipt className="text-primary w-6 h-6" />
              <DialogTitle>Transaction Slip</DialogTitle>
            </div>
          </div>
          <DialogDescription>Transaction receipt preview</DialogDescription>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm self-center">{(scale * 100).toFixed(0)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={scale >= 2.5}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={!pdfDataUrl}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload} disabled={!pdfDataUrl}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-auto bg-gray-200 border border-gray-300 rounded"
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              minHeight: '100%',
              minWidth: '100%',
              padding: '20px'
            }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader className="w-6 h-6 text-gray-500 animate-spin" />
              </div>
            ) : pdfDataUrl ? (
              <iframe
                ref={iframeRef}
                src={pdfDataUrl}
                className="border border-gray-200 bg-white shadow-sm"
                style={{ width: '100%', height: '100%' }}
                title="Receipt PDF Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-700">Failed to load PDF preview.</p>
              </div>
            )}
          </div>
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
