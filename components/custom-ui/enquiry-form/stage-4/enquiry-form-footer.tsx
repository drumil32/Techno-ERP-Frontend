import { Button } from '@/components/ui/button';
import React, { useState, useEffect, JSX } from 'react';
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

interface EnquiryFormFooterProps {
  form: UseFormReturn<any>;
  onSubmit: () => void;
  confirmationChecked: boolean;
  saveDraft: () => void;
  isSavingDraft?: boolean;
  draftExists?: boolean;
  closeOnError?: boolean;
  customSaveDialog?: JSX.Element;
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

  useEffect(() => {
    const subscription = form.watch(() => {
      if (draftSaved) {
        setDraftSaved(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, draftSaved]);

  function onError() {
    console.log('Error in submission');
    console.log(form.formState.errors);
    toast.error('Error in submission');
  }

  function handleSubmitClick() {
    try {
      form.handleSubmit(onSubmit, onError)();
    } finally {
      if (closeOnError) {
        setSubmitDialogOpen(false);
      }
    }
  }

  async function handleDialogSaveDraft() {
    try {
      await saveDraft();
      setDraftSaved(true);
    } finally {
      setDraftDialogOpen(false);
    }
  }

  return (
    <div className="z-10 bottom-0 left-0 flex items-center justify-between space-x-4 mt-6 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] sticky">
      <div className="absolute bottom-0 left-0 -z-100 w-screen bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden"></div>

      {/* Draft Button and Dialog */}
      <Dialog open={isDraftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" disabled={isSavingDraft}>
            <span className="font-inter font-semibold text-[12px]">
              {isSavingDraft
                ? 'Saving...'
                : draftSaved
                  ? 'Draft Saved!'
                  : draftExists
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
            <Button type="button" onClick={handleDialogSaveDraft} disabled={isSavingDraft}>
              {isSavingDraft ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubmitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            disabled={
              !confirmationChecked || !draftSaved || form.formState.isSubmitting || isSavingDraft
            }
          >
            <span className="font-inter font-semibold text-[12px]">
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit & Continue'}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <DialogTitle>
              {form.formState.isSubmitting ? 'Submitting Enquiry...' : 'Submit & Continue'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 items-center text-left">
            <FaCircleExclamation className="text-yellow-500 w-8 h-8" />
            <span>Please reverify all details again before submitting.</span>
          </div>
          {customSaveDialog ? customSaveDialog : <></>}
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
