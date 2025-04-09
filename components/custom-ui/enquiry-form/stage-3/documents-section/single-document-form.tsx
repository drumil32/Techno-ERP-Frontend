import { format } from "date-fns";
import { useCallback, useRef, useState, DragEvent } from "react";
import { uploadDocumentAPI } from "./helpers/apiRequest";
import { DocumentType } from "@/types/enum";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2, FileText, Loader2, Upload, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface SingleEnquiryUploadDocumentProps {
  enquiryId: string;
  documentType: DocumentType;
  acceptedFileTypes?: string;

  onUploadSuccess?: (response: any) => void;
  onUploadError?: (response: any) => void;
}

function formatFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
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
  acceptedFileTypes = "application/pdf,image/jpeg,image/png",
  onUploadSuccess,
  onUploadError
}: SingleEnquiryUploadDocumentProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(null);
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Please select a file first.' });
      return;
    }
    if (!dueDate) {
      setStatus({ type: 'error', message: 'Please select a due date.' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    const formatedDate = format(dueDate, 'dd/MM/yyyy')

    try {
      const formData = {
        id: enquiryId,
        type: documentType,
        document: selectedFile,
        dueBy: formatedDate
      }
      const response = await uploadDocumentAPI(formData)
      console.log(response)
      setSelectedFile(null);
      setDueDate(undefined);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadSuccess) {
        onUploadSuccess(response);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatus({ type: 'error', message: errorMessage });
      if (onUploadError) {
        onUploadError(error instanceof Error ? error : new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <div className="flex items-end gap-4 py-2">
      <div className="w-[150px] flex-shrink-0"> i
        {/*Need Mapper to display type of the */}
         <Label className="text-sm font-medium text-gray-700">{documentType}</Label>
      </div>
      <div>
        <Label htmlFor="file-upload-input-trigger" className="text-sm font-medium">
          Select Document
        </Label>
        <div className="flex items-center space-x-2 mt-1">
          <Label
            htmlFor="file-upload-input"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            id="file-upload-input-trigger"
          >
            <FileText className="mr-2 h-4 w-4" />
            {selectedFile ? 'Change File' : 'Choose File'}
          </Label>
          <Input
            id="file-upload-input"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="sr-only"
            disabled={isLoading}
          />
          {selectedFile && !isLoading && (
            <span className="text-sm text-muted-foreground truncate max-w-[200px]" title={selectedFile.name}>
              {selectedFile.name}
            </span>
          )}
        </div>
      </div>

       {/* Due Date Area */}
      <div className="flex-shrink-0">
        <Label htmlFor={`due-date-picker-${enquiryId}-${documentType}`} className="text-sm font-medium text-gray-700">
          Due by
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={`due-date-picker-${enquiryId}-${documentType}`} // Unique ID
              variant={"outline"}
              className={cn(
                // Adjust width as needed, removed w-full
                "w-[140px] justify-start text-left font-normal mt-1 h-10", // Set fixed height like others
                !dueDate && "text-muted-foreground"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {/* Display format MM/dd/yy */}
              {dueDate ? format(dueDate, "MM/dd/yy") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                setDueDate(date || undefined);
                // setStatus(null); // No longer needed
              }}
              initialFocus
              disabled={isLoading}
            />
          </PopoverContent>
        </Popover>
      </div>
      {status && (
        <div className={`flex items-center text-sm p-3 rounded-md ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || !dueDate || isLoading} // <-- Disable if no file OR no date OR loading
        className="w-full" // Make button full width for consistency
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </>
        )}
      </Button>

    </div>
  )
}
