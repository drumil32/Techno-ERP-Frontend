import { useEffect, useRef, useState } from 'react';
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
import {
  Download,
  DownloadIcon,
  FileArchive,
  Loader,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  DownloadCloud,
  Printer,
  FileTextIcon
} from 'lucide-react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { downloadStep4 } from './helpers/download-pdf';
import { useQuery } from '@tanstack/react-query';
import { getEnquiry } from '../stage-1/enquiry-form-api';
import { fetchDataForAdmissionFeeReceipt } from '@/components/layout/admissions/helpers/fetch-data';

export function DownloadStep4({
  tableActionButton = true, 
  studentId, 
}: { 
  tableActionButton?: boolean; 
  studentId: string;
}) {

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [scale, setScale] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState<number | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoading(true);
      setPdfDataUrl(null);
      try {
        const res  = await getEnquiry(studentId);
        const feeReciptData = await fetchDataForAdmissionFeeReceipt({studentId})
        if (res && feeReciptData) {
          const data = {...res, ...feeReciptData}
          const { url, fileName } = await downloadStep4(data);
          if (fileName) setFileName(fileName);
          if (url) setPdfDataUrl(url);
          else toast.error('Error in showing preview.');
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load preview');
      } finally {
        setIsLoading(false);
      }
    };

    if (downloadOpen) loadPreview();
  }, [downloadOpen, studentId]);

  useEffect(() => {
    if (!iframeRef.current || !pdfDataUrl) return;

    const iframe = iframeRef.current;
    const handleLoad = () => {
      const pdfDocument = iframe.contentDocument;
      if (pdfDocument) {
        const toolbar = pdfDocument.querySelector('.toolbar') as HTMLElement;
        const secondaryToolbar = pdfDocument.querySelector('#secondaryToolbar') as HTMLElement;
        const pageCountElement = pdfDocument.querySelector('#numPages');
        if (toolbar) toolbar.style.display = 'none';
        if (secondaryToolbar) secondaryToolbar.style.display = 'none';
        if (pageCountElement) setNumPages(parseInt(pageCountElement.textContent || '0'));
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [pdfDataUrl]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleNextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber((prev) => prev + 1);
      resetScrollPosition();
    }
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
      resetScrollPosition();
    }
  };

  const resetScrollPosition = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const handleDownload = () => {
    if (!pdfDataUrl) return;
    const link = document.createElement('a');
    link.href = pdfDataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!iframeRef.current || !pdfDataUrl) return;
    try {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        iframeWindow.focus();
        iframeWindow.print();
      } else {
        toast.error('Failed to access PDF viewer. Please download the PDF.');
      }
    } catch (error) {
      toast.error('Failed to initiate print. Please try downloading the PDF.');
    }
  };

  return (
    <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
      <DialogTrigger asChild>
        {tableActionButton ?
          <Button
            variant={'outline'}
            className="cursor-pointer mx-auto"
            onClick={() => setDownloadOpen(true)}
            title='Fee Details'
          >
            <FileTextIcon  className="text-primary" />
          </Button>
          :
          <Button
            variant="outline"
            className="h-12 justify-start px-6 py-3 border-gray-200 hover:bg-gray-50"
            onClick={() => setDownloadOpen(true)}
          >
            <FileTextIcon className="w-5 h-5 mr-3 text-amber-600" />
            <span className="text-gray-700 font-medium">Fee Details</span>
            <DownloadCloud className="w-4 h-4 ml-auto text-gray-400" />
          </Button>
        }

      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <DownloadIcon className="text-primary w-6 h-6" />
            Download Fee Details
          </DialogTitle>
          <DialogDescription className="my-3">
            Preview and download Fee Details.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full h-[60vh] flex flex-col">
          <div className="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={scale >= 2.5}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {numPages && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={pageNumber === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={pageNumber === numPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint} disabled={!pdfDataUrl}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="default" size="sm" onClick={handleDownload} disabled={!pdfDataUrl}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-auto bg-gray-200 border border-gray-300 rounded"
          >
            <div
              ref={pdfContainerRef}
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
                  <Loader className="w-8 h-8 text-gray-500 animate-spin mb-2" />
                  <p className="text-gray-600">Loading document...</p>
                </div>
              ) : pdfDataUrl ? (
                <div className="relative" style={{ width: '100%', height: '100%' }}>
                  <iframe
                    ref={iframeRef}
                    src={`${pdfDataUrl}#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0`}
                    width="100%"
                    height="100%"
                    className="absolute inset-0"
                    style={{ border: 'none' }}
                    title="PDF Preview"
                  >
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <FaCircleExclamation className="w-10 h-10 text-yellow-500 mb-4" />
                      <p className="text-gray-700 mb-4">
                        Your browser doesn't support PDF preview. Please download the PDF to view
                        it.
                      </p>
                      <Button onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </iframe>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <FaCircleExclamation className="w-10 h-10 text-red-500 mb-4" />
                  <p className="text-gray-700">Failed to load PDF preview.</p>
                </div>
              )}
            </div>
          </div>
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
