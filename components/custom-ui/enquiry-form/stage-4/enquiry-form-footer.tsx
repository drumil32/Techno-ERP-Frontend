import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { FaCircleExclamation } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { BadgeIndianRupee, Check } from 'lucide-react';

interface EnquiryFormFooterProps {
  form: UseFormReturn<any>;
  onSubmit: () => Promise<boolean> | void;
  confirmationChecked?: boolean;
  saveDraft: () => Promise<boolean> | void;
  isSavingDraft?: boolean;
  draftExists?: boolean;
  closeOnError?: boolean;
  customSaveDialog?: React.ReactNode;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({
  form,
  onSubmit,
  confirmationChecked,
  saveDraft,
  isSavingDraft,
  customSaveDialog,
  closeOnError = true,
  draftExists
}) => {
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isDraftDialogOpen, setDraftDialogOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const router = useRouter();
  async function handleSubmitClick() {
    try {
      const result = await onSubmit();
      if (result !== false) {
        setSubmitDialogOpen(false);
      } else {
        setSubmitDialogOpen(false);
      }
    } catch {
      setSubmitDialogOpen(false);
    }
  }

  // this variable ifFormSubmit is put there to ensure that we are differentiating actions while saving draft on submit or just saving draft
  async function handleDialogSaveDraft(isFromSubmit = false) {
    try {
      const result = await saveDraft();
      console.log('the isFromSubmit', isFromSubmit);
      if (!isFromSubmit) setDraftSaved(result !== false);
    } catch {
      setSubmitDialogOpen(false);
      console.log('the isFromSubmit', isFromSubmit);
      if (!isFromSubmit) setDraftSaved(false);
    } finally {
      setDraftDialogOpen(false);
    }
  }

  return (
    <div className="sticky bottom-0 left-0 z-10 flex items-center justify-between space-x-4 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="absolute bottom-0 left-0 -z-100 w-screen bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden"></div>

      <Dialog open={isDraftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={isSavingDraft}>
            <span className="font-inter font-semibold text-[12px]">
              {isSavingDraft
                ? 'Saving...'
                : draftSaved || draftExists
                  ? 'Update Draft'
                  : 'Save Draft'}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <DialogTitle>
              {isSavingDraft ? 'Saving Draft...' : draftExists ? 'Update Draft' : 'Save Draft'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 items-center text-left">
            <FaCircleExclamation className="text-yellow-500 w-8 h-8" />
            <span>
              Please reverify all details again before{' '}
              {draftExists ? 'updating the draft' : 'saving the enquiry form'}.
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={isSavingDraft}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => {
                handleDialogSaveDraft();
              }}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            onClick={() => {
              handleDialogSaveDraft(true);
            }}
            disabled={
              !confirmationChecked || !draftSaved || form.formState.isSubmitting || isSavingDraft
            }
          >
            <span className="font-inter font-semibold text-[12px]">
              {form.formState.isSubmitting ? 'Submitting...' : 'Record Deposit & Confirm Admission'}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <div className="inline-flex w-max mx-auto items-center justify-center p-1 bg-green-200 rounded-full mb-6">
              <BadgeIndianRupee size={50} className="text-green-700" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              {form.formState.isSubmitting
                ? 'Submitting Enquiry...'
                : 'Record Deposit & Confirm Admission'}
            </DialogTitle>
            <div className="flex gap-2 justify-center items-center text-sm">
              <span>Please reverify all details again before submitting.</span>
            </div>
          </DialogHeader>
          {customSaveDialog}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
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
    </div>
  );
};

export default EnquiryFormFooter;
