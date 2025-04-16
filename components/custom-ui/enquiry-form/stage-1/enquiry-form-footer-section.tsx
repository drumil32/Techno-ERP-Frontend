import React, { useState } from 'react';
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

          // Keep entry if at least one field is defined (i.e. not all undefined)
          return Object.values(entry).some((value) => value !== undefined);
        });

      form.setValue('academicDetails', filteredAcademicDetails);
    }

    // Trigger form submission after filtering
    setTimeout(() => {
      form.handleSubmit(onSubmit, onError)();
    }, 0);
  }

  function handleDialogSaveDraft() {
    saveDraft();
    setDraftDialogOpen(false);
  }
  return (
    <>
      <div className="sticky bottom-0 left-0 z-10 flex items-center justify-between space-x-4 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="absolute bottom-0 left-0 -z-100 w-screen bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] overflow-hidden"></div>
        <Dialog open={isDraftDialogOpen} onOpenChange={setDraftDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" disabled={isSavingDraft}>
              <span className="font-inter font-semibold text-[12px]">
                {isSavingDraft ? 'Saving...' : draftExists ? 'Update Draft' : 'Save Draft'}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[444px]">
            <DialogHeader>
              <DialogTitle>{draftExists ? 'Update Draft' : 'Save Draft'}</DialogTitle>
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
                <Button type="button" variant="secondary" onClick={() => setDraftDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleDialogSaveDraft}>
                  Ok
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isSubmitDialogOpen} onOpenChange={setSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              disabled={!confirmationChecked || form.formState.isSubmitting || isSavingDraft}
            >
              <span className="font-inter font-semibold text-[12px]">
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit & Continue'}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[444px]">
            <DialogHeader>
              <DialogTitle>Submit & Continue</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 items-center text-left">
              <FaCircleExclamation className="text-yellow-500 w-8 h-8" />
              <span>Please reverify all details again before submitting the enquiry form.</span>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSubmitDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" onClick={handleSubmitClick}>
                  Ok
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default EnquiryFormFooter;
