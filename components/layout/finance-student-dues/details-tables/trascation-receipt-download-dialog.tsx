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
import { Loader, Receipt, ReceiptIndianRupee } from 'lucide-react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { fetchTransactionReceiptData } from '../helpers/fetch-data';
import { downloadFeeReceipt } from '../../admissions/helpers/download-pdf';

export function TransactionReceiptDialog({
  studentId,
  transactionId
}: {
  studentId: string;
  transactionId: string;
}) {
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      setPdfDataUrl(null);
      try {
        const res = await fetchTransactionReceiptData({ studentId, transactionId });
        if (res) {
          const result = await downloadFeeReceipt(res);
          if (result) {
            const { url, fileName } = result
            if (url) {
              setPdfDataUrl(url);
            } else {
              toast.error('Error in the showing preview.');
            }
          }
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    if (downloadOpen) {
      loadPreview();
    }
  }, [downloadOpen, studentId, transactionId]);

  return (
    <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="ring-primary ring-1 text-primary hover:bg-primary/80 hover:ring-transparent hover:text-white"
          onClick={() => setDownloadOpen(true)}
        >
          <ReceiptIndianRupee className="size-4" /> Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Receipt className="text-primary w-6 h-6" />
            Transaction Slip
          </DialogTitle>
          <DialogDescription className="my-3">
            The transaction receipt preview is shown below.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full h-[60vh]">
          {pdfDataUrl ? (
            <iframe
              ref={iframeRef}
              src={pdfDataUrl}
              className="w-full h-full border-2 border-gray-300 bg-white rounded"
              title="Receipt PDF Preview"
              onLoad={() => setDebugInfo('Iframe loaded successfully')}
              onError={(e) => {
                setDebugInfo('Iframe error occurred');
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-white border-2 border-gray-300 rounded">
              <Loader className="w-6 h-6 text-gray-500 animate-spin" />
            </div>
          )}
        </div>

        <DialogFooter className="justify-end mt-4">
          <DialogClose asChild>
            <Button variant="outline" className="font-inter text-sm" disabled={isLoading}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
