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
import { ChevronLeft, ChevronRight, Download, DownloadCloud, FileText, Loader, Receipt, ReceiptIndianRupee, ZoomIn, ZoomOut } from 'lucide-react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { fetchDataForAdmissionFeeReceipt } from './helpers/fetch-data';
import { downloadFeeReceipt } from './helpers/download-pdf';

export function AdmissionFeeReceiptDialog({
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
    const pdfObjectRef = useRef<HTMLObjectElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPreview = async () => {
            setIsLoading(true);
            setPdfDataUrl(null);
            try {
                const res = await fetchDataForAdmissionFeeReceipt({ studentId });
                if (res) {
                    const result = await downloadFeeReceipt(res);
                    if (result) {
                        const { url, fileName } = result
                        if (fileName) setFileName(fileName);
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
    }, [downloadOpen, studentId]);

    useEffect(() => {
        if (!pdfObjectRef.current || !pdfDataUrl) return;

        const observer = new MutationObserver((mutations) => {
            const pdfDocument = pdfObjectRef.current?.contentDocument;
            if (pdfDocument) {
                const toolbar = pdfDocument.querySelector('.toolbar');
                if (toolbar) {
                    (toolbar as HTMLElement).style.display = 'none';
                }

                const secondaryToolbar = pdfDocument.querySelector('#secondaryToolbar');
                if (secondaryToolbar) {
                    (secondaryToolbar as HTMLElement).style.display = 'none';
                }

                const pageCountElement = pdfDocument.querySelector('#numPages');
                if (pageCountElement) {
                    const pageCount = parseInt(pageCountElement.textContent || '0');
                    setNumPages(pageCount);
                }
            }
        });

        observer.observe(pdfObjectRef.current, {
            attributes: true,
            childList: true,
            subtree: true
        });

        return () => observer.disconnect();
    }, [pdfDataUrl]);

    const handleZoomIn = () => {
        setScale((prev) => {
            const newScale = Math.min(prev + 0.25, 2.5);
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    const { scrollWidth, clientWidth, scrollHeight, clientHeight } =
                        scrollContainerRef.current;
                    scrollContainerRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
                    scrollContainerRef.current.scrollTop = (scrollHeight - clientHeight) / 2;
                }
            }, 10);
            return newScale;
        });
    };

    const handleZoomOut = () => {
        setScale((prev) => {
            const newScale = Math.max(prev - 0.25, 0.5);
            setTimeout(() => {
                if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollLeft = 0;
                    scrollContainerRef.current.scrollTop = 0;
                }
            }, 10);
            return newScale;
        });
    };

    const handleNextPage = () => {
        if (numPages && pageNumber < numPages) {
            setPageNumber((prev) => prev + 1);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = 0;
                scrollContainerRef.current.scrollTop = 0;
            }
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            setPageNumber((prev) => prev - 1);
            // Reset scroll position when changing pages
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = 0;
                scrollContainerRef.current.scrollTop = 0;
            }
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

    return (
        <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
            <DialogTrigger asChild>
                {
                    tableActionButton ? (
                        <Button
                            variant={'outline'}
                            className="cursor-pointer mx-auto"
                            onClick={() => setDownloadOpen(true)}
                        >
                            <ReceiptIndianRupee className="text-primary" />
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="h-12 col-start-1 justify-start px-6 py-3 border-gray-200 hover:bg-gray-50"
                            onClick={() => setDownloadOpen(true)}
                        >
                            <FileText className="w-5 h-5 mr-3 text-blue-600" />
                            <span className="text-gray-700 font-medium">Fee Receipt</span>
                            <DownloadCloud className="w-4 h-4 ml-auto text-gray-400" />
                        </Button>
                    )
                }

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

                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleDownload}
                            disabled={!pdfDataUrl}
                            className="ml-auto"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
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
                                    <object
                                        ref={pdfObjectRef}
                                        data={`${pdfDataUrl}#page=${pageNumber}&toolbar=0&navpanes=0`}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                        className="absolute inset-0"
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
                                    </object>
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
