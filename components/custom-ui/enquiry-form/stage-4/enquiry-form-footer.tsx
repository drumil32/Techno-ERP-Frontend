import { Button } from '@/components/ui/button';
import React from 'react';
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

interface EnquiryFormFooterProps {
  form: UseFormReturn<any>;
  onSubmit: () => void;
  confirmationChecked: boolean;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({
  form,
  onSubmit,
  confirmationChecked
}) => {

  function onError() {
    console.log('Error in submission');
    console.log(form.formState.errors);
  }

  function handleSubmitClick() {
    form.handleSubmit(onSubmit, onError)();
  }
  return (
    <div className="z-10 bottom-0 left-0 flex items-center justify-end space-x-4 mt-6 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            disabled={
              (!confirmationChecked || form.formState.isSubmitting) ?? form.formState.isSubmitting
            }
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit & Continue'}
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
              <Button type="button" variant="secondary">
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
  );
};

export default EnquiryFormFooter;
