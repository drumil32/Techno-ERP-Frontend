import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { FaCircleExclamation } from 'react-icons/fa6';
import { toast } from 'sonner';
import {
  BadgeIndianRupee,
  Building,
  Check,
  CheckCircle,
  DownloadCloud,
  FileArchive,
  FileText,
  GraduationCap,
  Home,
  Loader2
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import {
  fetchDataForAdmissionFeeReceipt,
  fetchDataForAdmissionReceipt
} from '@/components/layout/admissions/helpers/fetch-data';
import {
  downloadAdmissionForm,
  downloadFeeReceipt
} from '@/components/layout/admissions/helpers/download-pdf';

interface EnquiryFormFooterProps {
  form: UseFormReturn<any>;
  onSubmit: () => Promise<boolean> | void;
  confirmationChecked?: boolean;
  saveDraft: () => Promise<boolean> | void;
  isSavingDraft?: boolean;
  draftExists?: boolean;
  customSaveDialog?: React.ReactNode;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({
  form,
  onSubmit,
  confirmationChecked,
  saveDraft,
  isSavingDraft,
  customSaveDialog,
  draftExists
}) => {
  const params = useParams();
  const studentId = params.id as string;
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isDraftDialogOpen, setDraftDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [currentDownload, setCurrentDownload] = useState<string | null>(null);

  async function handleSubmitClick() {
    try {
      const result = await onSubmit();
      if (result !== false) {
        setSubmitDialogOpen(false);
        setSuccessDialogOpen(true);
      }
    } catch {
      setSubmitDialogOpen(false);
      toast.error('Submission failed');
    }
  }

  async function handleRecordAndContinue() {
    setIsRecording(true);
    try {
      const result = await saveDraft();
      if (result !== false) {
        setDraftSaved(true);
        setSubmitDialogOpen(true);
      }
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsRecording(false);
    }
  }

  async function handleSaveDraft() {
    try {
      const result = await saveDraft();
      if (result !== false) {
        setDraftSaved(true);
        setDraftDialogOpen(false);
        toast.success('Draft saved successfully');
      }
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setDraftDialogOpen(false);
    }
  }

  async function handleDownloadAdmissionReceipt() {
    try {
      setIsLoading(true);
      setCurrentDownload('admission');
      const res = await fetchDataForAdmissionReceipt({ studentId });
      if (res) {
        await downloadAdmissionForm(res, true);
        toast.success('Admission Form downloaded successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download Admission Form');
    } finally {
      setIsLoading(false);
      setCurrentDownload(null);
    }
  }

  async function handleDownloadFeeReceipt() {
    try {
      setIsLoading(true);
      setCurrentDownload('fee');
      const res = await fetchDataForAdmissionFeeReceipt({ studentId });
      if (res) {
        await downloadFeeReceipt(res, true);
        toast.success('Fee Receipt downloaded successfully');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to download Fee Receipt');
    } finally {
      setIsLoading(false);
      setCurrentDownload(null);
    }
  }

  return (
    <div className="sticky bottom-0 left-0 z-10 flex items-center justify-between p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
      <Dialog open={isDraftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={isSavingDraft || isLoading}>
            {isSavingDraft
              ? 'Saving...'
              : draftSaved || draftExists
                ? 'Update Draft'
                : 'Save Draft'}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <DialogTitle>{draftExists ? 'Update Draft' : 'Save Draft'}</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 items-center text-left">
            <FaCircleExclamation className="text-yellow-500 w-8 h-8" />
            <span>Please reverify all details before {draftExists ? 'updating' : 'saving'}.</span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveDraft} disabled={isSavingDraft || isLoading}>
              {isSavingDraft ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        type="button"
        onClick={handleRecordAndContinue}
        disabled={
          !confirmationChecked ||
          form.formState.isSubmitting ||
          isSavingDraft ||
          isRecording ||
          !draftSaved ||
          isLoading
        }
      >
        {isRecording
          ? 'Saving Draft to save your updates...'
          : form.formState.isSubmitting
            ? 'Submitting...'
            : 'Record Deposit & Confirm Admission'}
      </Button>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <div className="inline-flex w-max mx-auto items-center justify-center p-1 bg-green-200 rounded-full mb-6">
              <BadgeIndianRupee size={50} className="text-green-700" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Record Deposit & Confirm Admission
            </DialogTitle>
          </DialogHeader>
          {customSaveDialog}
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                disabled={form.formState.isSubmitting || isLoading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmitClick}
              disabled={form.formState.isSubmitting || isLoading}
            >
              {form.formState.isSubmitting ? 'Submitting...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <div className="inline-flex w-max mx-auto items-center justify-center p-3 bg-emerald-100/80 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-emerald-600" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-3xl font-bold text-center text-gray-900">
              Admission Confirmed!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 mt-2">
              Your payment has been processed successfully. You can now download the documents.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Button
              variant="outline"
              className="h-12 col-start-1 justify-start px-6 py-3 border-gray-200 hover:bg-gray-50"
              onClick={handleDownloadFeeReceipt}
              disabled={isLoading}
            >
              {isLoading && currentDownload === 'fee' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 text-blue-600 animate-spin" />
                  <span className="text-gray-700 font-medium">Downloading...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-3 text-blue-600" />
                  <span className="text-gray-700 font-medium">Fee Receipt</span>
                  <DownloadCloud className="w-4 h-4 ml-auto text-gray-400" />
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="h-12 justify-start px-6 py-3 border-gray-200 hover:bg-gray-50"
              onClick={handleDownloadAdmissionReceipt}
              disabled={isLoading}
            >
              {isLoading && currentDownload === 'admission' ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 text-amber-600 animate-spin" />
                  <span className="text-gray-700 font-medium">Downloading...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-5 h-5 mr-3 text-amber-600" />
                  <span className="text-gray-700 font-medium">Admission Form</span>
                  <DownloadCloud className="w-4 h-4 ml-auto text-gray-400" />
                </>
              )}
            </Button>
          </div>

          <DialogFooter className="mt-6 sm:justify-center">
            <Button
              type="button"
              className="px-8"
              onClick={() => {
                setSuccessDialogOpen(false);
                router.push(SITE_MAP.ADMISSIONS.RECENT_ADMISSIONS);
              }}
              disabled={isLoading}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiryFormFooter;
