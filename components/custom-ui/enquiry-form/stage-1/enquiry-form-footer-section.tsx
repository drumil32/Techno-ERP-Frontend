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

import React from 'react';

interface EnquiryFormFooterProps {
  saveDraft: () => void;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({ saveDraft }) => {
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

      <Button type="submit">
        <span className="font-inter font-semibold text-[12px]">Submit & Continue</span>
      </Button>
    </div>
  );
};

export default EnquiryFormFooter;
