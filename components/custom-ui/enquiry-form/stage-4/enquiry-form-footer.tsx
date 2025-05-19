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
  Home
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';

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
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isDraftDialogOpen, setDraftDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const router = useRouter();

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
      } else {
      }
    } catch {
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
      } else {
      }
    } catch {
    } finally {
      setDraftDialogOpen(false);
    }
  }

  return (
    <div className="sticky bottom-0 left-0 z-10 flex items-center justify-between p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
      <Dialog open={isDraftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={isSavingDraft}>
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
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveDraft} disabled={isSavingDraft}>
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
          !draftSaved
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
            <div className="flex gap-2 justify-center items-center text-sm">
              <span>Please reverify all details before submitting.</span>
            </div>
          </DialogHeader>
          {customSaveDialog}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleSubmitClick}
              disabled={form.formState.isSubmitting}
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
              Your admission has been processed successfully. You can now download the documents.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {/* <Button
              variant="outline"
              className="h-12 col-span-2 mx-auto align-middle content-center justify-center px-6 py-3 border-gray-200 hover:bg-gray-50"
              onClick={() => {
                router.push(SITE_MAP.ADMISSIONS.DEFAULT);
              }}
            >
              <GraduationCap className="w-5 h-5 mr-3 text-gray-600" />
              <span className="text-gray-700 font-medium">Go to Admissions</span>
            </Button> */}

            <Button
              variant="outline"
              className="h-12 col-start-1  justify-start px-6 py-3 border-gray-200 hover:bg-gray-50"
              onClick={() => {}}
            >
              <FileText className="w-5 h-5 mr-3 text-blue-600" />
              <span className="text-gray-700 font-medium"> Fee Receipt</span>
              <DownloadCloud className="w-4 h-4 ml-auto text-gray-400" />
            </Button>

            <Button
              variant="outline"
              className="h-12 justify-start px-6 py-3 border-gray-200 hover:bg-gray-50"
              onClick={() => {}}
            >
              <FileArchive className="w-5 h-5 mr-3 text-amber-600" />
              <span className="text-gray-700 font-medium"> Admission Form</span>
              <DownloadCloud className="w-4 h-4 ml-auto text-gray-400" />
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
