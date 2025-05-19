import React, { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from 'react';
import { StudentData } from './helpers/interface';
import { DocumentType } from '@/types/enum';
import { getReadableDocumentName } from '../enquiry-form/stage-3/documents-section/helpers/mapperFunction';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  UploadCloud,
  FileText,
  LinkIcon,
  X,
  CheckCircle2,
  Loader2,
  XCircle,
  CalendarIcon,
  Upload
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, parseISO, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  formatFileSize,
  getFilenameFromUrl
} from '../enquiry-form/stage-3/documents-section/single-document-form';
import { updateDocument } from './helpers/api';
import { formatDateForDisplay } from './sub-sections/mandatory-doc-verification';
import Link from 'next/link';

interface SingleDocumentUploadProps {
  studentData: StudentData;
  documentType: DocumentType;
}

const SingleDocumentUpload: React.FC<SingleDocumentUploadProps> = ({
  studentData,
  documentType
}) => {
  const existingDocument = studentData?.studentInfo?.documents?.find(
    (doc) => doc.type === documentType
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dueDate, setDueDate] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingFilename = existingDocument ? getFilenameFromUrl(existingDocument.fileUrl) : '';

  const displayExistingDocument = existingDocument && !selectedFile;

  const existingDueDateFormatted = existingDocument?.dueBy;

  const uniqueInputId = `file-upload-${documentType.toString().replace(/_/g, '-')}-${studentData._id}`;

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const acceptedFileTypes = '.jpeg,.jpg,.png';

  useEffect(() => {
    setSelectedFile(null);
    setDueDate(existingDocument?.dueBy || undefined);
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
    const formattedDate = formatDateForDisplay(date);
    setStatus(null);
    if (date && isBefore(date, startOfDay(new Date()))) {
      setStatus({ type: 'error', message: 'Due date cannot be in the past.' });
      setDueDate(formattedDate);
    } else {
      setDueDate(formattedDate);
    }
  };

  const useUpdateDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: updateDocument,
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['student', studentData._id] });
      },
      onError: (error) => {
        console.error('Update failed:', error);
      }
    });
  };

  // Inside your component
  const { mutateAsync: updateDocumentMutation } = useUpdateDocument();

  const handleUpload = async () => {
    if (!selectedFile && !dueDate) {
      setStatus({ type: 'error', message: 'Please select a file and a due date.' });
      return;
    }

    if (dueDate) {
      const dueDateObj = new Date(dueDate);
      const today = startOfDay(new Date());

      if (isBefore(dueDateObj, today)) {
        setStatus({ type: 'error', message: 'Due date cannot be in the past.' });
        return;
      }
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('id', studentData._id);
      formDataPayload.append('type', documentType);
      if (selectedFile) {
        formDataPayload.append('document', selectedFile);
      }
      if (dueDate) {
        formDataPayload.append('dueBy', dueDate);
      }

      await updateDocumentMutation(formDataPayload);

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
    } finally {
      setIsLoading(false);
    }
  };

  const canUpload =
    !isLoading && (!!selectedFile || (!!dueDate && !isBefore(dueDate, startOfDay(new Date()))));

  return (
    <>
      <div className="w-2/3 py-3 border-b border-gray-200 last:border-b-0">
        <div className="flex items-start min-w-max gap-10 mb-4">
          <div className="flex items-center gap-2 min-w-[120px]">
            <Label className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              {getReadableDocumentName(documentType)}
            </Label>
            {existingDocument && (
              <svg
                className="h-4 w-4 flex-shrink-0"
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
          </div>

          {displayExistingDocument && (
            <div className="flex-1 max-w-max">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
              >
                <a
                  target="_blank"
                  href={existingDocument.fileUrl}
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-[#4E2ECC]/5 border border-[#4E2ECC]/30 rounded-lg p-3 hover:border-[#4E2ECC]/50 transition-colors group">
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex w-max items-center gap-3 flex-1 min-w-0">
                        <motion.div
                          className="bg-[#4E2ECC]/10 p-2 rounded group-hover:bg-[#4E2ECC]/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <FileText className="h-4 w-4 text-[#4E2ECC] flex-shrink-0" />
                        </motion.div>
                        <div className="min-w-0">
                          <p className="block text-sm font-medium text-[#4E2ECC] group-hover:underline truncate">
                            {existingFilename}
                          </p>
                          {existingDueDateFormatted && (
                            <span className="text-xs w-max text-gray-600">
                              Due: {existingDueDateFormatted}
                            </span>
                          )}
                        </div>
                      </div>
                      <motion.div
                        className="text-[#4E2ECC] hover:text-[#4E2ECC]/80 p-2 rounded-full hover:bg-[#4E2ECC]/10 flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </a>
              </motion.div>
            </div>
          )}
        </div>

        <>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 w-full">
            <div className="">
              {!isLoading && (
                <div className="flex gap-2 mt-2">
                  <Label
                    htmlFor={uniqueInputId}
                    className={cn(
                      'flex flex-col items-center justify-center w-full sm:w-64 md:w-80 lg:w-96',
                      'border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ease-in-out',
                      'relative h-20',
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
                          <span className="font-semibold text-indigo-600 hover:underline">
                            Choose
                          </span>
                          {existingDocument && <span className="font-medium"> to add/replace</span>}
                        </p>
                        <p className="text-[11px] text-gray-500">JPG, PNG supported</p>
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
                    <motion.div
                      className={cn(
                        'flex items-center justify-between gap-3 p-2 h-20',
                        'border border-purple-200 bg-purple-50 rounded-lg',
                        'w-full sm:w-64 md:w-80 lg:w-96'
                      )}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
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
                    </motion.div>
                  )}
                </div>
              )}

              {isLoading && (
                <motion.div
                  className="flex items-center justify-center h-20 w-full sm:w-64 md:w-80 lg:w-96 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Processing...
                </motion.div>
              )}
            </div>

            <div className="flex gap-4">
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
                        dueDate &&
                          isBefore(dueDate, startOfDay(new Date())) &&
                          'border-red-500 focus-visible:ring-red-500'
                      )}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        <span>{dueDate}</span>
                      ) : (
                        <span className="text-xs">Pick Due Date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate ? new Date(dueDate) : undefined}
                      onSelect={handleDueDateSelect}
                      initialFocus
                      disabled={isLoading || ((date) => isBefore(date, startOfDay(new Date())))}
                      captionLayout={'dropdown-buttons'}
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear() + 10}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex-shrink-0 w-full sm:w-auto">
                <Label className="text-xs font-medium text-transparent select-none mb-1 block">
                  .
                </Label>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant={'outline'}
                    onClick={handleUpload}
                    disabled={!canUpload}
                    className="w-full sm:w-auto h-10"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" /> Update
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
          {status && (
            <motion.div
              className={cn(
                'mt-2 flex items-center text-xs px-1',
                status.type === 'error' ? 'text-red-600' : 'text-green-600'
              )}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              ) : (
                <XCircle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              )}
              <span>{status.message}</span>
            </motion.div>
          )}
        </>
      </div>
    </>
  );
};

export default SingleDocumentUpload;
