import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { IAcademicDetailArraySchema, IAcademicDetailSchema } from '../schema/schema';
import { toast } from 'sonner';

interface EnquiryFormFooterProps {
  saveDraft: () => void;
  form: UseFormReturn<any>;
  onSubmit: () => void;
  isSavingDraft?: boolean;
  confirmationChecked?: boolean;
  draftExists?: boolean;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({
  saveDraft,
  form,
  onSubmit,
  isSavingDraft,
  confirmationChecked,
  draftExists
}) => {
  const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [isDraftDialogOpen, setDraftDialogOpen] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  function onError() {
    console.log('Error in submission');
    console.log(form.formState.errors);
    toast.error('Error in submission');
  }

  function handleSubmitClick() {
    const currentValues = form.getValues();

    if (currentValues.academicDetails) {
      const filteredAcademicDetails: IAcademicDetailArraySchema =
        currentValues.academicDetails.filter((entry: IAcademicDetailSchema) => {
          if (!entry) return false;
          return Object.values(entry).some((value) => value !== undefined);
        });

      form.setValue('academicDetails', filteredAcademicDetails);
    }

    setTimeout(() => {
      form.handleSubmit(onSubmit, onError)();
    }, 0);
  }

  async function handleDialogSaveDraft() {
    try {
      await saveDraft();
      setDraftSaved(true);
      toast.success(draftExists ? 'Draft updated successfully!' : 'Draft saved successfully!');
    } finally {
      setDraftDialogOpen(false);
    }
  }

  return (
    <>
      <div className="sticky bottom-0 left-0 z-10 flex items-center justify-between space-x-4 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="absolute bottom-0 left-0 -z-100 w-screen bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden"></div>

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
    </>
  );
};

export default EnquiryFormFooter;
