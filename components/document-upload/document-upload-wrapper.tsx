// components/uploader-dialog-wrapper.tsx
import { UploadIcon, X } from "lucide-react";
import { DocumentUploader } from "./document-upload";
import { useState } from "react";

type UploaderDialogWrapperProps = {
    open: boolean;
    onClose: () => void;
    onFileAccepted: (files: File[]) => void;
    onSave: (file: File) => Promise<void>;
    headingText?: string;
};

export const UploaderDialogWrapper = ({
    open,
    onClose,
    onFileAccepted,
    onSave,
    headingText = "Upload Document",
}: UploaderDialogWrapperProps) => {
    if (!open) 
        return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-6">
                    <UploadIcon className="upload-document-icon" />
                    <h2 className="text-lg font-semibold">{headingText}</h2>
                </div>

                <DocumentUploader onFileAccepted={onFileAccepted} onSave={onSave} />
            </div>
        </div>
    );
};
