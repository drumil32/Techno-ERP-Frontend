import { Button } from '@/components/ui/button';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

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
  return (
    <div className="z-10 bottom-0 left-0 flex items-center justify-end space-x-4 mt-6 p-4 bg-white h-18 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
      <Button
        type="button"
        onClick={onSubmit}
        disabled={
          (!confirmationChecked || form.formState.isSubmitting) ?? form.formState.isSubmitting
        }
      >
        {form.formState.isSubmitting ? 'Submitting...' : 'Submit & Continue'}
      </Button>
    </div>
  );
};

export default EnquiryFormFooter;
