'use client'

import { format, isBefore, parseISO, startOfDay } from 'date-fns';
import { useCallback, useRef, useState, DragEvent, ChangeEvent, useEffect } from 'react';
import { uploadDocumentAPI } from './helpers/apiRequest'; // Assuming this exists
import { DocumentType } from '@/types/enum'; // Assuming this exists
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  FileText,
  LinkIcon,
  Loader2,
  Upload,
  UploadCloud,
  X,
  XCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { getReadableDocumentName } from './helpers/mapperFunction';

interface SingleEnquiryUploadDocumentProps {
  enquiryId: string;
  documentType: DocumentType;
  existingDocument?: EnquiryDocument;
  acceptedFileTypes?: string;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: any) => void;
}

export interface EnquiryDocument {
  _id: string;
  type: string;
  fileUrl: string;
  dueBy: string;
}

function getFilenameFromUrl(url: string): string {
  if (!url) {
    return '';
  }
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    return decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1));
  } catch (e) {
    const parts = url.split('/');
    return parts[parts.length - 1] || 'unknown_file';
  }
}

function formatFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) return bytes + ' B';
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  return bytes.toFixed(dp) + ' ' + units[u];
}

export const SingleEnquiryUploadDocument = ({
  enquiryId,
  documentType,
  existingDocument,
  acceptedFileTypes = '.pdf,.jpeg,.jpg,.png',
  onUploadSuccess,
  onUploadError
}: SingleEnquiryUploadDocumentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(() => {
    if (existingDocument?.dueBy) {
      try {
        const parsedDate = parseISO(existingDocument.dueBy);
        return parsedDate;
      } catch (e) {
        console.error('Error parsing due date:', existingDocument.dueBy, e);
        return undefined;
      }
    }
    return undefined;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uniqueInputId = `file-upload-${documentType.toString().replace(/_/g, '-')}-${enquiryId}`;

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  useEffect(() => {
    setSelectedFile(null);
    setDueDate(existingDocument?.dueBy ? parseISO(existingDocument.dueBy) : undefined);
    setStatus(null);
    resetFileInput();
  }, [existingDocument, resetFileInput]);

  const handleFileSelection = useCallback(
    (file: File | null) => {
      setStatus(null);
      if (file) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const allowedExtensions = acceptedFileTypes
          .split(',')
          .map((ext) => ext.trim().replace('.', ''));
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
          setStatus({
            type: 'error',
            message: `Invalid file type. Please upload: ${allowedExtensions.join(', ').toUpperCase()}`
          });
          setSelectedFile(null);
          resetFileInput();
          return;
        }
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    },
    [acceptedFileTypes, resetFileInput]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event.target.files?.[0] || null);
    event.target.value = '';
  };

  const handleRemoveFile = useCallback(() => {
    handleFileSelection(null);
    resetFileInput();
  }, [handleFileSelection, resetFileInput]);

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isLoading) setIsDragging(true);
    },
    [isLoading]
  );

  const handleDragLeave = useCallback((event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      if (isLoading) return;
      const file = event.dataTransfer.files?.[0] || null;
      handleFileSelection(file);
      if (fileInputRef.current && event.dataTransfer.files) {
        fileInputRef.current.files = event.dataTransfer.files;
      }
    },
    [isLoading, handleFileSelection]
  );

  const handleDueDateSelect = (date: Date | undefined) => {
    setStatus(null);
    if (date && isBefore(date, startOfDay(new Date()))) {
      setStatus({ type: 'error', message: 'Due date cannot be in the past.' });
      setDueDate(date);
    } else {
      setDueDate(date);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !dueDate) {
      setStatus({ type: 'error', message: 'Please select a file and a due date.' });
      return;
    }

    if (dueDate && isBefore(dueDate, startOfDay(new Date()))) {
      setStatus({ type: 'error', message: 'Due date cannot be in the past.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('id', enquiryId);
      formDataPayload.append('type', documentType);
      if (selectedFile) {
        formDataPayload.append('document', selectedFile);
      }

      if (dueDate) {
        const formatedDate = format(dueDate, 'dd/MM/yyyy');
        formDataPayload.append('dueBy', formatedDate);
      }

      const response:any = await uploadDocumentAPI(formDataPayload);

      const updatedDocuments = response?.documents;

      if (onUploadSuccess && Array.isArray(updatedDocuments)) {
        console.log("Calling onUploadSuccess with updated documents array.");
        onUploadSuccess(updatedDocuments); 
        setSelectedFile(null); 
        resetFileInput(); 
      } else if (onUploadSuccess) {
        console.error("Upload successful, but response.documents is not an array or missing:", response);
      }
      setStatus({
        type: 'success',
        message: `${getReadableDocumentName(documentType)} uploaded successfully!`
      });
    } catch (error) {
      console.error('Upload failed:', error);
      let errorMessage = 'File upload failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        errorMessage = error.message;
      } else if (
        error &&
        typeof error === 'object' &&
        'ERROR' in error &&
        typeof error.ERROR === 'string'
      ) {
        errorMessage = error.ERROR;
      }
      setStatus({ type: 'error', message: errorMessage });
      if (onUploadError) onUploadError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const canUpload =
    !isLoading && (!!selectedFile || (!!dueDate && !isBefore(dueDate, startOfDay(new Date()))));

  const displayExistingDocument = existingDocument && !selectedFile;
  const existingFilename = existingDocument ? getFilenameFromUrl(existingDocument.fileUrl) : '';
  const existingDueDateFormatted = existingDocument?.dueBy
    ? format(parseISO(existingDocument.dueBy), 'MMM dd, yyyy')
    : 'No due date set';

  return (
    <div className="w-2/3 py-3 border-b border-gray-200 last:border-b-0">
      <div className="flex justify-between items-start mb-2">
        <Label className="text-sm font-semibold text-gray-800 flex">
          {getReadableDocumentName(documentType)}
          {existingDocument && (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="#22C55E"
              />
              <path
                d="M8 12L11 15L16 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </Label>
        {displayExistingDocument && (
          <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <div className="overflow-hidden">
              <a
                href={existingDocument.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-700 hover:underline truncate block"
                title={`View ${existingFilename}`}
              >
                {existingFilename}
              </a>
              <span className="text-gray-500 block">Due: {existingDueDateFormatted}</span>
            </div>
            <a
              href={existingDocument.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open document in new tab"
              className="ml-1 text-blue-500 hover:text-blue-700 flex-shrink-0"
            >
              <LinkIcon className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 w-full">
        <div className="">
          {!isLoading &&
            <div className='flex gap-2 mt-2'>
              <Label
                htmlFor={uniqueInputId}
                className={cn(
                  'flex flex-col items-center justify-center w-full sm:w-64 md:w-80 lg:w-96', // Responsive width
                  'border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out',
                  'relative h-20', // Fixed height
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex gap-3 items-center justify-center text-center pointer-events-none px-3 py-2">
                  <UploadCloud
                    className={cn('w-6 h-6', isDragging ? 'text-indigo-500' : 'text-gray-400')}
                    aria-hidden="true"
                  />
                  <div className="text-left">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Drop file or</span>{' '}
                      <span className="font-semibold text-indigo-600 hover:underline">Choose</span>
                      {existingDocument && <span className="font-medium"> to add/replace</span>}
                    </p>
                    <p className="text-[11px] text-gray-500">PDF, JPG, PNG supported</p>
                  </div>
                </div>
                <Input
                  id={uniqueInputId}
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={isLoading}
                  accept={acceptedFileTypes}
                />
              </Label>
              {selectedFile && (
                <div
                  className={cn(
                    'flex items-center justify-between gap-3 p-2 h-20',
                    'border border-purple-200 bg-purple-50 rounded-lg',
                    'w-full sm:w-64 md:w-80 lg:w-96'
                  )}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span
                        className="text-sm font-medium text-purple-800 truncate"
                        title={selectedFile.name}
                      >
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-purple-600">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-purple-500 hover:bg-purple-100 hover:text-purple-700 flex-shrink-0 rounded-full"
                    onClick={handleRemoveFile}
                    aria-label="Remove file"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          }

          {isLoading && (
            <div className="flex items-center justify-center h-20 w-full sm:w-64 md:w-80 lg:w-96 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
              Processing...
            </div>
          )}
        </div>

        <div className='flex gap-4'>
          {/* Due Date Area */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <Label
              htmlFor={`due-date-picker-${uniqueInputId}`}
              className="text-xs font-medium text-gray-600 mb-1 block "
            >
              Due by
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={`due-date-picker-${uniqueInputId}`}
                  variant={'outline'}
                  className={cn(
                    'w-full sm:w-[197px] justify-start text-left font-normal h-10 rounded-[5px]',
                    !dueDate && 'text-muted-foreground',
                    // Add red border if date is selected but invalid
                    dueDate &&
                    isBefore(dueDate, startOfDay(new Date())) &&
                    'border-red-500 focus-visible:ring-red-500'
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? (
                    format(dueDate, 'MM/dd/yy')
                  ) : (
                    <span className="text-xs">Pick Due Date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={handleDueDateSelect}
                  initialFocus
                  disabled={isLoading || ((date) => isBefore(date, startOfDay(new Date())))}
                  captionLayout={"dropdown-buttons"}
                  fromYear={new Date().getFullYear() - 100}
                  toYear={new Date().getFullYear() + 10}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Upload Button */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            {/* Spacer for alignment on small screens */}
            <Label className="text-xs font-medium text-transparent select-none mb-1 block">
              .
            </Label>
            <Button
              variant={'outline'}
              onClick={handleUpload}
              disabled={!canUpload} // Use the calculated canUpload state
              className="w-full sm:w-auto h-10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Update {/* Changed text to Update */}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Status Messages - Placed below the controls */}
      {status && (
        <div
          className={cn(
            'mt-2 flex items-center text-xs px-1',
            status.type === 'error' ? 'text-red-600' : 'text-green-600'
          )}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          ) : (
            <XCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
};
