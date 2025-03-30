import { Button } from '@/components/ui/button'
import React from 'react'

interface EnquiryFormFooterProps {
  saveDraft: () => void;
  onSubmit: () => void;
}

const EnquiryFormFooter: React.FC<EnquiryFormFooterProps> = ({ saveDraft , onSubmit}) => {
  return (
    <div className="fixed w-full bottom-0 bg-white shadow-md p-4 border-t flex justify-between items-center">
    <Button type="button" onClick={saveDraft}>
      <span className="font-inter font-semibold text-[12px]">Save Draft</span>
    </Button>

    <Button type="submit" onClick={onSubmit}>
      <span className="font-inter font-semibold text-[12px]">Submit & Continue</span>
    </Button>
  </div>
  )
}

export default EnquiryFormFooter