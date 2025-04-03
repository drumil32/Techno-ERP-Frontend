'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  label: string;
  supportedFormats?: string;
  onFileChange?: (file: File | null) => void;
  className?: string;
  dueDate?: string;
}

export const DropBox: React.FC<FileUploadProps> = ({
  label,
  supportedFormats = "PDF, JPG, PNG supported",
  onFileChange,
  className,
  dueDate
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL for images
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
      
      if (onFileChange) {
        onFileChange(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (onFileChange) {
      onFileChange(null);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">{label}</div>
        {dueDate && (
          <div className="text-sm text-gray-500">
            Due by <span className="font-medium">{dueDate}</span>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <Card className="flex-1 border border-dashed rounded-md p-4">
          {!file ? (
            <label htmlFor={`file-upload-${label}`} className="flex flex-col items-center justify-center cursor-pointer py-6">
              <input
                id={`file-upload-${label}`}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <div className="flex items-center">
                <span className="text-sm text-gray-500">Drop your file or </span>
                <span className="text-sm text-blue-600 ml-1">Choose File</span>
              </div>
              <span className="text-xs text-gray-400 mt-1">{supportedFormats}</span>
            </label>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <input
                id={`file-upload-${label}`}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <Upload className="h-6 w-6 text-gray-400 mb-2" />
              <div className="flex items-center">
                <span className="text-sm text-gray-500">File uploaded: {file.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removeFile} 
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Remove
              </Button>
            </div>
          )}
        </Card>
        
        {file && (
          <div className="flex items-center border rounded-md px-4 py-2 bg-gray-50 min-w-[200px]">
            <div className="flex flex-col flex-1">
              <div className="flex items-center">
                <File className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-600 truncate max-w-[130px]">
                  {file.name.substring(0, file.name.lastIndexOf('.'))}
                </span>
              </div>
              <span className="text-xs text-gray-400 mt-1">
                {Math.round(file.size / 1024 / 1024 * 10) / 10}MB
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};