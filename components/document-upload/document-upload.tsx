"use client";

import { Accept, useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { Loader2, UploadIcon, X } from 'lucide-react';
import clsx from 'clsx';

type DocumentUploaderProps = {
    onFileAccepted: (files: File[]) => void;
    onSave: (file: File) => Promise<void>;
    maxSizeMB?: number;
    acceptAll?: boolean;
};

export const DocumentUploader = ({
    onFileAccepted,
    onSave,
    maxSizeMB = 20,
    acceptAll = false,
}: DocumentUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const maxSize = maxSizeMB * 1024 * 1024;
    const acceptedMimeTypes: Accept | undefined = acceptAll ? undefined : {
        'text/csv': ['.csv'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc', '.docx'],
        'application/vnd.ms-excel': ['.xls', '.xlsx'],
        'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
    };

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0];
            const messages = rejection.errors.map((e: any) => e.message).join(', ');
            setUploadMessage({ type: 'error', text: `File "${rejection.file.name}" - ${messages}` });
            setSelectedFile(null);
        } else if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileAccepted([file]);
            setUploadMessage({ type: 'success', text: `File "${file.name}" accepted successfully!` });
        }
    }, [onFileAccepted]);

    const handleSave = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            await onSave(selectedFile);
            setUploadMessage({ type: 'success', text: 'File uploaded successfully!' });
            setSelectedFile(null);
        } catch {
            setUploadMessage({ type: 'error', text: 'Failed to upload file. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDiscard = () => {
        setSelectedFile(null);
        setUploadMessage(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: acceptedMimeTypes,
        maxSize,
        multiple: false,
    });

    return (
        <>
        <div {...getRootProps()} className="border-dashed border-2 border-gray-300 rounded-lg p-8 bg-white shadow-md text-center cursor-pointer hover:border-purple-500">
            <input {...getInputProps()} />
            <p className="text-gray-600 pb-3">{isDragActive ? 'Drop the files here...' : 'Drag and drop your file here'}</p>
            <div className="flex justify-center mt-4">
                <button className="flex items-center text-white px-4 py-2 rounded-lg saveDataBtn pb-3">
                    <UploadIcon className="mr-2 w-4 h-4" />
                    Upload File
                </button>
            </div>
            <p className="text-xs mt-2 pt-2 text-black">
                {acceptAll ? 'Supports all file types' : 'CSV, Excel, Word, PDF, PPT formats are supported'} 
            </p>
            <p className="text-xs pt-1 text-black">
                Max size {maxSizeMB}MB            
            </p>

           
        </div>
         {uploadMessage && (
            <div className={clsx('mt-4 p-3 pt-3 rounded', uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                {uploadMessage.text}
            </div>
        )}

        {selectedFile && (
            <div className="flex justify-end mt-4 gap-2">
                <button onClick={handleDiscard} className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100">
                    <X className="w-4 h-4 inline mr-1" />
                    Discard
                </button>
                <button onClick={handleSave} disabled={loading} className="px-4 py-2 saveDataBtn rounded-lg disabled:opacity-50">
                    {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin inline" />}
                    Save
                </button>
            </div>
        )}
        </>
    );
};
