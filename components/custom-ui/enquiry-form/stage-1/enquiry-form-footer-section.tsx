// React and Hooks
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// UI Components
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

// Icons
import { FaCircleExclamation } from 'react-icons/fa6';

interface EnquiryFormFooterProps {
  saveDraft: () => void;
  form: UseFormReturn<any>;
  onSubmit: () => void;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({ saveDraft, form, onSubmit }) => {
  function onError() {
    console.log(form.formState);
  }

  return (
    <div className="z-10 bottom-0 left-0 flex items-center justify-between space-x-4 mt-6 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <span className="font-inter font-semibold text-[12px]">Save Draft</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <DialogTitle>Save Draft</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 items-center text-center">
            <FaCircleExclamation className="text-yellow-500 w-12 h-12" />
            <span>Please reverify all details again before saving the enquiry form.</span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={saveDraft}>
                Ok
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button type="button">
            <span className="font-inter font-semibold text-[12px]">Submit & Continue</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[444px]">
          <DialogHeader>
            <DialogTitle>Submit & Continue</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 items-center text-center">
            <FaCircleExclamation className="text-yellow-500 w-12 h-12" />
            <span>Please reverify all details again before submitting the enquiry form.</span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={form.handleSubmit(onSubmit, onError)}>
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
