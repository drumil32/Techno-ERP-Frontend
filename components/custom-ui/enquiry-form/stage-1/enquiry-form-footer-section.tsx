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
  return (
    <div className="fixed w-full bottom-0 bg-white shadow-md p-4 border-t flex justify-between items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button">
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
            <Button type="button" onClick={saveDraft}>
              Ok
            </Button>
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
            <DialogTitle>Save Draft</DialogTitle>
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
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiryFormFooter;
